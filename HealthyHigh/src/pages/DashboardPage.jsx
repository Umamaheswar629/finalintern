// src/pages/DashboardPage.jsx
import { useState } from 'react';
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
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CustomButton from '../components/common/CustomButton';

// Mock data for today's meals
const todaysMeals = [
  {
    id: 1,
    type: 'Breakfast',
    title: 'Greek Yogurt with Berries',
    calories: 320,
    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 2,
    type: 'Lunch',
    title: 'Grilled Chicken Salad',
    calories: 450,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 3,
    type: 'Dinner',
    title: 'Salmon with Roasted Vegetables',
    calories: 520,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 4,
    type: 'Snack',
    title: 'Apple with Almond Butter',
    calories: 210,
    image: 'https://images.unsplash.com/photo-1570275239925-4af0aa8fde49?q=80&w=500&auto=format&fit=crop'
  }
];

// Nutrition summary data
const nutritionSummary = {
  calories: {
    consumed: 1500,
    goal: 2000
  },
  protein: {
    consumed: 85,
    goal: 120,
    unit: 'g'
  },
  carbs: {
    consumed: 175,
    goal: 250,
    unit: 'g'
  },
  fat: {
    consumed: 45,
    goal: 65,
    unit: 'g'
  }
};

const DashboardPage = () => {
  const theme = useTheme();
  const [date, setDate] = useState(new Date());
  
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
            >
              Edit Plan
            </Button>
          </Grid>
        </Grid>

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
                    src="https://via.placeholder.com/200x200?text=Food+Illustration" 
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
                  >
                    Generate
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="primary"
                    startIcon={<ContentCopyIcon />}
                    sx={{ borderRadius: '20px' }}
                  >
                    Copy Previous
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="primary"
                    sx={{ borderRadius: '20px' }}
                  >
                    Plan Manually
                  </Button>
                </Stack>
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Today's Meals */}
              <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                Today's Meals
              </Typography>
              <Grid container spacing={3}>
                {todaysMeals.map((meal) => (
                  <Grid item xs={12} sm={6} key={meal.id}>
                    <Card sx={{ display: 'flex', height: '100%', borderRadius: 2 }}>
                      <CardMedia
                        component="img"
                        sx={{ width: 120 }}
                        image={meal.image}
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
                          <IconButton aria-label="more options" size="small">
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
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
                If you have any feedback or suggestions, <Box component="span" sx={{ color: 'primary.main' }}>please send us an email!</Box>
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
              >
                View Full Nutrition
              </Button>
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
                <ListItem button sx={{ borderRadius: 2, mb: 1 }}>
                  <ListItemText 
                    primary="View saved meal plans" 
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>
                <ListItem button sx={{ borderRadius: 2, mb: 1 }}>
                  <ListItemText 
                    primary="Update dietary preferences" 
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>
                <ListItem button sx={{ borderRadius: 2, mb: 1 }}>
                  <ListItemText 
                    primary="Track water intake" 
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>
                <ListItem button sx={{ borderRadius: 2, mb: 1 }}>
                  <ListItemText 
                    primary="Log exercise activity" 
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>
                <ListItem button sx={{ borderRadius: 2 }}>
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