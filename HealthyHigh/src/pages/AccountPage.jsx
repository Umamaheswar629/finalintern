// src/pages/AccountPage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Button, 
  TextField,
  Divider,
  Avatar,
  Switch,
  FormControlLabel,
  IconButton,
  Alert,
  Tab,
  Tabs,
  MenuItem
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import LogoutIcon from '@mui/icons-material/Logout';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AccountPage = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: '',
    goal: '',
    dietType: [],
    allergies: [],
    notifications: true,
    emailUpdates: true,
    mealReminders: true
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = "/login";
          return;
        }
        
        const response = await axios.get(`${API_BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Convert dietType and allergies to strings for form display if they're arrays
        const user = response.data;
        user.dietType = Array.isArray(user.dietType) ? user.dietType.join(', ') : user.dietType;
        user.allergies = Array.isArray(user.allergies) ? user.allergies.join(', ') : user.allergies;
        
        // Add UI state properties
        user.notifications = user.notificationPreferences?.notifications ?? true;
        user.emailUpdates = user.notificationPreferences?.emailUpdates ?? true;
        user.mealReminders = user.notificationPreferences?.mealReminders ?? true;
        
        setUserData(user);
      } catch (err) {
        setErrorMessage("Failed to load profile. Please try again.");
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return (
    <Box sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Typography>Loading your profile...</Typography>
    </Box>
  );

// Add this function to the AccountPage component
const saveNotificationPreferences = async () => {
  try {
    setErrorMessage('');
    const token = localStorage.getItem('token');
    
    await axios.put(
      `${API_BASE_URL}/users/notification-preferences`, 
      {
        notifications: userData.notifications,
        emailUpdates: userData.emailUpdates,
        mealReminders: userData.mealReminders
      },
      { headers: { Authorization: `Bearer ${token}` }}
    );
    
    setSuccessMessage('Notification preferences updated successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  } catch (error) {
    setErrorMessage('Failed to update notification preferences. Please try again.');
    console.error("Update failed:", error);
  }
};



  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  // Handle toggle changes
  const handleToggleChange = (e) => {
    const { name, checked } = e.target;
    setUserData({
      ...userData,
      [name]: checked
    });
  };

  // Handle save profile
  const handleSaveProfile = async () => {
    try {
      setErrorMessage('');
      const token = localStorage.getItem('token');
      
      // Convert comma-separated strings to arrays
      const dataToSend = {
        ...userData,
        dietType: typeof userData.dietType === 'string' ? userData.dietType.split(',').map(item => item.trim()) : userData.dietType,
        allergies: typeof userData.allergies === 'string' ? userData.allergies.split(',').map(item => item.trim()) : userData.allergies,
        //  notification preferences
        notificationPreferences: {
        notifications: userData.notifications,
        emailUpdates: userData.emailUpdates,
        mealReminders: userData.mealReminders
      }
      
      };
      
      await axios.put(
        `${API_BASE_URL}/users/profile`, 
        dataToSend,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      setEditMode(false);
      setSuccessMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setErrorMessage('Failed to update profile. Please try again.');
      console.error("Update failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/users/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` }}
      );
    } catch (error) {
      console.error("Logout failed:", error);
    }
    
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    window.location.href = "/login"; // Redirect to login page
  };
  
  // Calculate membership duration
  const memberSince = () => {
    // This is placeholder logic - in a real app you would calculate this from user data
    const createdAt = userData.createdAt ? new Date(userData.createdAt) : new Date();
    const now = new Date();
    const diffInMonths = (now.getFullYear() - createdAt.getFullYear()) * 12 + (now.getMonth() - createdAt.getMonth());
    
    if (diffInMonths < 1) return "less than a month";
    if (diffInMonths === 1) return "1 month";
    if (diffInMonths < 12) return `${diffInMonths} months`;
    
    const years = Math.floor(diffInMonths / 12);
    if (years === 1) return "1 year";
    return `${years} years`;
  };

  return (
    <Box sx={{ py: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Page Header */}
        <Typography variant="h4" component="h1" fontWeight="700" sx={{ mb: 1 }}>
          Account Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Manage your account information and preferences
        </Typography>

        {/* Success message */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}
        
        {/* Error message */}
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        )}

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Left Column - Profile Summary */}
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 3,
                mb: 3,
                border: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              {/* Profile Photo */}
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Avatar 
                  src="" 
                  alt={userData.name}
                  sx={{ 
                    width: 120, 
                    height: 120,
                    bgcolor: theme.palette.primary.main,
                    fontSize: '3rem'
                  }}
                >
                  {userData.name ? userData.name.split(' ').map(n => n[0]).join('') : ''}
                </Avatar>
                <IconButton 
                  sx={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    right: 0,
                    bgcolor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    '&:hover': {
                      bgcolor: theme.palette.grey[100]
                    }
                  }}
                >
                  <CameraAltIcon fontSize="small" />
                </IconButton>
              </Box>

              <Typography variant="h6" fontWeight="600" sx={{ mb: 0.5 }}>
                {userData.name}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {userData.email}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Member since {memberSince()}
              </Typography>

              <Button 
                variant="outlined" 
                color="primary" 
                startIcon={<EditIcon />}
                onClick={() => setEditMode(true)}
                sx={{ borderRadius: '20px', mb: 2 }}
                fullWidth
              >
                Edit Profile
              </Button>
              
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{ borderRadius: '20px' }}
                fullWidth
              >
                Sign Out
              </Button>
            </Paper>

            {/* Subscription Info */}
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                Subscription
              </Typography>
              
              <Typography variant="body2" gutterBottom>
                You are currently on the <Box component="span" fontWeight="600">Free Plan</Box>
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Upgrade to Premium to unlock all features
              </Typography>
              
              <Button 
                variant="contained" 
                color="warning" 
                fullWidth
                sx={{ borderRadius: '20px' }}
              >
                Upgrade to Premium
              </Button>
            </Paper>
          </Grid>

          {/* Right Column - Tabs and Forms */}
          <Grid item xs={12} md={8}>
            <Paper 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                overflow: 'hidden'
              }}
            >
              {/* Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                  value={activeTab} 
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label="Personal Information" />
                  <Tab label="Dietary Preferences" />
                  <Tab label="Notifications" />
                  <Tab label="Security" />
                </Tabs>
              </Box>

              {/* Personal Information Tab */}
              {activeTab === 0 && (
                <Box sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight="600">
                      Personal Information
                    </Typography>
                    {!editMode && (
                      <Button 
                        startIcon={<EditIcon />}
                        onClick={() => setEditMode(true)}
                      >
                        Edit
                      </Button>
                    )}
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={userData.name || ''}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={userData.email || ''}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Age"
                        name="age"
                        type="number"
                        value={userData.age || ''}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Gender"
                        name="gender"
                        select
                        value={userData.gender || ''}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Height (cm)"
                        name="height"
                        type="number"
                        value={userData.height || ''}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Weight (kg)"
                        name="weight"
                        type="number"
                        value={userData.weight || ''}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Activity Level"
                        name="activityLevel"
                        select
                        value={userData.activityLevel || ''}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      >
                        <MenuItem value="Sedentary">Sedentary</MenuItem>
                        <MenuItem value="Lightly Active">Lightly Active</MenuItem>
                        <MenuItem value="Moderately Active">Moderately Active</MenuItem>
                        <MenuItem value="Very Active">Very Active</MenuItem>
                        <MenuItem value="Extra Active">Extra Active</MenuItem>
                      </TextField>
                    </Grid>
                    
                    {editMode && (
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                          <Button 
                            variant="outlined" 
                            onClick={() => setEditMode(false)}
                            sx={{ borderRadius: '20px' }}
                          >
                            Cancel
                          </Button>
                          <Button 
                            variant="contained" 
                            onClick={handleSaveProfile}
                            sx={{ borderRadius: '20px' }}
                          >
                            Save Changes
                          </Button>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}

              {/* Dietary Preferences Tab */}
              {activeTab === 1 && (
                <Box sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight="600">
                      Dietary Preferences
                    </Typography>
                    {!editMode && (
                      <Button 
                        startIcon={<EditIcon />}
                        onClick={() => setEditMode(true)}
                      >
                        Edit
                      </Button>
                    )}
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Dietary Preferences"
                        name="dietType"
                        value={userData.dietType || ''}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        placeholder="e.g., Vegetarian, Vegan, Keto, Paleo"
                        helperText="Enter dietary preferences separated by commas"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Allergies"
                        name="allergies"
                        value={userData.allergies || ''}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        placeholder="e.g., Nuts, Dairy, Gluten"
                        helperText="Enter allergies separated by commas"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Weight Goal"
                        name="goal"
                        select
                        value={userData.goal || ''}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      >
                        <MenuItem value="Lose weight">Lose Weight</MenuItem>
                        <MenuItem value="Maintain weight">Maintain Weight</MenuItem>
                        <MenuItem value="Gain weight">Gain Weight</MenuItem>
                      </TextField>
                    </Grid>
                    
                    {editMode && (
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                          <Button 
                            variant="outlined" 
                            onClick={() => setEditMode(false)}
                            sx={{ borderRadius: '20px' }}
                          >
                            Cancel
                          </Button>
                          <Button 
                            variant="contained" 
                            onClick={handleSaveProfile}
                            sx={{ borderRadius: '20px' }}
                          >
                            Save Changes
                          </Button>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}

              {/* Notifications Tab */}
              {activeTab === 2 && (
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                    Notification Settings
                  </Typography>

                  <Box sx={{ mb: 4 }}>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={userData.notifications || false}
                          onChange={handleToggleChange}
                          name="notifications"
                          color="primary"
                        />
                      }
                      label="Enable Notifications"
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                      Receive notifications for meal plans, reminders, and updates
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={userData.emailUpdates || false}
                          onChange={handleToggleChange}
                          name="emailUpdates"
                          color="primary"
                        />
                      }
                      label="Email Updates"
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                      Receive weekly meal plan summaries and nutrition insights
                    </Typography>
                  </Box>

                  <Box>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={userData.mealReminders || false}
                          onChange={handleToggleChange}
                          name="mealReminders"
                          color="primary"
                        />
                      }
                      label="Meal Reminders"
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                      Get daily reminders for your meal schedule
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                    <Button 
                      variant="contained" 
                      onClick={saveNotificationPreferences}
                      sx={{ borderRadius: '20px' }}
                    >
                      Save Preferences
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Security Tab */}
              {activeTab === 3 && (
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                    Security Settings
                  </Typography>

                  <Box sx={{ mb: 4, p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LockIcon color="action" sx={{ mr: 2 }} />
                      <Typography variant="subtitle1" fontWeight="600">
                        Password
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      It's a good practice to change your password regularly
                    </Typography>
                    <Button 
                      variant="outlined"
                      sx={{ borderRadius: '20px' }}
                    >
                      Change Password
                    </Button>
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AccountPage;