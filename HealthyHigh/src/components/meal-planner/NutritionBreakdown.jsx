// src/components/meal-planner/NutritionBreakdown.jsx
import { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Tabs, 
  Tab,
  Divider,
  LinearProgress
} from '@mui/material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import GrainIcon from '@mui/icons-material/Grain';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

// Create Nutrition Progress component
const NutritionProgress = ({ label, value, maxValue, color, icon }) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Box sx={{ mr: 1 }}>
          {icon}
        </Box>
        <Typography variant="body2" sx={{ flexGrow: 1 }}>
          {label}
        </Typography>
        <Typography variant="body2" fontWeight="medium">
          {value}g / {maxValue}g
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={percentage} 
        color={color} 
        sx={{ height: 8, borderRadius: 2 }}
      />
    </Box>
  );
};

const NutritionBreakdown = ({ mealPlan }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Calculate total nutrition for the day
  const dailyTotals = {
    calories: 2150,
    protein: 120,
    carbs: 220,
    fat: 70,
    fiber: 25
  };

  // Calculate daily goals (example values)
  const dailyGoals = {
    calories: 2200,
    protein: 150,
    carbs: 250,
    fat: 75,
    fiber: 30
  };

  // Calculate meal distribution (for the pie chart)
  const mealDistribution = [
    { name: 'Breakfast', value: 550 },
    { name: 'Lunch', value: 750 },
    { name: 'Dinner', value: 650 },
    { name: 'Snacks', value: 200 }
  ];

  // Calculate macronutrient distribution as percentages
  const proteinPercentage = Math.round((dailyTotals.protein * 4 / dailyTotals.calories) * 100);
  const carbsPercentage = Math.round((dailyTotals.carbs * 4 / dailyTotals.calories) * 100);
  const fatPercentage = Math.round((dailyTotals.fat * 9 / dailyTotals.calories) * 100);

  return (
    <Card>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        aria-label="nutrition breakdown tabs"
      >
        <Tab label="Daily Summary" />
        <Tab label="Macros" />
      </Tabs>
      
      <CardContent>
        {tabValue === 0 && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <LocalFireDepartmentIcon color="error" sx={{ mr: 1 }} />
              <Typography sx={{ flexGrow: 1 }}>Total Calories</Typography>
              <Typography variant="h6" fontWeight="bold" color="text.primary">
                {dailyTotals.calories} / {dailyGoals.calories}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Nutrition Breakdown
            </Typography>
            
            <NutritionProgress 
              label="Protein"
              value={dailyTotals.protein}
              maxValue={dailyGoals.protein}
              color="primary"
              icon={<FitnessCenterIcon color="primary" />}
            />
            
            <NutritionProgress 
              label="Carbohydrates"
              value={dailyTotals.carbs}
              maxValue={dailyGoals.carbs}
              color="secondary"
              icon={<GrainIcon color="secondary" />}
            />
            
            <NutritionProgress 
              label="Fat"
              value={dailyTotals.fat}
              maxValue={dailyGoals.fat}
              color="warning"
              icon={<WaterDropIcon color="warning" />}
            />
            
            <NutritionProgress 
              label="Fiber"
              value={dailyTotals.fiber}
              maxValue={dailyGoals.fiber}
              color="success"
              icon={<RestaurantIcon color="success" />}
            />
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Meal Distribution
            </Typography>
            
            {mealDistribution.map((meal) => (
              <Box key={meal.name} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                  {meal.name}
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {meal.value} cal ({Math.round((meal.value / dailyTotals.calories) * 100)}%)
                </Typography>
              </Box>
            ))}
          </Box>
        )}
        
        {tabValue === 1 && (
          <Box>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom sx={{ mb: 3 }}>
              Macronutrient Distribution
            </Typography>
            
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                textAlign: 'center',
                mb: 4
              }}
            >
              <Box>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {proteinPercentage}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Protein
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="h4" color="secondary" fontWeight="bold">
                  {carbsPercentage}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Carbs
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="h4" color="warning.main" fontWeight="bold">
                  {fatPercentage}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fat
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Detailed Breakdown
            </Typography>
            
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" fontWeight="medium">
                Protein: {dailyTotals.protein}g ({proteinPercentage}%)
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Target: {dailyGoals.protein}g • {dailyTotals.protein * 4} calories
              </Typography>
            </Box>
            
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" fontWeight="medium">
                Carbs: {dailyTotals.carbs}g ({carbsPercentage}%)
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Target: {dailyGoals.carbs}g • {dailyTotals.carbs * 4} calories
              </Typography>
            </Box>
            
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" fontWeight="medium">
                Fat: {dailyTotals.fat}g ({fatPercentage}%)
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Target: {dailyGoals.fat}g • {dailyTotals.fat * 9} calories
              </Typography>
            </Box>
            
            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Recommended macronutrient ranges:
                <br />• Protein: 20-35% of total calories
                <br />• Carbs: 45-65% of total calories
                <br />• Fat: 20-35% of total calories
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default NutritionBreakdown;