// src/pages/RecipesPage.jsx
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
  Divider,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Stack,
  Chip,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

// Mock data for user's custom recipes
const userRecipes = [
  {
    id: 1,
    title: 'Coconut Curry Lentil Soup',
    description: 'A hearty and flavorful soup perfect for chilly evenings',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=500&auto=format&fit=crop',
    calories: 310,
    time: '35 min',
    tags: ['Vegan', 'Gluten-Free', 'Soup'],
    lastEdited: '2 days ago'
  },
  {
    id: 2,
    title: 'Homemade Turkey Burgers',
    description: 'Lean turkey burgers with avocado and sweet potato fries',
    image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?q=80&w=500&auto=format&fit=crop',
    calories: 480,
    time: '25 min',
    tags: ['High-Protein', 'Dinner'],
    lastEdited: '1 week ago'
  },
  {
    id: 3,
    title: 'Classic Overnight Oats',
    description: 'Make-ahead breakfast with fruits, nuts, and honey',
    image: 'https://images.unsplash.com/photo-1551411193-4ca636feb3d9?q=80&w=500&auto=format&fit=crop',
    calories: 350,
    time: '10 min',
    tags: ['Breakfast', 'Vegetarian', 'Make-Ahead'],
    lastEdited: '3 days ago'
  },
  {
    id: 4,
    title: 'Spicy Tofu Stir Fry',
    description: 'Quick weeknight dinner with crispy tofu and fresh vegetables',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500&auto=format&fit=crop',
    calories: 380,
    time: '20 min',
    tags: ['Vegan', 'Asian', 'Quick'],
    lastEdited: '5 days ago'
  },
  {
    id: 5,
    title: 'Protein Packed Smoothie Bowl',
    description: 'Creamy smoothie base with colorful toppings and protein powder',
    image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?q=80&w=500&auto=format&fit=crop',
    calories: 320,
    time: '10 min',
    tags: ['Breakfast', 'High-Protein', 'Vegetarian'],
    lastEdited: '2 weeks ago'
  },
];

const RecipesPage = () => {
  const theme = useTheme();
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [currentRecipeId, setCurrentRecipeId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('recent');

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = (option) => {
    if (option) {
      setSortOption(option);
    }
    setSortAnchorEl(null);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleActionClick = (event, recipeId) => {
    setActionAnchorEl(event.currentTarget);
    setCurrentRecipeId(recipeId);
  };

  const handleActionClose = () => {
    setActionAnchorEl(null);
    setCurrentRecipeId(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Sort recipes based on selected option
  const sortedRecipes = [...userRecipes].sort((a, b) => {
    if (sortOption === 'recent') {
      // Just use the existing order for mock data
      return 0;
    } else if (sortOption === 'calories-asc') {
      return a.calories - b.calories;
    } else if (sortOption === 'calories-desc') {
      return b.calories - a.calories;
    } else if (sortOption === 'time') {
      return parseInt(a.time) - parseInt(b.time);
    } else if (sortOption === 'alphabetical') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  // Filter recipes based on search query
  const filteredRecipes = sortedRecipes.filter(recipe => 
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Box sx={{ py: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Page Header with Add Recipe Button */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Grid item xs>
            <Typography variant="h4" component="h1" fontWeight="700">
              Your Custom Recipes
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create, edit, and organize your personal recipes
            </Typography>
          </Grid>
          <Grid item>
            <Button 
              startIcon={<AddIcon />}
              variant="contained" 
              color="primary"
              sx={{ borderRadius: '20px' }}
            >
              Create New Recipe
            </Button>
          </Grid>
        </Grid>

        {/* Search and Filter Bar */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            borderRadius: 3,
            mb: 4,
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search your recipes..."
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={2} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<SortIcon />}
                  onClick={handleSortClick}
                  sx={{ borderRadius: '20px' }}
                >
                  Sort
                </Button>
                <Menu
                  anchorEl={sortAnchorEl}
                  open={Boolean(sortAnchorEl)}
                  onClose={() => handleSortClose()}
                >
                  <MenuItem onClick={() => handleSortClose('recent')}>Most Recent</MenuItem>
                  <MenuItem onClick={() => handleSortClose('alphabetical')}>Alphabetical</MenuItem>
                  <MenuItem onClick={() => handleSortClose('calories-asc')}>Calories (Low to High)</MenuItem>
                  <MenuItem onClick={() => handleSortClose('calories-desc')}>Calories (High to Low)</MenuItem>
                  <MenuItem onClick={() => handleSortClose('time')}>Preparation Time</MenuItem>
                </Menu>

                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  onClick={handleFilterClick}
                  sx={{ borderRadius: '20px' }}
                >
                  Filter
                </Button>
                <Menu
                  anchorEl={filterAnchorEl}
                  open={Boolean(filterAnchorEl)}
                  onClose={handleFilterClose}
                >
                  <MenuItem>Breakfast</MenuItem>
                  <MenuItem>Lunch</MenuItem>
                  <MenuItem>Dinner</MenuItem>
                  <MenuItem>Snacks</MenuItem>
                  <MenuItem>Vegetarian</MenuItem>
                  <MenuItem>Vegan</MenuItem>
                  <MenuItem>High-Protein</MenuItem>
                  <MenuItem>Low-Carb</MenuItem>
                </Menu>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Recipe Cards */}
        {filteredRecipes.length > 0 ? (
          <Grid container spacing={3}>
            {filteredRecipes.map((recipe) => (
              <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                <Card sx={{ 
                  borderRadius: 3, 
                  overflow: 'hidden',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
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
                      onClick={(e) => handleActionClick(e, recipe.id)}
                    >
                      <MoreVertIcon />
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
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocalFireDepartmentIcon color="action" fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                          {recipe.calories} cal
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTimeIcon color="action" fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                          {recipe.time}
                        </Typography>
                      </Box>
                    </Stack>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
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
                    <Typography variant="caption" color="text.secondary">
                      Last edited: {recipe.lastEdited}
                    </Typography>
                  </CardContent>
                  <Box p={2} pt={0}>
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      fullWidth
                      startIcon={<EditIcon />}
                      sx={{ borderRadius: '20px' }}
                    >
                      Edit Recipe
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              textAlign: 'center',
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Typography variant="h6" gutterBottom>
              No recipes found
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {searchQuery ? 
                `No recipes match your search for "${searchQuery}"` : 
                "You haven't created any recipes yet"}
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<AddIcon />}
              sx={{ borderRadius: '20px', mt: 2 }}
            >
              Create Your First Recipe
            </Button>
          </Paper>
        )}

        {/* Action Menu for recipe options */}
        <Menu
          anchorEl={actionAnchorEl}
          open={Boolean(actionAnchorEl)}
          onClose={handleActionClose}
        >
          <MenuItem onClick={handleActionClose}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Edit Recipe
          </MenuItem>
          <MenuItem onClick={handleActionClose}>
            <ContentCopyIcon fontSize="small" sx={{ mr: 1 }} />
            Duplicate
          </MenuItem>
          <MenuItem onClick={handleActionClose}>
            <DeleteOutlineIcon fontSize="small" sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>
      </Container>
    </Box>
  );
};

export default RecipesPage;