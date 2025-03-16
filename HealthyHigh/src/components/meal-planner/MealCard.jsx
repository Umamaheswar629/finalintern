// src/components/meal-planner/MealCard.jsx
import { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardMedia, 
  CardActions,
  Typography, 
  Button, 
  Chip, 
  IconButton, 
  Collapse,
  Box,
  Divider
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const MealCard = ({ 
  meal, 
  onFavorite, 
  onSwap,
  mealType,
  isFavorite = false
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)'
        }
      }}
    >
      <CardHeader
        avatar={
          <Chip 
            icon={<RestaurantIcon />} 
            label={mealType} 
            color="primary" 
            size="small" 
          />
        }
        action={
          <IconButton 
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            onClick={() => onFavorite(meal.id)}
            color={isFavorite ? "primary" : "default"}
          >
            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        }
        title={meal.title}
        subheader={`${meal.calories} calories | ${meal.prepTime} min`}
      />
      <CardMedia
        component="img"
        height="180"
        image={meal.image}
        alt={meal.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {meal.tags.map((tag) => (
            <Chip 
              key={tag} 
              label={tag} 
              size="small" 
              variant="outlined" 
              color="secondary"
            />
          ))}
        </Box>
        <Typography variant="body2" color="text.secondary">
          {meal.description}
        </Typography>
      </CardContent>
      
      <Divider />
      
      <CardActions disableSpacing>
        <Button 
          startIcon={<SwapHorizIcon />}
          size="small"
          onClick={() => onSwap(meal.id, mealType)}
        >
          Swap Meal
        </Button>
        <Button
          size="small"
          endIcon={<ExpandMoreIcon 
            sx={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s'
            }}
          />}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          {expanded ? "Hide Details" : "View Details"}
        </Button>
      </CardActions>
      
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="h6" gutterBottom>Nutrition Facts</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Typography variant="body2">Protein: {meal.nutrition.protein}g</Typography>
            <Typography variant="body2">Carbs: {meal.nutrition.carbs}g</Typography>
            <Typography variant="body2">Fat: {meal.nutrition.fat}g</Typography>
            <Typography variant="body2">Fiber: {meal.nutrition.fiber}g</Typography>
          </Box>
          
          <Typography variant="h6" gutterBottom>Ingredients</Typography>
          <Box component="ul" sx={{ pl: 2, mt: 0 }}>
            {meal.ingredients.map((ingredient, index) => (
              <Typography component="li" key={index} variant="body2">
                {ingredient}
              </Typography>
            ))}
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default MealCard;