// src/pages/SavedPlansPage.jsx
import { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const SavedPlansPage = () => {
  // Dummy saved plans data
  const [savedPlans, setSavedPlans] = useState([
    {
      id: 1,
      name: 'Summer Fitness Plan',
      createdAt: 'June 15, 2024',
      type: 'Weight Loss',
      mealCount: 5,
      calories: 1800
    },
    {
      id: 2,
      name: 'Muscle Building Plan',
      createdAt: 'February 10, 2024',
      type: 'Muscle Gain',
      mealCount: 6,
      calories: 2500
    },
    {
      id: 3,
      name: 'Vegetarian Week',
      createdAt: 'April 22, 2024',
      type: 'Maintenance',
      mealCount: 4,
      calories: 2000
    }
  ]);

  const handleDelete = (id) => {
    setSavedPlans(savedPlans.filter(plan => plan.id !== id));
  };

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ textAlign: 'center', fontWeight: 700, mb: 4 }}
        >
          Your Saved Meal Plans
        </Typography>

        {savedPlans.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              No Saved Plans Yet
            </Typography>
            <Typography variant="body1" paragraph>
              When you create and save meal plans, they will appear here.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              href="/meal-planner"
            >
              Create Your First Plan
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {savedPlans.map((plan) => (
              <Grid item xs={12} md={6} lg={4} key={plan.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {plan.name}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
                      <CalendarTodayIcon sx={{ fontSize: 18, mr: 1 }} />
                      <Typography variant="body2">
                        Created: {plan.createdAt}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ mb: 2 }}>
                      <Chip 
                        label={plan.type} 
                        color="primary" 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        <RestaurantIcon sx={{ fontSize: 18, mr: 0.5, verticalAlign: 'text-bottom' }} />
                        {plan.mealCount} meals per day
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {plan.calories} calories
                      </Typography>
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                      size="small" 
                      variant="outlined"
                      startIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button 
                      size="small" 
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(plan.id)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default SavedPlansPage;