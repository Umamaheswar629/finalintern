// src/components/meal-planner/MealForm.jsx
import { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography,
  Stepper,
  Step,
  StepLabel,
  Grid,
  TextField,
  MenuItem,
  Slider,
  InputAdornment,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  Alert
} from '@mui/material';
import CustomButton from '../common/CustomButton';

const steps = ['Personal Info', 'Dietary Preferences', 'Goals & Activity'];

const dietaryRestrictions = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
  'Low Carb',
  'Keto',
  'Paleo'
];

const MealForm = ({ onSubmit }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    gender: 'female',
    age: 30,
    weight: 70,
    height: 170,
    activityLevel: 'moderate',
    goal: 'maintain',
    mealsPerDay: 3,
    restrictions: [],
    allergies: '',
    calories: 2000
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFinish = () => {
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSliderChange = (name) => (e, newValue) => {
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleCheckboxChange = (restriction) => {
    const newRestrictions = [...formData.restrictions];
    if (newRestrictions.includes(restriction)) {
      // Remove it
      const index = newRestrictions.indexOf(restriction);
      newRestrictions.splice(index, 1);
    } else {
      // Add it
      newRestrictions.push(restriction);
    }
    
    setFormData({
      ...formData,
      restrictions: newRestrictions,
    });
  };

  // Render steps content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">years</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Weight"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Height"
                name="height"
                type="number"
                value={formData.height}
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                }}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Dietary Restrictions</FormLabel>
                <FormGroup sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                  {dietaryRestrictions.map((restriction) => (
                    <FormControlLabel
                      key={restriction}
                      control={
                        <Checkbox
                          checked={formData.restrictions.includes(restriction)}
                          onChange={() => handleCheckboxChange(restriction)}
                          name={restriction}
                        />
                      }
                      label={restriction}
                      sx={{ width: { xs: '100%', sm: '50%', md: '33%' } }}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Allergies or Ingredients to Avoid"
                name="allergies"
                multiline
                rows={2}
                value={formData.allergies}
                onChange={handleChange}
                placeholder="E.g., shellfish, peanuts, strawberries"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Meals Per Day"
                name="mealsPerDay"
                value={formData.mealsPerDay}
                onChange={handleChange}
              >
                <MenuItem value={2}>2 Meals</MenuItem>
                <MenuItem value={3}>3 Meals</MenuItem>
                <MenuItem value={4}>4 Meals</MenuItem>
                <MenuItem value={5}>5 Meals</MenuItem>
                <MenuItem value={6}>6 Meals</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Activity Level"
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
              >
                <MenuItem value="sedentary">Sedentary (little or no exercise)</MenuItem>
                <MenuItem value="light">Lightly active (light exercise 1-3 days/week)</MenuItem>
                <MenuItem value="moderate">Moderately active (moderate exercise 3-5 days/week)</MenuItem>
                <MenuItem value="active">Active (hard exercise 6-7 days/week)</MenuItem>
                <MenuItem value="very_active">Very active (very hard exercise & physical job)</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Goal"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
              >
                <MenuItem value="lose">Lose Weight</MenuItem>
                <MenuItem value="maintain">Maintain Weight</MenuItem>
                <MenuItem value="gain">Gain Weight</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <Typography id="calories-slider" gutterBottom>
                Daily Calorie Target: {formData.calories} kcal
              </Typography>
              <Slider
                value={formData.calories}
                onChange={handleSliderChange('calories')}
                aria-labelledby="calories-slider"
                valueLabelDisplay="auto"
                step={50}
                min={1000}
                max={4000}
                marks={[
                  { value: 1000, label: '1000' },
                  { value: 2000, label: '2000' },
                  { value: 3000, label: '3000' },
                  { value: 4000, label: '4000' },
                ]}
              />
              <Alert severity="info" sx={{ mt: 2 }}>
                Based on your information, we recommend approximately {formData.calories} calories per day.
                Adjust the slider if you'd like to customize your calorie target.
              </Alert>
            </Grid>
          </Grid>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Paper sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Create Your Personalized Meal Plan
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ py: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Box sx={{ mt: 4 }}>
        {getStepContent(activeStep)}
      </Box>
      
      <Divider sx={{ my: 4 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        <Box>
          {activeStep === steps.length - 1 ? (
            <CustomButton 
              onClick={handleFinish}
              size="large"
              color="primary"
            >
              Generate Meal Plan
            </CustomButton>
          ) : (
            <CustomButton 
              onClick={handleNext}
              size="large"
              color="primary"
            >
              Next
            </CustomButton>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default MealForm;