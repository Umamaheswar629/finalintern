// src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import axios from 'axios';

const DashboardPage = () => {
  const theme = useTheme();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
  
  // Load meals when component mounts
  useEffect(() => {
    fetchMeals();
  }, []);

  // Fetch meals from API
  const fetchMeals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_BASE_URL}/user/meals/today`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // If we got a successful response, set the meals
      // Make sure we're setting an array of meals
      if (response.data && response.data.meals && Array.isArray(response.data.meals)) {
        setMeals(response.data.meals);
      } else if (response.data && Array.isArray(response.data)) {
        setMeals(response.data);
      } else {
        console.warn('Unexpected meals data format:', response.data);
        setMeals([]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch meals:", err);
      
      // Check if it's a 404 (no meals found) - this is expected when no meals exist yet
      if (err.response && err.response.status === 404) {
        setMeals([]);
        
        // Check if we need to automatically generate meals
        if (err.response.data && err.response.data.needsGeneration) {
          // Show a notification that we're generating meals
          setNotification({
            open: true,
            message: 'Generating your meal plan for today...',
            severity: 'info'
          });
          
          // Automatically generate meals if none exist
          handleGenerateMealPlan();
        }
      } else {
        setError("Failed to load meals. Please try again.");
        setLoading(false);
      }
    }
  };

  // Generate meal plan function
  const handleGenerateMealPlan = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(
        `${API_BASE_URL}/user/meals/generate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // Ensure we're getting an array from the response
      if (response.data && response.data.meals && Array.isArray(response.data.meals)) {
        setMeals(response.data.meals);
      } else if (response.data && Array.isArray(response.data)) {
        setMeals(response.data);
      } else {
        console.warn('Unexpected meals data format:', response.data);
        setMeals([]);
      }
      
      setNotification({
        open: true,
        message: 'Meal plan generated successfully!',
        severity: 'success'
      });
      
      setLoading(false);
    } catch (err) {
      console.error("Failed to generate meal plan:", err);
      setError(err.response?.data?.message || "Failed to generate meal plan. Please try again.");
      
      setNotification({
        open: true,
        message: err.response?.data?.message || "Failed to generate meal plan",
        severity: 'error'
      });
      
      setLoading(false);
    }
  };

  // Navigate to recipe details
  const goToRecipeDetails = (recipeId) => {
    if (recipeId) {
      window.location.href = `/recipes/${recipeId}`;
    }
  };

  // Handle notification close
  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification(prev => ({ ...prev, open: false }));
  };

  // Welcome message for first-time users
  const renderWelcomeMessage = () => (
    <Box sx={{ textAlign: 'center', mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to Your Meal Planner
      </Typography>
      <Typography variant="body1" paragraph>
        Generate personalized meals based on your dietary preferences and goals.
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<AutorenewIcon />}
          onClick={handleGenerateMealPlan}
          disabled={loading}
          sx={{ borderRadius: '20px', px: 4 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Meals'}
        </Button>
      </Box>
    </Box>
  );

  // Render meal cards
  const renderMealCards = () => {
    // Safety check to ensure meals is an array before mapping
    if (!Array.isArray(meals)) {
      console.error('meals is not an array:', meals);
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="error">
            Error: Unable to display meals. Please try regenerating your meal plan.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateMealPlan}
            sx={{ mt: 2 }}
          >
            Regenerate Meals
          </Button>
        </Box>
      );
    }
    
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="600">
            Today's Meal Plan
          </Typography>
          <Button
            startIcon={<AutorenewIcon />}
            variant="contained"
            color="primary"
            onClick={handleGenerateMealPlan}
            disabled={loading}
            sx={{ borderRadius: '20px' }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Regenerate'}
          </Button>
        </Box>
        
        <Grid container spacing={3}>
          {meals.map((meal, index) => (
            <Grid item xs={12} md={4} key={meal.recipeId || `${meal.type}-${index}`}>
              <Card 
                sx={{ 
                  height: '100%', 
                  borderRadius: 2,
                  cursor: meal.recipeId ? 'pointer' : 'default',
                  transition: 'transform 0.2s',
                  '&:hover': meal.recipeId ? { 
                    transform: 'scale(1.02)',
                    boxShadow: 3
                  } : {}
                }}
                onClick={() => meal.recipeId && goToRecipeDetails(meal.recipeId)}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={meal.image || '/images/default-meal.jpg'}
                  alt={meal.title}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {meal.type}
                  </Typography>
                  <Typography variant="h6" component="div" gutterBottom>
                    {meal.title}
                  </Typography>
                  {meal.calories > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      {meal.calories} calories
                    </Typography>
                  )}
                  {meal.recipeId && (
                    <Typography 
                      variant="body2" 
                      color="primary" 
                      sx={{ mt: 1, fontWeight: 'medium' }}
                    >
                      Click to view recipe details
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  return (
    <Box sx={{ py: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Notification Snackbar */}
        <Snackbar 
          open={notification.open} 
          autoHideDuration={6000} 
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
            {notification.message}
          </Alert>
        </Snackbar>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Main Content */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          {loading && meals.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
              <CircularProgress />
            </Box>
          ) : meals.length === 0 ? (
            renderWelcomeMessage()
          ) : (
            renderMealCards()
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default DashboardPage;