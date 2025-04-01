// {// src/pages/CollectionsPage.jsx
// import { useState } from 'react';
// import { 
//   Box, 
//   Container, 
//   Grid, 
//   Typography, 
//   Paper, 
//   Button, 
//   IconButton,
//   Divider,
//   Card,
//   CardContent,
//   CardMedia,
//   CardActionArea,
//   Stack,
//   TextField,
//   InputAdornment,
//   Tab,
//   Tabs,
//   Menu,
//   MenuItem,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   FormControl,
//   InputLabel,
//   Select
// } from '@mui/material';
// import { useTheme } from '@mui/material/styles';
// import SearchIcon from '@mui/icons-material/Search';
// import AddIcon from '@mui/icons-material/Add';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import FilterListIcon from '@mui/icons-material/FilterList';
// import SortIcon from '@mui/icons-material/Sort';
// import FolderIcon from '@mui/icons-material/Folder';
// import BookmarkIcon from '@mui/icons-material/Bookmark';
// import RestaurantIcon from '@mui/icons-material/Restaurant';
// import AutorenewIcon from '@mui/icons-material/Autorenew';

// // Mock data for collections
// const mockCollections = [
//   {
//     id: 1,
//     title: "Weekday Meal Plans",
//     description: "Quick and easy meals for busy weekdays",
//     count: 12,
//     thumbnail: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=500&auto=format&fit=crop",
//     type: "plan"
//   },
//   {
//     id: 2,
//     title: "Favorite Recipes",
//     description: "My go-to recipes that never disappoint",
//     count: 24,
//     thumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=500&auto=format&fit=crop",
//     type: "recipe"
//   },
//   {
//     id: 3,
//     title: "High Protein Meals",
//     description: "Recipes with at least 30g protein per serving",
//     count: 18,
//     thumbnail: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?q=80&w=500&auto=format&fit=crop",
//     type: "recipe"
//   },
//   {
//     id: 4,
//     title: "Vegetarian Options",
//     description: "Plant-based meals and alternatives",
//     count: 15,
//     thumbnail: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=500&auto=format&fit=crop",
//     type: "plan"
//   },
//   {
//     id: 5,
//     title: "Weekend Cooking Projects",
//     description: "More elaborate recipes for when I have time",
//     count: 8,
//     thumbnail: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=500&auto=format&fit=crop",
//     type: "recipe"
//   },
//   {
//     id: 6,
//     title: "Quick Lunches",
//     description: "Meals that can be prepared in under 20 minutes",
//     count: 16,
//     thumbnail: "https://images.unsplash.com/photo-1600335895229-6e75511892c8?q=80&w=500&auto=format&fit=crop",
//     type: "plan"
//   }
// ];

// const CollectionsPage = () => {
//   const theme = useTheme();
//   const [searchValue, setSearchValue] = useState('');
//   const [tabValue, setTabValue] = useState(0);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [createDialogOpen, setCreateDialogOpen] = useState(false);
//   const [newCollection, setNewCollection] = useState({
//     title: '',
//     description: '',
//     type: 'plan'
//   });

//   // Handle tab change
//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   // Handle menu open
//   const handleMenuClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   // Handle menu close
//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   // Handle search input
//   const handleSearchChange = (event) => {
//     setSearchValue(event.target.value);
//   };

//   // Open create collection dialog
//   const handleOpenCreateDialog = () => {
//     setCreateDialogOpen(true);
//   };

//   // Close create collection dialog
//   const handleCloseCreateDialog = () => {
//     setCreateDialogOpen(false);
//     setNewCollection({
//       title: '',
//       description: '',
//       type: 'plan'
//     });
//   };

//   // Handle input change for new collection
//   const handleNewCollectionChange = (event) => {
//     const { name, value } = event.target;
//     setNewCollection({
//       ...newCollection,
//       [name]: value
//     });
//   };

//   // Filter collections based on tab selection
//   const filteredCollections = tabValue === 0 
//     ? mockCollections 
//     : tabValue === 1 
//       ? mockCollections.filter(collection => collection.type === 'plan')
//       : mockCollections.filter(collection => collection.type === 'recipe');

//   // Further filter based on search term
//   const searchFilteredCollections = searchValue.trim() === ''
//     ? filteredCollections
//     : filteredCollections.filter(collection => 
//         collection.title.toLowerCase().includes(searchValue.toLowerCase()) ||
//         collection.description.toLowerCase().includes(searchValue.toLowerCase())
//       );

//   return (
//     <Box sx={{ py: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
//       <Container maxWidth="lg">
//         {/* Page Header */}
//         <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
//           <Grid item xs>
//             <Typography variant="h4" component="h1" fontWeight="700">
//               My Collections
//             </Typography>
//             <Typography variant="body1" color="text.secondary">
//               Organize your favorite meal plans and recipes
//             </Typography>
//           </Grid>
//           <Grid item>
//             <Button 
//               startIcon={<AddIcon />}
//               variant="contained" 
//               color="primary"
//               onClick={handleOpenCreateDialog}
//               sx={{ borderRadius: '20px' }}
//             >
//               Create Collection
//             </Button>
//           </Grid>
//         </Grid>

//         {/* Search and Filter Bar */}
//         <Paper 
//           elevation={0}
//           sx={{ 
//             p: 2, 
//             mb: 3, 
//             borderRadius: 3,
//             border: `1px solid ${theme.palette.divider}`,
//             display: 'flex',
//             flexDirection: { xs: 'column', sm: 'row' },
//             gap: 2,
//             alignItems: 'center'
//           }}
//         >
//           <TextField
//             placeholder="Search collections"
//             variant="outlined"
//             fullWidth
//             size="small"
//             value={searchValue}
//             onChange={handleSearchChange}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon />
//                 </InputAdornment>
//               ),
//               sx: { borderRadius: 2 }
//             }}
//           />
//           <Stack direction="row" spacing={1}>
//             <Button 
//               startIcon={<FilterListIcon />}
//               variant="outlined" 
//               onClick={handleMenuClick}
//               sx={{ borderRadius: '20px' }}
//             >
//               Filter
//             </Button>
//             <Button 
//               startIcon={<SortIcon />}
//               variant="outlined" 
//               onClick={handleMenuClick}
//               sx={{ borderRadius: '20px' }}
//             >
//               Sort
//             </Button>
//           </Stack>
//         </Paper>

//         {/* Tabs */}
//         <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
//           <Tabs 
//             value={tabValue} 
//             onChange={handleTabChange}
//             indicatorColor="primary"
//             textColor="primary"
//           >
//             <Tab label="All Collections" />
//             <Tab label="Meal Plans" />
//             <Tab label="Recipes" />
//           </Tabs>
//         </Box>

//         {/* Collections Grid */}
//         {searchFilteredCollections.length > 0 ? (
//           <Grid container spacing={3}>
//             {searchFilteredCollections.map(collection => (
//               <Grid item xs={12} sm={6} md={4} key={collection.id}>
//                 <Card 
//                   sx={{ 
//                     height: '100%', 
//                     display: 'flex', 
//                     flexDirection: 'column',
//                     borderRadius: 3,
//                     overflow: 'hidden',
//                     transition: 'transform 0.2s',
//                     '&:hover': {
//                       transform: 'translateY(-4px)',
//                       boxShadow: theme.shadows[4]
//                     }
//                   }}
//                 >
//                   <CardActionArea sx={{ flexGrow: 1 }}>
//                     <CardMedia
//                       component="img"
//                       height="160"
//                       image={collection.thumbnail}
//                       alt={collection.title}
//                     />
//                     <CardContent>
//                       <Box sx={{ mb: 2 }}>
//                         <Typography variant="body2" color="text.secondary" gutterBottom>
//                           {collection.type === 'plan' ? 'Meal Plans' : 'Recipes'}
//                         </Typography>
//                         <Typography variant="h6" component="h2" fontWeight="600">
//                           {collection.title}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           {collection.description}
//                         </Typography>
//                       </Box>
//                       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                         <Typography variant="body2" color="text.secondary">
//                           {collection.count} items
//                         </Typography>
//                         <IconButton aria-label="more options" size="small">
//                           <MoreVertIcon fontSize="small" />
//                         </IconButton>
//                       </Box>
//                     </CardContent>
//                   </CardActionArea>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         ) : (
//           <Paper 
//             elevation={0}
//             sx={{ 
//               p: 4, 
//               borderRadius: 3,
//               border: `1px solid ${theme.palette.divider}`,
//               textAlign: 'center'
//             }}
//           >
//             <Box 
//               sx={{ 
//                 display: 'flex', 
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 mb: 3
//               }}
//             >
//               <FolderIcon sx={{ fontSize: 60, color: 'primary.light', mb: 2 }} />
//               <Typography variant="h6" gutterBottom>
//                 No collections found
//               </Typography>
//               <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//                 {searchValue.trim() !== '' 
//                   ? `No collections match "${searchValue}"`
//                   : tabValue === 0 
//                     ? "You haven't created any collections yet"
//                     : tabValue === 1 
//                       ? "You haven't created any meal plan collections yet"
//                       : "You haven't created any recipe collections yet"
//                 }
//               </Typography>
//               <Button 
//                 variant="contained" 
//                 color="primary"
//                 startIcon={<AddIcon />}
//                 onClick={handleOpenCreateDialog}
//                 sx={{ borderRadius: '20px' }}
//               >
//                 Create Collection
//               </Button>
//             </Box>
//           </Paper>
//         )}

//         {/* Help Information */}
//         {searchFilteredCollections.length > 0 && (
//           <Paper 
//             elevation={0}
//             sx={{ 
//               p: 3, 
//               mt: 4,
//               borderRadius: 3,
//               border: `1px solid ${theme.palette.divider}`
//             }}
//           >
//             <Typography variant="h6" fontWeight="600" gutterBottom>
//               About Collections
//             </Typography>
//             <Typography variant="body2" color="text.secondary" paragraph>
//               Collections help you organize your favorite meal plans and recipes. You can create different collections for weekday meals, special occasions, dietary preferences, and more.
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               To add items to a collection, look for the <BookmarkIcon sx={{ fontSize: 16, verticalAlign: 'text-bottom' }} /> icon when viewing recipes or meal plans.
//             </Typography>
//           </Paper>
//         )}
//       </Container>

//       {/* Create Collection Dialog */}
//       <Dialog open={createDialogOpen} onClose={handleCloseCreateDialog} fullWidth maxWidth="sm">
//         <DialogTitle>Create New Collection</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             name="title"
//             label="Collection Name"
//             type="text"
//             fullWidth
//             variant="outlined"
//             value={newCollection.title}
//             onChange={handleNewCollectionChange}
//             sx={{ mb: 2, mt: 1 }}
//           />
//           <TextField
//             margin="dense"
//             name="description"
//             label="Description (optional)"
//             type="text"
//             fullWidth
//             variant="outlined"
//             multiline
//             rows={2}
//             value={newCollection.description}
//             onChange={handleNewCollectionChange}
//             sx={{ mb: 2 }}
//           />
//           <FormControl fullWidth variant="outlined">
//             <InputLabel id="collection-type-label">Collection Type</InputLabel>
//             <Select
//               labelId="collection-type-label"
//               id="collection-type"
//               name="type"
//               value={newCollection.type}
//               onChange={handleNewCollectionChange}
//               label="Collection Type"
//             >
//               <MenuItem value="plan">
//                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                   <AutorenewIcon sx={{ mr: 1 }} />
//                   Meal Plans
//                 </Box>
//               </MenuItem>
//               <MenuItem value="recipe">
//                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                   <RestaurantIcon sx={{ mr: 1 }} />
//                   Recipes
//                 </Box>
//               </MenuItem>
//             </Select>
//           </FormControl>
//         </DialogContent>
//         <DialogActions sx={{ px: 3, pb: 3 }}>
//           <Button onClick={handleCloseCreateDialog} variant="outlined" sx={{ borderRadius: '20px' }}>
//             Cancel
//           </Button>
//           <Button onClick={handleCloseCreateDialog} variant="contained" color="primary" sx={{ borderRadius: '20px' }}>
//             Create
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Filter/Sort Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//         anchorOrigin={{
//           vertical: 'bottom',
//           horizontal: 'right',
//         }}
//         transformOrigin={{
//           vertical: 'top',
//           horizontal: 'right',
//         }}
//       >
//         <MenuItem onClick={handleMenuClose}>Recently Updated</MenuItem>
//         <MenuItem onClick={handleMenuClose}>Alphabetical (A-Z)</MenuItem>
//         <MenuItem onClick={handleMenuClose}>Most Items</MenuItem>
//         <MenuItem onClick={handleMenuClose}>Recently Created</MenuItem>
//       </Menu>
//     </Box>
//   );
// };

// export default CollectionsPage;}

import React, { useState, useEffect } from 'react';
import RecipeCard from '../components/recipeCard';
import { recipeService } from '../services/recipeService';

const CollectionPage = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await recipeService.getUserFavorites();
        setFavorites(data);
      } catch (error) {
        console.error('Error fetching favorites', error);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (recipeId) => {
    try {
      await recipeService.toggleFavorite(recipeId);
      // Refresh favorites
      const updatedFavorites = await recipeService.getUserFavorites();
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error removing favorite', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Favorite Recipes</h1>
      {favorites.length === 0 ? (
        <p>You have no favorite recipes yet.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {favorites.map(recipe => (
            <RecipeCard 
              key={recipe._id} 
              recipe={recipe} 
              onFavorite={handleRemoveFavorite} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionPage;