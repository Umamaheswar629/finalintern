// src/components/home/Benefits.jsx
import { Box, Container, Grid, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import EcoIcon from '@mui/icons-material/Eco';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const benefitsData = [
  {
    icon: <FavoriteIcon color="primary" sx={{ fontSize: 40 }} />,
    title: 'Personalized Nutrition',
    description: 'Get meal plans tailored to your unique calorie needs and dietary preferences.'
  },
  {
    icon: <AccessTimeIcon color="primary" sx={{ fontSize: 40 }} />,
    title: 'Save Time',
    description: 'Stop wondering what to cook. We generate your weekly meal plan in seconds.'
  },
  {
    // icon: <EcoIcon color="primary" sx={{ fontSize: 40 }} />,
    title: 'Healthy Options',
    description: 'Access a database of nutritious recipes that support your health goals.'
  },
  {
    icon: <TrendingUpIcon color="primary" sx={{ fontSize: 40 }} />,
    title: 'Track Progress',
    description: 'Monitor your nutrition intake and make adjustments to reach your goals faster.'
  }
];

const Benefits = () => {
  return (
    <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" component="h2" gutterBottom>
            Why Choose MealPlan?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
            Our meal planning service helps you eat healthier, save time, and reach your fitness goals with personalized nutrition.
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {benefitsData.map((benefit, index) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={3} 
              key={index}
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Paper
                elevation={2}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  bgcolor: 'background.default',
                  borderRadius: 3,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  }
                }}
              >
                <Box sx={{ mb: 2 }}>{benefit.icon}</Box>
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  {benefit.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" align="center">
                  {benefit.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Benefits;