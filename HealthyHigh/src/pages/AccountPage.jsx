// src/pages/AccountPage.jsx
import { useState,useEffect } from 'react';
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
  Tabs
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

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);
      } catch (err) {
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

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
  const handleSaveProfile = () => {
    // Here you would typically save the data to your backend
    setEditMode(false);
    setSuccessMessage('Profile updated successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/users/logout`);
    } catch (error) {
      console.error("Logout failed:", error);
    }
    
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    window.location.href = "/login"; // Redirect to login page
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
                  {userData.name.split(' ').map(n => n[0]).join('')}
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
                @{userData.username}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Member since {userData.dateJoined}
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
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={userData.username}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={userData.phone}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
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
                        name="dietaryPreferences"
                        value={userData.dietType}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        placeholder="e.g., Vegetarian, Vegan, Keto, Paleo"
                        helperText="Enter any dietary preferences you follow"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Allergies"
                        name="allergies"
                        value={userData.allergies}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        placeholder="e.g., Nuts, Dairy, Gluten"
                        helperText="Enter any food allergies or intolerances"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Daily Calorie Goal"
                        name="calorieGoal"
                        type="number"
                        value={userData.calorieGoal}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        InputProps={{ endAdornment: 'kcal' }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Weight Goal"
                        name="weightGoal"
                        select
                        value={userData.weightGoal}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        SelectProps={{
                          native: true,
                        }}
                      >
                        <option value="Lose Weight">Lose Weight</option>
                        <option value="Maintain Weight">Maintain Weight</option>
                        <option value="Gain Weight">Gain Weight</option>
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
                          checked={userData.notifications}
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
                          checked={userData.emailUpdates}
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
                          checked={userData.mealReminders}
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
                      onClick={handleSaveProfile}
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
                      Last changed: 3 months ago
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