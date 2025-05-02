import { Box, Container, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Hero from '../components/home/Hero';
import Benefits from '../components/home/Benefits';
import Testimonials from '../components/home/Testimonials';

const HomePage = () => {
  return (
    <Box>
      <Hero />
      <Benefits />
      <Testimonials />
      
      {/* Call to Action Section */}
      <Box sx={{ 
        py: 8, 
        bgcolor: 'primary.main',
        color: 'primary.contrastText'
      }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Ready to Start Your Health Journey?
          </Typography>
          <Typography 
            variant="h6" 
            paragraph
            sx={{ 
              maxWidth: '800px', 
              mx: 'auto',
              mb: 4,
              opacity: 0.9
            }}
          >
            Create your personalized meal plan today and take the first step towards a healthier lifestyle.
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            component={RouterLink}
            to="/meal-plans"
            sx={{ 
              px: 4, 
              py: 1.5,
              fontSize: '1.1rem'
            }}
          >
            Create Your Meal Plan
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;