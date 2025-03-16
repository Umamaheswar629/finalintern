// src/components/home/Hero.jsx
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Container, Grid, Button } from '@mui/material';
import { motion } from 'framer-motion';
import CustomButton from '../common/CustomButton';

const Hero = () => {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        backgroundImage: 'linear-gradient(to bottom right, rgba(79, 70, 229, 0.1), rgba(16, 185, 129, 0.1))',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid 
            item 
            xs={12} 
            md={6} 
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{ textAlign: { xs: 'center', md: 'left' } }}
          >
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              Meal Planning Made <Box component="span" sx={{ color: 'primary.main' }}>Simple</Box>
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              paragraph
              sx={{ mb: 4 }}
            >
              Generate personalized meal plans based on your calorie needs, dietary preferences, and fitness goals.
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                justifyContent: { xs: 'center', md: 'flex-start' }
              }}
            >
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                component={RouterLink}
                to="/meal-planner"
                sx={{ px: 4, py: 1.5 }}
              >
                Create Your Meal Plan
              </Button>
              <Button 
                variant="outlined" 
                color="primary" 
                size="large"
                component={RouterLink}
                to="/how-it-works"
                sx={{ px: 4, py: 1.5 }}
              >
                Learn How It Works
              </Button>
            </Box>
          </Grid>
          
          <Grid 
            item 
            xs={12} 
            md={6}
            component={motion.div}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Box 
              component="img"
              src="https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              alt="Healthy meal preparation"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 4,
                boxShadow: 8,
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;