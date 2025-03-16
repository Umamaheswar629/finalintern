// src/pages/DiscoverPage.jsx
import { useState } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Button, 
  Card,
  CardContent,
  CardMedia,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  IconButton,
  Tabs,
  Tab
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// Mock data for trending recipes
const trendingRecipes = [
  {
    id: 1,
    title: 'Mediterranean Bowl',
    description: 'Fresh vegetables, hummus, falafel and tahini sauce',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500&auto=format&fit=crop',
    calories: 420,
    time: '25 min',
    favorite: false,
    tags: ['Vegetarian', 'High-Protein', 'Mediterranean'],
  },
  {
    id: 2,
    title: 'Asian Salmon Bowl',
    description: 'Grilled salmon, brown rice, avocado, and ginger dressing',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop',
    calories: 480,
    time: '20 min',
    favorite: true,
    tags: ['Pescatarian', 'High-Protein', 'Asian'],
  },
  {
    id: 3,
    title: 'Quinoa Power Salad',
    description: 'Quinoa, kale, roasted vegetables, and lemon tahini dressing',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=500&auto=format&fit=crop',
    calories: 350,
    time: '15 min',
    favorite: false,
    tags: ['Vegan', 'Gluten-Free', 'High-Fiber'],
  },
  {
    id: 4,
    title: 'Mexican Buddha Bowl',
    description: 'Black beans, corn, avocado, and chipotle lime dressing',
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=500&auto=format&fit=crop',
    calories: 410,
    time: '20 min',
    favorite: false,
    tags: ['Vegetarian', 'Mexican', 'High-Fiber'],
  },
];

// Popular food categories
const foodCategories = [
  { name: 'Mediterranean', icon: '🫒' },
  { name: 'Asian', icon: '🍱' },
  { name: 'Mexican', icon: '🌮' },
  { name: 'Italian', icon: '🍝' },
  { name: 'Indian', icon: '🍛' },
  { name: 'Vegetarian', icon: '🥗' },
  { name: 'Desserts', icon: '🍰' },
  { name: 'Smoothies', icon: '🥤' },
];

// Diet preferences
const dietOptions = [
  'Vegetarian',
  'Vegan',
  'Pescatarian',
  'Keto',
  'Paleo',
  'Gluten-Free',
  'Dairy-Free',
  'Low-Carb',
  'High-Protein',
];

const DiscoverPage = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [favorites, setFavorites] = useState(
    trendingRecipes.map(recipe => recipe.favorite)
  );

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const toggleFavorite = (index) => {
    const newFavorites = [...favorites];
    newFavorites[index] = !newFavorites[index];
    setFavorites(newFavorites);
  };

  return (
    <Box sx={{ py: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Page Header */}
        <Typography variant="h4" component="h1" fontWeight="700" sx={{ mb: 4 }}>
          Discover Recipes
        </Typography>

        {/* Search Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            mb: 4,
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <TextField
            fullWidth
            placeholder="Search for recipes, ingredients, or cuisines..."
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
            Popular Categories
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {foodCategories.map((category) => (
              <Grid item key={category.name}>
                <Chip
                  label={`${category.icon} ${category.name}`}
                  clickable
                  sx={{
                    borderRadius: '16px',
                    px: 1,
                    fontSize: '0.9rem',
                    '&:hover': {
                      bgcolor: 'primary.lighter',
                    }
                  }}
                />
              </Grid>
            ))}
          </Grid>

          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
            Dietary Preferences
          </Typography>
          <Grid container spacing={1}>
            {dietOptions.map((diet) => (
              <Grid item key={diet}>
                <Chip
                  label={diet}
                  variant="outlined"
                  clickable
                  sx={{
                    borderRadius: '16px',
                    '&:hover': {
                      bgcolor: 'primary.lighter',
                      borderColor: 'primary.main',
                    }
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Tabs Navigation */}
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: 'primary.main',
              },
            }}
          >
            <Tab 
              icon={<LocalFireDepartmentIcon />} 
              iconPosition="start" 
              label="Trending" 
            />
            <Tab 
              icon={<RestaurantIcon />} 
              iconPosition="start" 
              label="New Recipes" 
            />
            <Tab 
              icon={<EmojiEventsIcon />} 
              iconPosition="start" 
              label="Most Popular" 
            />
            <Tab 
              icon={<FavoriteIcon />} 
              iconPosition="start" 
              label="Your Favorites" 
            />
          </Tabs>
        </Box>

        {/* Recipe Cards */}
        <Typography variant="h5" fontWeight="600" sx={{ mb: 3 }}>
          {tabValue === 0 && "Trending Recipes"}
          {tabValue === 1 && "New Recipes"}
          {tabValue === 2 && "Most Popular Recipes"}
          {tabValue === 3 && "Your Favorite Recipes"}
        </Typography>
        
        <Grid container spacing={3}>
          {trendingRecipes.map((recipe, index) => (
            <Grid item xs={12} sm={6} md={4} key={recipe.id}>
              <Card sx={{ 
                borderRadius: 3, 
                overflow: 'hidden',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.1)',
                },
              }}>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={recipe.image}
                    alt={recipe.title}
                  />
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                      }
                    }}
                    onClick={() => toggleFavorite(index)}
                  >
                    {favorites[index] ? (
                      <FavoriteIcon color="error" />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div" fontWeight="600">
                    {recipe.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {recipe.description}
                  </Typography>
                  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" fontWeight="600" color="text.primary">
                        {recipe.calories}
                      </Box> cal
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" fontWeight="600" color="text.primary">
                        {recipe.time}
                      </Box>
                    </Typography>
                  </Stack>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {recipe.tags.map(tag => (
                      <Chip 
                        key={tag} 
                        label={tag} 
                        size="small" 
                        sx={{ 
                          bgcolor: 'primary.lighter', 
                          color: 'primary.main',
                          fontSize: '0.75rem',
                        }} 
                      />
                    ))}
                  </Box>
                </CardContent>
                <Box p={2} pt={0}>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    fullWidth
                    sx={{ borderRadius: '20px' }}
                  >
                    View Recipe
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Load More Button */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button 
            variant="outlined" 
            color="primary"
            sx={{ borderRadius: '20px', px: 4 }}
          >
            Load More Recipes
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default DiscoverPage;