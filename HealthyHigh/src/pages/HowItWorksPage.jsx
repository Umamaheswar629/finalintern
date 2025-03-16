// src/pages/HowItWorksPage.jsx
import { 
    Box, 
    Container, 
    Typography, 
    Grid,
    Paper,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Divider,
    Button
  } from '@mui/material';
  import AccountCircleIcon from '@mui/icons-material/AccountCircle';
  import SettingsIcon from '@mui/icons-material/Settings';
  import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
  import CheckCircleIcon from '@mui/icons-material/CheckCircle';
  import { Link as RouterLink } from 'react-router-dom';
  
  const steps = [
    {
      label: 'Create Your Profile',
      description: 'Enter your details like age, weight, height, and activity level to calculate your caloric needs.',
      icon: <AccountCircleIcon fontSize="large" color="primary" />
    },
    {
      label: 'Set Your Preferences',
      description: 'Select your dietary preferences, food allergies, and cooking skill level to personalize your meal plan.',
      icon: <SettingsIcon fontSize="large" color="primary" />
    },
    {
      label: 'Generate Your Meal Plan',
      description: 'Our algorithm creates a customized meal plan with recipes that match your preferences and nutritional needs.',
      icon: <RestaurantMenuIcon fontSize="large" color="primary" />
    },
    {
      label: 'Enjoy and Track',
      description: 'Follow your plan, track your progress, and make adjustments as needed to reach your health goals.',
      icon: <CheckCircleIcon fontSize="large" color="primary" />
    }
  ];
  
  const HowItWorksPage = () => {
    return (
      <Box sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ textAlign: 'center', fontWeight: 700, mb: 2 }}
          >
            How MealPlan Works
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ textAlign: 'center', color: 'text.secondary', mb: 6, maxWidth: 800, mx: 'auto' }}
          >
            Creating a personalized meal plan that fits your lifestyle has never been easier.
            Follow these simple steps to get started.
          </Typography>
          
          {/* Steps Section */}
          <Box sx={{ maxWidth: 900, mx: 'auto', mb: 8 }}>
            <Stepper orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label} active={true}>
                  <StepLabel StepIconComponent={() => step.icon}>
                    <Typography variant="h5">{step.label}</Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body1" sx={{ py: 2 }}>
                      {step.description}
                    </Typography>
                    {index < steps.length - 1 && <Box sx={{ height: 20 }} />}
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Box>
          
          {/* FAQ Section */}
          <Box sx={{ mb: 8 }}>
            <Typography 
              variant="h4" 
              component="h2" 
              gutterBottom
              sx={{ textAlign: 'center', fontWeight: 600, mb: 4 }}
            >
              Frequently Asked Questions
            </Typography>
            
            <Grid container spacing={4}>
              {[
                {
                  question: "How are calorie needs calculated?", 
                  answer: "We use the Mifflin-St Jeor equation based on your age, weight, height, gender, and activity level to calculate your basal metabolic rate (BMR) and total daily energy expenditure (TDEE)."
                },
                {
                  question: "Can I customize my meal plan?", 
                  answer: "Yes! You can set dietary preferences (vegan, vegetarian, keto, etc.), exclude specific ingredients, and even set preferences for meal complexity and prep time."
                },
                {
                  question: "How many meals per day will my plan include?", 
                  answer: "You can choose between 3-6 meals per day, depending on your preferences and lifestyle needs."
                },
                {
                  question: "Can I swap meals I don't like?", 
                  answer: "Absolutely. If you don't like a suggested meal, you can easily swap it for another option that meets similar nutritional criteria."
                }
              ].map((faq, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {faq.question}
                    </Typography>
                    <Typography variant="body1">
                      {faq.answer}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
          
          {/* CTA Section */}
          <Paper 
            sx={{ 
              p: { xs: 4, md: 6 }, 
              textAlign: 'center',
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
              borderRadius: 4
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Ready to Start Your Health Journey?
            </Typography>
            <Typography variant="h6" paragraph sx={{ maxWidth: 800, mx: 'auto', mb: 4, opacity: 0.9 }}>
              Create your personalized meal plan in minutes and take the first step towards a healthier lifestyle.
            </Typography>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              component={RouterLink}
              to="/meal-planner"
              sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
            >
              Create Your Meal Plan
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  };
  
  export default HowItWorksPage;