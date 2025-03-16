// src/components/common/Footer.jsx
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  IconButton, 
  Divider, 
  Avatar
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'text.primary', color: 'background.paper', pt: 8, pb: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>MP</Avatar>
              <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                MealPlan
              </Typography>
            </Box>
            <Typography variant="body2" color="background.paper" sx={{ mb: 2, opacity: 0.7 }}>
              Personalized meal plans to help you reach your health and fitness goals.
            </Typography>
            <Box>
              <IconButton color="inherit" aria-label="Facebook" component="a" href="#">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter" component="a" href="#">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram" component="a" href="#">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="GitHub" component="a" href="#">
                <GitHubIcon />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4} md={2}>
            <Typography variant="h6" gutterBottom component="div">
              Quick Links
            </Typography>
            <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
              {['Home', 'Meal Planner', 'Saved Plans', 'How It Works'].map((item, index) => (
                <Box component="li" key={index} sx={{ mb: 1 }}>
                  <Link 
                    component={RouterLink} 
                    to={index === 0 ? '/' : `/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    color="inherit"
                    sx={{ opacity: 0.7, '&:hover': { opacity: 1 }, textDecoration: 'none' }}
                  >
                    {item}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4} md={3}>
            <Typography variant="h6" gutterBottom component="div">
              Resources
            </Typography>
            <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
              {['Nutrition Blog', 'Recipe Database', 'Fitness Tips', 'Calorie Calculator'].map((item, index) => (
                <Box component="li" key={index} sx={{ mb: 1 }}>
                  <Link 
                    component="a" 
                    href="#"
                    color="inherit"
                    sx={{ opacity: 0.7, '&:hover': { opacity: 1 }, textDecoration: 'none' }}
                  >
                    {item}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4} md={3}>
            <Typography variant="h6" gutterBottom component="div">
              Contact
            </Typography>
            <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
              <Box component="li" sx={{ mb: 1, opacity: 0.7 }}>Email: support@mealplan.com</Box>
              <Box component="li" sx={{ mb: 1, opacity: 0.7 }}>Phone: (123) 456-7890</Box>
              <Box component="li" sx={{ mb: 1, opacity: 0.7 }}>Address: 123 Nutrition St, Healthy City</Box>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4, bgcolor: 'background.paper', opacity: 0.2 }} />
        
        <Typography variant="body2" align="center" sx={{ opacity: 0.7 }}>
          © {new Date().getFullYear()} MealPlan. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;