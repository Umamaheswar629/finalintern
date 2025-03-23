// src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Button, 
  IconButton,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Avatar,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DateRangeIcon from '@mui/icons-material/DateRange';
import axios from 'axios'; // Add axios for API calls

// API service for meals
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// API services
const fetchMeals = async (date) => {
  try {
    const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    const response = await axios.get(`${API_BASE_URL}/meals?date=${formattedDate}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchNutritionSummary = async (date) => {
  try {
    const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    const response = await axios.get(`${API_BASE_URL}/nutrition/summary?date=${formattedDate}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const generateMealPlan = async (date) => {
  try {
    const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    const response = await axios.post(`${API_BASE_URL}/meals/generate`, 
      { date: formattedDate },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const copyPreviousMealPlan = async (date) => {
  try {
    const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    const response = await axios.post(`${API_BASE_URL}/meals/copy-previous`, 
      { date: formattedDate },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const DashboardPage = () => {
  const theme = useTheme();
  const [date, setDate] = useState(new Date());
  const [meals, setMeals] = useState([]);
  const [nutritionSummary, setNutritionSummary] = useState(null);
  const [loading, setLoading] = useState({
    meals: true,
    nutrition: true,
    action: false
  });
  const [error, setError] = useState({
    meals: null,
    nutrition: null,
    action: null
  });
  
  // Format date as string
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  // Calculate nutrition percentages
  const calculatePercentage = (consumed, goal) => {
    return Math.min(Math.round((consumed / goal) * 100), 100);
  };

  // Load data when component mounts or date changes
  useEffect(() => {
    const loadData = async () => {
      setLoading(prev => ({ ...prev, meals: true, nutrition: true }));
      setError(prev => ({ ...prev, meals: null, nutrition: null }));
      
      try {
        const mealsData = await fetchMeals(date);
        setMeals(mealsData);
        setLoading(prev => ({ ...prev, meals: false }));
      } catch (err) {
        console.error("Failed to fetch meals:", err);
        setError(prev => ({ ...prev, meals: "Failed to load meals. Please try again." }));
        setLoading(prev => ({ ...prev, meals: false }));
      }
      
      try {
        const nutritionData = await fetchNutritionSummary(date);
        setNutritionSummary(nutritionData);
        setLoading(prev => ({ ...prev, nutrition: false }));
      } catch (err) {
        console.error("Failed to fetch nutrition summary:", err);
        setError(prev => ({ ...prev, nutrition: "Failed to load nutrition data. Please try again." }));
        setLoading(prev => ({ ...prev, nutrition: false }));
      }
    };
    
    loadData();
  }, [date]);

  // Handle date change
  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  // Handle edit plan
  const handleEditPlan = () => {
    // Navigate to edit page or open modal
    window.location.href = `/meal-plan/edit?date=${date.toISOString().split('T')[0]}`;
  };

  // Handle generate meal plan
  const handleGenerateMealPlan = async () => {
    setLoading(prev => ({ ...prev, action: true }));
    setError(prev => ({ ...prev, action: null }));
    
    try {
      const generatedMeals = await generateMealPlan(date);
      setMeals(generatedMeals);
      setLoading(prev => ({ ...prev, action: false }));
    } catch (err) {
      console.error("Failed to generate meal plan:", err);
      setError(prev => ({ ...prev, action: "Failed to generate meal plan. Please try again." }));
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  // Handle copy previous meal plan
  const handleCopyPreviousMealPlan = async () => {
    setLoading(prev => ({ ...prev, action: true }));
    setError(prev => ({ ...prev, action: null }));
    
    try {
      const copiedMeals = await copyPreviousMealPlan(date);
      setMeals(copiedMeals);
      setLoading(prev => ({ ...prev, action: false }));
    } catch (err) {
      console.error("Failed to copy previous meal plan:", err);
      setError(prev => ({ ...prev, action: "Failed to copy previous meal plan. Please try again." }));
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  // Handle plan manually
  const handlePlanManually = () => {
    // Navigate to manual planning page
    window.location.href = `/meal-plan/manual?date=${date.toISOString().split('T')[0]}`;
  };

  return (
    <Box sx={{ py: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Page Header */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Grid item xs>
            <Typography variant="h4" component="h1" fontWeight="700">
              Today's Meal Plan
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <DateRangeIcon color="action" fontSize="small" />
              <Typography variant="body1" color="text.secondary">
                {formattedDate}
              </Typography>
            </Stack>
          </Grid>
          <Grid item>
            <Button 
              startIcon={<EditIcon />}
              variant="outlined" 
              sx={{ borderRadius: '20px' }}
              onClick={handleEditPlan}
            >
              Edit Plan
            </Button>
          </Grid>
        </Grid>

        {/* Error Alert */}
        {(error.meals || error.nutrition || error.action) && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error.meals || error.nutrition || error.action}
          </Alert>
        )}

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Meal Plan Section - Left Side */}
          <Grid item xs={12} md={8}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 3,
                mb: 4,
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              {/* What are we eating today? */}
              {meals.length === 0 && !loading.meals && !error.meals ? (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    mb: 4
                  }}
                >
                  <Box sx={{ maxWidth: '200px', mb: 2 }}>
                    <img 
                      src="/images/food-illustration.png" 
                      alt="Food illustration" 
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </Box>
                  <Typography variant="h5" fontWeight="600" gutterBottom>
                    What are we eating today?
                  </Typography>
                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      startIcon={<AutorenewIcon />}
                      sx={{ borderRadius: '20px' }}
                      onClick={handleGenerateMealPlan}
                      disabled={loading.action}
                    >
                      {loading.action ? <CircularProgress size={24} /> : 'Generate'}
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      startIcon={<ContentCopyIcon />}
                      sx={{ borderRadius: '20px' }}
                      onClick={handleCopyPreviousMealPlan}
                      disabled={loading.action}
                    >
                      Copy Previous
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      sx={{ borderRadius: '20px' }}
                      onClick={handlePlanManually}
                      disabled={loading.action}
                    >
                      Plan Manually
                    </Button>
                  </Stack>
                </Box>
              ) : null}

              {loading.meals && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                </Box>
              )}

              {meals.length > 0 && !loading.meals && (
                <>
                  <Divider sx={{ my: 4 }} />

                  {/* Today's Meals */}
                  <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                    Today's Meals
                  </Typography>
                  <Grid container spacing={3}>
                    {meals.map((meal) => (
                      <Grid item xs={12} sm={6} key={meal.id}>
                        <Card sx={{ display: 'flex', height: '100%', borderRadius: 2 }}>
                          <CardMedia
                            component="img"
                            sx={{ width: 120 }}
                            image={meal.image || '/images/default-meal.jpg'}
                            alt={meal.title}
                          />
                          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                            <CardContent sx={{ flex: '1 0 auto', p: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                {meal.type}
                              </Typography>
                              <Typography component="div" variant="subtitle1" fontWeight="600">
                                {meal.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {meal.calories} calories
                              </Typography>
                            </CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', p: 1 }}>
                              <IconButton 
                                aria-label="more options" 
                                size="small"
                                onClick={() => window.location.href = `/meals/${meal.id}`}
                              >
                                <MoreVertIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
            </Paper>

            {/* Feedback Section */}
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Have feedback on the new interface?
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                If you have any feedback or suggestions, <Box component="span" sx={{ color: 'primary.main', cursor: 'pointer' }} onClick={() => window.location.href = 'mailto:feedback@example.com'}>please send us an email!</Box>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Every bit of feedback helps :) The old version of the website is still available for now, but will be phasing it out soon once we're confident the new version is working well.
              </Typography>
            </Paper>
          </Grid>

          {/* Nutrition and Stats Section - Right Side */}
          <Grid item xs={12} md={4}>
            {/* Nutrition Summary */}
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 3,
                mb: 4,
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                Nutrition Summary
              </Typography>

              {loading.nutrition && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                </Box>
              )}

              {nutritionSummary && !loading.nutrition && (
                <>
                  {/* Calories */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Calories</Typography>
                      <Typography variant="body2" fontWeight="600">
                        {nutritionSummary.calories.consumed} / {nutritionSummary.calories.goal} kcal
                      </Typography>
                    </Box>
                    <Box sx={{ width: '100%', bgcolor: 'grey.100', borderRadius: 5, height: 10 }}>
                      <Box 
                        sx={{ 
                          width: `${calculatePercentage(nutritionSummary.calories.consumed, nutritionSummary.calories.goal)}%`, 
                          bgcolor: 'primary.main', 
                          height: 10,
                          borderRadius: 5
                        }} 
                      />
                    </Box>
                  </Box>

                  {/* Protein */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Protein</Typography>
                      <Typography variant="body2" fontWeight="600">
                        {nutritionSummary.protein.consumed} / {nutritionSummary.protein.goal} {nutritionSummary.protein.unit}
                      </Typography>
                    </Box>
                    <Box sx={{ width: '100%', bgcolor: 'grey.100', borderRadius: 5, height: 10 }}>
                      <Box 
                        sx={{ 
                          width: `${calculatePercentage(nutritionSummary.protein.consumed, nutritionSummary.protein.goal)}%`, 
                          bgcolor: 'secondary.main', 
                          height: 10,
                          borderRadius: 5
                        }} 
                      />
                    </Box>
                  </Box>

                  {/* Carbs */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Carbs</Typography>
                      <Typography variant="body2" fontWeight="600">
                        {nutritionSummary.carbs.consumed} / {nutritionSummary.carbs.goal} {nutritionSummary.carbs.unit}
                      </Typography>
                    </Box>
                    <Box sx={{ width: '100%', bgcolor: 'grey.100', borderRadius: 5, height: 10 }}>
                      <Box 
                        sx={{ 
                          width: `${calculatePercentage(nutritionSummary.carbs.consumed, nutritionSummary.carbs.goal)}%`, 
                          bgcolor: '#FF9800', 
                          height: 10,
                          borderRadius: 5
                        }} 
                      />
                    </Box>
                  </Box>

                  {/* Fat */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Fat</Typography>
                      <Typography variant="body2" fontWeight="600">
                        {nutritionSummary.fat.consumed} / {nutritionSummary.fat.goal} {nutritionSummary.fat.unit}
                      </Typography>
                    </Box>
                    <Box sx={{ width: '100%', bgcolor: 'grey.100', borderRadius: 5, height: 10 }}>
                      <Box 
                        sx={{ 
                          width: `${calculatePercentage(nutritionSummary.fat.consumed, nutritionSummary.fat.goal)}%`, 
                          bgcolor: '#F06292', 
                          height: 10,
                          borderRadius: 5
                        }} 
                      />
                    </Box>
                  </Box>

                  <Button 
                    variant="outlined" 
                    color="primary" 
                    fullWidth 
                    sx={{ mt: 2, borderRadius: '20px' }}
                    onClick={() => window.location.href = '/nutrition'}
                  >
                    View Full Nutrition
                  </Button>
                </>
              )}
            </Paper>

            {/* Quick Links */}
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                Quick Actions
              </Typography>
              <List dense sx={{ p: 0 }}>
                <ListItem 
                  button 
                  sx={{ borderRadius: 2, mb: 1 }}
                  onClick={() => window.location.href = '/meal-plans'}
                >
                  <ListItemText 
                    primary="View saved meal plans" 
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>
                <ListItem 
                  button 
                  sx={{ borderRadius: 2, mb: 1 }}
                  onClick={() => window.location.href = '/preferences'}
                >
                  <ListItemText 
                    primary="Update dietary preferences" 
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>
                <ListItem 
                  button 
                  sx={{ borderRadius: 2, mb: 1 }}
                  onClick={() => window.location.href = '/water-tracker'}
                >
                  <ListItemText 
                    primary="Track water intake" 
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>
                <ListItem 
                  button 
                  sx={{ borderRadius: 2, mb: 1 }}
                  onClick={() => window.location.href = '/exercise'}
                >
                  <ListItemText 
                    primary="Log exercise activity" 
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>
                <ListItem 
                  button 
                  sx={{ borderRadius: 2 }}
                  onClick={() => window.location.href = '/goals'}
                >
                  <ListItemText 
                    primary="Update nutrition goals" 
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default DashboardPage;