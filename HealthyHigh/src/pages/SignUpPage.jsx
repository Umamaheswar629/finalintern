import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Checkbox,
  InputAdornment,
  Avatar,
  Divider,
  Grid,
  IconButton,
  Card,
  CardContent,
  Stack,
  Chip,
  Select,
  MenuItem,
  Slider
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import NoMealsIcon from '@mui/icons-material/NoMeals';
import SettingsIcon from '@mui/icons-material/Settings';
import FlagIcon from '@mui/icons-material/Flag';

// Custom styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
  maxWidth: 800,
  margin: '0 auto',
}));

const DietCard = styled(Card)(({ theme, selected }) => ({
  borderRadius: theme.spacing(2),
  cursor: 'pointer',
  height: '100%',
  transition: 'all 0.2s ease-in-out',
  border: selected ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
  backgroundColor: selected ? theme.palette.primary.lighter : theme.palette.background.paper,
  '&:hover': {
    borderColor: theme.palette.primary.main,
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[2],
  },
}));

// Mock data
const dietOptions = [
  { id: 'balanced', name: 'Balanced', description: 'A balanced mix of all food groups' },
  { id: 'keto', name: 'Ketogenic', description: 'High-fat, low-carb diet' },
  { id: 'vegan', name: 'Vegan', description: 'No animal products' },
  { id: 'paleo', name: 'Paleo', description: 'Foods similar to what might have been eaten during the Paleolithic era' },
  { id: 'mediterranean', name: 'Mediterranean', description: 'Plant-based foods, healthy fats, and lean proteins' },
  { id: 'lowcarb', name: 'Low Carb', description: 'Reduced carbohydrate intake' },
];

const activityLevels = [
  { value: 'Sedentary', label: 'Sedentary', description: 'Little to no exercise' },
  { value: 'Lightly Active', label: 'Lightly Active', description: '1-3 days/week' },
  { value: 'Moderately Active', label: 'Moderately Active', description: '3-5 days/week' },
  { value: 'Very Active', label: 'Very Active', description: '6-7 days/week' },
  { value:  'Extra Active', label: 'Extra Active', description: 'Very physical job or twice-daily training' },
];

const SignUpPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstname: '',
    lastname: '',
    gender: '',
    age: '',
    height: '',
    weight: '',
    goalWeight: '',
    activityLevel:'',
    dietType: '',
    mealsPerDay: 3,
    includedBreakfast: true,
    includedLunch: true,
    includedDinner: true,
    includedSnacks: false,
    calorieGoal: '',
  });

  // Removed "Food Restrictions" from steps
  const steps = [
    'Create Account',
    'Physical Stats',
    'Diet Type',
    'Meal Preferences',
    'Goal Setting'
  ];

  const [errors, setErrors] = useState({});

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return "Email is required.";
  } else if (!emailRegex.test(email)) {
    return "Invalid email format.";
  }
  return "";
};



const validatePassword = (password) => {
  if (!password) {
    return "Password is required.";
  } else if (password.length < 8) {
    return "Password must be at least 8 characters.";
  } else if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  } else if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number.";
  } else if (!/[!@#$%^&*]/.test(password)) {
    return "Password must contain at least one special character (!@#$%^&*).";
  }
  return "";
};

const validateConfirmPassword = (confirmPassword) => {
  if (!confirmPassword) {
    return "Please confirm your password.";
  } else if (confirmPassword !== formData.password) {
    return "Passwords do not match.";
  }
  return "";
};

const validateName = (name) => {
  if (!name.trim()) {
    return "This field is required.";
  }
  return "";
};

const validateAge = (age) => {
  if (!age) return "Age is required.";
  if (age < 13 || age > 120) return "Age must be between 13 and 120.";
  return "";
};

const validateHeight = (height) => {
  if (!height) return "Height is required.";
  if (height < 100 || height > 250) return "Height must be between 100 cm and 250 cm.";
  return "";
};

const validateWeight = (weight) => {
  if (!weight) return "Weight is required.";
  if (weight < 30 || weight > 300) return "Weight must be between 30 kg and 300 kg.";
  return "";
};

const validateActivityLevel = (activityLevel) => {
  if (!activityLevel) return "Please select an activity level.";
  return "";
};

const validateDietType = (dietType) => {
  if (!dietType) return "Please select a diet type.";
  return "";
};

const validateGoalWeight = (goalWeight) => {
  if (!goalWeight || goalWeight <= 0) {
    return "Please enter a valid goal weight.";
  }
  return "";
};

const validateCalorieGoal = (calorieGoal) => {
  if (!calorieGoal || calorieGoal < 1000 || calorieGoal > 5000) {
    return "Please enter a realistic calorie goal (1000-5000 kcal).";
  }
  return "";
};


const validateMealSelection = (mealsPerDay, mealSelections) => {
  const selectedMeals = [
    mealSelections.includedBreakfast,
    mealSelections.includedLunch,
    mealSelections.includedDinner,
    mealSelections.includedSnacks,
  ].filter(Boolean).length;

  if (mealsPerDay > 0 && selectedMeals === 0) {
    return "You must select at least one meal type.";
  }

  if (mealsPerDay < selectedMeals) {
    return "Selected meals exceed the meals per day count.";
  }

  return "";
};


const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({ ...prev, [name]: value }));

  let error = "";

  switch (name) {
    case "email":
      error = validateEmail(value);
      break;
    case "password":
      error = validatePassword(value);
      break;
    case "confirmPassword":
      error = validateConfirmPassword(value);
      break;
    case "firstname":
    case "lastname":
      error = validateName(value);
      break;
    case "age":
      error = validateAge(value);
      break;
    case "height":
      error = validateHeight(value);
      break;
    case "weight":
      error = validateWeight(value);
      break;
    case "goalWeight":
      error = validateGoalWeight(value);
      break;
    case "calorieGoal":
      error = validateCalorieGoal(value);
      break;
    default:
      break;
  }

  setErrors((prev) => ({ ...prev, [name]: error }));
};



const handleCheckboxChange = (e) => {
  const { name, checked } = e.target;

  setFormData((prev) => {
    const updatedFormData = { ...prev, [name]: checked };

    // Validate meal selection when checkboxes change
    if (["includedBreakfast", "includedLunch", "includedDinner", "includedSnacks"].includes(name)) {
      const mealError = validateMealSelection(updatedFormData.mealsPerDay, updatedFormData);
      setErrors((prevErrors) => ({ ...prevErrors, meals: mealError }));
    }

    return updatedFormData;
  });
};

const handleDietSelect = (dietId) => {
  setFormData((prev) => ({ ...prev, dietType: dietId }));
  setErrors((prev) => ({ ...prev, dietType: validateDietType(dietId) }));
};


  const handleNext = () => {
    let stepErrors = {};
  
    if (activeStep === 0) {  
      // Step 1: Personal Information
      stepErrors = {
        firstname: validateName(formData.firstname),
        lastname: validateName(formData.lastname),
        email: validateEmail(formData.email),
        password: validatePassword(formData.password),
        confirmPassword: validateConfirmPassword(formData.confirmPassword),
      };
    } else if (activeStep === 1) {  
      // Step 2: Physical Stats
      stepErrors = {
        age: validateAge(formData.age),
        height: validateHeight(formData.height),
        weight: validateWeight(formData.weight),
        activityLevel: validateActivityLevel(formData.activityLevel),
      };
    } else if (activeStep === 2) {  
      // Step 3: Diet Selection
      stepErrors = {
        dietType: validateDietType(formData.dietType),
      };
    } else if (activeStep === 3) {  
      // Step 4: Meal Preferences (previously step 5)
      stepErrors = {
        meals: validateMealSelection(formData.mealsPerDay, formData),
      };
    }
  
    setErrors(stepErrors);
  
    // Prevent moving forward if any errors exist
    if (Object.values(stepErrors).some((error) => error !== "")) {
      console.log(`Step ${activeStep} has errors:`, stepErrors);
      return;
    }
  
    // Move to the next step if there are no errors
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const finalErrors = {
      goalWeight: validateGoalWeight(formData.goalWeight),
      calorieGoal: validateCalorieGoal(formData.calorieGoal),
    };
  
    setErrors(finalErrors);
  
    if (Object.values(finalErrors).some((error) => error !== "")) {
      console.log("Final step has errors:", finalErrors);
      return;
    }
  

    try {
      const response = await fetch("http://localhost:5000/api/users/register",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        alert("Signup successful!");
        navigate("/dashboard"); // Redirect after successful signup
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Signup failed. Please try again.");
    }
    
  };
  
  // Render different form steps
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h5" fontWeight="600" gutterBottom>
              Create your account
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Welcome to Meal Planner! Let's get started with your account setup.
            </Typography>
            
            <Box sx={{ mt: 4 }}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
                type="email"
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required
                type="password"
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                margin="normal"
                required
                type="password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  margin="normal"
                  required
                  error={!!errors.firstname}
                  helperText={errors.firstname}                
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  margin="normal"
                  required
                  error={!!errors.lastname}
                  helperText={errors.lastname}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>
          </Box>
        );
      
      case 1:
        return (
          <Box>
            <Typography variant="h5" fontWeight="600" gutterBottom>
              Your Physical Information
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We need some basic information to calculate your nutritional needs.
            </Typography>
            
            <Box sx={{ mt: 4 }}>
              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <FormLabel component="legend">Gender</FormLabel>
                <RadioGroup
                  row
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <FormControlLabel value="Male" control={<Radio />} label="Male" />
                  <FormControlLabel value="Female" control={<Radio />} label="Female" />
                  <FormControlLabel value="Other" control={<Radio />} label="Other" />
                </RadioGroup>
              </FormControl>
              
              <TextField
                fullWidth
                label="Age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                margin="normal"
                required
                type="number"
                error={!!errors.age}
                helperText={errors.age}
                InputProps={{
                  endAdornment: <InputAdornment position="end">years</InputAdornment>,
                }}
              />
              
              <TextField
                fullWidth
                label="Height"
                name="height"
                value={formData.height}
                onChange={handleChange}
                margin="normal"
                required
                type="number"
                error={!!errors.height}
                helperText={errors.height}
                InputProps={{
                  endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                }}
              />
              
              <TextField
                fullWidth
                label="Current Weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                margin="normal"
                required
                type="number"
                error={!!errors.weight}
                helperText={errors.weight}
                InputProps={{
                  endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                }}
              />
              
              <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                Activity Level
              </Typography>
              
              <Grid container spacing={2}>
                {activityLevels.map((level) => (
                  <Grid item xs={12} sm={6} key={level.value}>
                    <Card 
                      sx={{ 
                        borderRadius: 2, 
                        cursor: 'pointer',
                        border: formData.activityLevel === level.value 
                          ? `2px solid ${theme.palette.primary.main}` 
                          : `1px solid ${theme.palette.divider}`,
                        backgroundColor: formData.activityLevel === level.value 
                          ? theme.palette.primary.lighter 
                          : theme.palette.background.paper,
                      }}
                      onClick={() => {setFormData(prev => ({ ...prev, activityLevel: level.value }));
                      setErrors(prev => ({ ...prev, activityLevel: "" }));
                      }}
                      
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {level.label}
                          </Typography>
                          {formData.activityLevel === level.value && (
                            <CheckCircleIcon color="primary" />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {level.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              {errors.activityLevel && (
                <Typography variant="body2" color="error">
                  {errors.activityLevel}
                </Typography>
              )}
            </Box>
          </Box>
        );
      
      case 2:
        return (
          <Box>
            <Typography variant="h5" fontWeight="600" gutterBottom>
              Choose Your Diet Type
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Select a diet plan that aligns with your lifestyle and goals.
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {dietOptions.map((diet) => (
                <Grid item xs={12} sm={6} md={4} key={diet.id}>
                  <DietCard 
                    selected={formData.dietType === diet.id}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, dietType: diet.id }));
                      setErrors(prev => ({ ...prev, dietType: "" }));
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="h6" component="div" fontWeight={600}>
                          {diet.name}
                        </Typography>
                        {formData.dietType === diet.id && (
                          <CheckCircleIcon color="primary" />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {diet.description}
                      </Typography>
                    </CardContent>
                  </DietCard>
                </Grid>
              ))}
            </Grid>
            {errors.dietType && (
            <Typography variant="body2" color="error">
            {errors.dietType}
            </Typography>
            )}
          </Box>
        );
      
      case 3:
        return (
          <Box>
            <Typography variant="h5" fontWeight="600" gutterBottom>
              Meal Preferences
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Tell us how you'd like your meals structured throughout the day.
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                How many meals do you want per day?
              </Typography>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={formData.mealsPerDay}
                  onChange={(e, newValue) => setFormData(prev => ({ ...prev, mealsPerDay: newValue }))}
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={1}
                  max={6}
                  sx={{ mb: 4 }}
                />
              </Box>
              
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Which meals do you want included?
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.includedBreakfast}
                    onChange={handleCheckboxChange}
                    name="includedBreakfast"
                  />
                }
                label="Breakfast"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.includedLunch}
                    onChange={handleCheckboxChange}
                    name="includedLunch"
                  />
                }
                label="Lunch"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.includedDinner}
                    onChange={handleCheckboxChange}
                    name="includedDinner"
                  />
                }
                label="Dinner"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.includedSnacks}
                    onChange={handleCheckboxChange}
                    name="includedSnacks"
                  />
                }
                label="Snacks"
              />
            {errors.meals && (
            <Typography variant="body2" color="error">
            {errors.meals}
            </Typography>
            )}
              
              <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 3, mb: 1 }}>
                Any other meal requirements?
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="E.g., 'I prefer larger lunches and smaller dinners', 'I intermittent fast until noon'"
                name="mealNotes"
                value={formData.mealNotes || ''}
                onChange={handleChange}
              />
            </Box>
          </Box>
        );
      
      case 4:
        return (
          <Box>
            <Typography variant="h5" fontWeight="600" gutterBottom>
              Set Your Goals
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Let's define what you want to achieve with your meal plan.
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <FormLabel component="legend">Your main goal</FormLabel>
                <RadioGroup
                  name="goal"
                  value={formData.goal || 'maintain'}
                  onChange={handleChange}
                >
                  <FormControlLabel 
                    value="Lose weight" 
                    control={<Radio />} 
                    label="Lose weight" 
                  />
                  <FormControlLabel 
                    value="Maintain weight" 
                    control={<Radio />} 
                    label="Maintain weight" 
                  />
                  <FormControlLabel 
                    value="Gain weight" 
                    control={<Radio />} 
                    label="Gain weight" 
                  />
                </RadioGroup>
              </FormControl>
              
              <TextField
                fullWidth
                label="Goal Weight"
                name="goalWeight"
                value={formData.goalWeight}
                onChange={handleChange}
                margin="normal"
                type="number"
                required
                error={!!errors.goalWeight}
                helperText={errors.goalWeight}
                InputProps={{
                  endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                  startAdornment: (
                    <InputAdornment position="start">
                      <FlagIcon />
                    </InputAdornment>
                  ),
                }}
              />
              
              <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 3, mb: 1 }}>
                Daily Calorie Goal
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Based on your information, we recommend {Math.round(formData.weight * 22 * formData.activityLevel)} calories per day
              </Typography>
              
              <TextField
                fullWidth
                label="Daily Calorie Target"
                name="calorieGoal"
                value={formData.calorieGoal}
                onChange={handleChange}
                margin="normal"
                type="number"
                required 
                error={!!errors.calorieGoal} 
                helperText={errors.calorieGoal} 
                InputProps={{
                  endAdornment: <InputAdornment position="end">kcal</InputAdornment>,
                }}
              />
              
              <Typography variant="subtitle1" sx={{ mt: 4, mb: 2, textAlign: 'center' }}>
                Ready to start your personalized meal planning journey?
              </Typography>
            </Box>
          </Box>
        );
        
      default:
        return 'Unknown step';
    }
  };

  return(
    <Box sx={{ py: 4, minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="md">
        {/* Logo and header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="700" color="primary">
            Meal Planner
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Personalized meal planning made simple
          </Typography>
        </Box>
        
        <StyledPaper>
          {/* Progress stepper */}
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {/* Form content */}
          <Box sx={{ p: { xs: 1, sm: 2 } }}>
            {getStepContent(activeStep)}
          </Box>
          
          {/* Navigation buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<ArrowBackIcon />}
              sx={{ borderRadius: '20px' }}
            >
              Back
            </Button>
            
            {activeStep === steps.length - 1 ? (
              
              <Button
                variant="contained"
                onClick={handleSubmit}
                endIcon={<CheckCircleIcon />}
                sx={{ borderRadius: '20px' }}
              >
                Finish & Start Planning
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForwardIcon />}
                sx={{ borderRadius: '20px' }}
              >
                Next
              </Button>
            )}
          </Box>
        </StyledPaper>
        
        {/* Sign in link for existing users */}
        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          Already have an account? <Box component="span" sx={{ color: 'primary.main', fontWeight: 600, cursor: 'pointer' }}>Sign in</Box>
        </Typography>
      </Container>
    </Box>
  );
};

export default SignUpPage;