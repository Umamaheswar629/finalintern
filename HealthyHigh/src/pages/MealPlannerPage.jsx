// src/pages/MealPlannerPage.jsx
import { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button
} from '@mui/material';

const MealPlannerPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Set Preferences', 'Generate Plan', 'Review Plan'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
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
          Create Your Meal Plan
        </Typography>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        <Paper sx={{ p: 4 }}>
          {activeStep === steps.length ? (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom>
                Your meal plan is ready!
              </Typography>
              <Typography variant="body1" paragraph>
                You can view your plan below or save it for later.
              </Typography>
              <Button onClick={handleReset} variant="contained" color="primary">
                Create Another Plan
              </Button>
            </Box>
          ) : (
            <Box>
              {activeStep === 0 && (
                <Typography>This is where your preferences form would go.</Typography>
              )}
              {activeStep === 1 && (
                <Typography>This is where your plan generation would happen.</Typography>
              )}
              {activeStep === 2 && (
                <Typography>This is where your plan review would be shown.</Typography>
              )}
              
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 4 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button 
                  onClick={handleNext} 
                  variant="contained" 
                  color="primary"
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default MealPlannerPage;