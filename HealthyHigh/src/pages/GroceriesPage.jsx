// src/pages/GroceriesPage.jsx
import { useState } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Button, 
  TextField,
  Checkbox,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  FormControlLabel,
  InputAdornment,
  Chip,
  Stack
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';

// Mock data for grocery categories
const categories = [
  { id: 1, name: 'Fruits & Vegetables', count: 8 },
  { id: 2, name: 'Meat & Seafood', count: 3 },
  { id: 3, name: 'Dairy & Eggs', count: 5 },
  { id: 4, name: 'Bread & Bakery', count: 2 },
  { id: 5, name: 'Pantry Staples', count: 7 },
  { id: 6, name: 'Frozen Foods', count: 4 },
  { id: 7, name: 'Snacks', count: 3 },
  { id: 8, name: 'Beverages', count: 2 }
];

// Mock data for grocery items
const initialGroceryItems = [
  { id: 1, name: 'Apples', quantity: '5', unit: 'pcs', category: 'Fruits & Vegetables', checked: false },
  { id: 2, name: 'Bananas', quantity: '2', unit: 'lbs', category: 'Fruits & Vegetables', checked: false },
  { id: 3, name: 'Chicken Breast', quantity: '1', unit: 'kg', category: 'Meat & Seafood', checked: false },
  { id: 4, name: 'Eggs', quantity: '12', unit: 'pcs', category: 'Dairy & Eggs', checked: false },
  { id: 5, name: 'Milk', quantity: '1', unit: 'gallon', category: 'Dairy & Eggs', checked: false },
  { id: 6, name: 'Bread', quantity: '1', unit: 'loaf', category: 'Bread & Bakery', checked: false },
  { id: 7, name: 'Rice', quantity: '2', unit: 'kg', category: 'Pantry Staples', checked: false },
  { id: 8, name: 'Pasta', quantity: '500', unit: 'g', category: 'Pantry Staples', checked: false },
  { id: 9, name: 'Frozen Pizza', quantity: '2', unit: 'pcs', category: 'Frozen Foods', checked: false },
  { id: 10, name: 'Orange Juice', quantity: '1', unit: 'ltr', category: 'Beverages', checked: false }
];

const GroceriesPage = () => {
  const theme = useTheme();
  const [groceryItems, setGroceryItems] = useState(initialGroceryItems);
  const [newItem, setNewItem] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Add new item
  const handleAddItem = () => {
    if (newItem.trim() !== '') {
      const newGroceryItem = {
        id: Date.now(), // Simple ID generation for demo
        name: newItem,
        quantity: '1',
        unit: 'pcs',
        category: 'Uncategorized',
        checked: false
      };
      setGroceryItems([...groceryItems, newGroceryItem]);
      setNewItem('');
    }
  };

  // Toggle item checked status
  const handleToggleCheck = (id) => {
    setGroceryItems(groceryItems.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  // Delete item
  const handleDeleteItem = (id) => {
    setGroceryItems(groceryItems.filter(item => item.id !== id));
  };

  // Filter items by search and category
  const filteredItems = groceryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Box sx={{ py: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Page Header */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Grid item xs>
            <Typography variant="h4" component="h1" fontWeight="700">
              Grocery List
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your shopping list and keep track of what you need
            </Typography>
          </Grid>
          <Grid item>
            <Stack direction="row" spacing={1}>
              <Button 
                startIcon={<PrintIcon />}
                variant="outlined" 
                sx={{ borderRadius: '20px' }}
              >
                Print
              </Button>
              <Button 
                startIcon={<ShareIcon />}
                variant="outlined" 
                sx={{ borderRadius: '20px' }}
              >
                Share
              </Button>
            </Stack>
          </Grid>
        </Grid>

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Categories - Left Side */}
          <Grid item xs={12} md={3}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 3,
                mb: 3,
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                Categories
              </Typography>
              <List disablePadding>
                <ListItem 
                  button 
                  selected={selectedCategory === 'All'}
                  onClick={() => setSelectedCategory('All')}
                  sx={{ 
                    borderRadius: 2, 
                    mb: 1,
                    bgcolor: selectedCategory === 'All' ? 'primary.lighter' : 'transparent'
                  }}
                >
                  <ListItemText 
                    primary="All Items" 
                    primaryTypographyProps={{ fontWeight: selectedCategory === 'All' ? 600 : 400 }}
                  />
                  <Chip 
                    label={groceryItems.length} 
                    size="small" 
                    sx={{ bgcolor: selectedCategory === 'All' ? 'primary.light' : 'grey.200' }}
                  />
                </ListItem>
                {categories.map((category) => (
                  <ListItem 
                    button 
                    key={category.id}
                    selected={selectedCategory === category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    sx={{ 
                      borderRadius: 2, 
                      mb: 1,
                      bgcolor: selectedCategory === category.name ? 'primary.lighter' : 'transparent'
                    }}
                  >
                    <ListItemText 
                      primary={category.name} 
                      primaryTypographyProps={{ fontWeight: selectedCategory === category.name ? 600 : 400 }}
                    />
                    <Chip 
                      label={category.count} 
                      size="small" 
                      sx={{ bgcolor: selectedCategory === category.name ? 'primary.light' : 'grey.200' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>

            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                Shopping Tips
              </Typography>
              <Typography variant="body2" paragraph>
                • Plan your meals before shopping to avoid buying unnecessary items
              </Typography>
              <Typography variant="body2" paragraph>
                • Check your pantry before leaving to avoid duplicates
              </Typography>
              <Typography variant="body2" paragraph>
                • Shop the perimeter of the store first for fresh foods
              </Typography>
              <Typography variant="body2" paragraph>
                • Buy seasonal produce for better prices and quality
              </Typography>
            </Paper>
          </Grid>

          {/* Grocery List - Right Side */}
          <Grid item xs={12} md={9}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 3,
                mb: 3,
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              {/* Search and Add Items */}
              <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Grid item xs>
                  <TextField
                    fullWidth
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 4 }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm="auto">
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      placeholder="Add new item..."
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddItem();
                        }
                      }}
                      InputProps={{ sx: { borderRadius: 4 } }}
                      sx={{ flexGrow: 1 }}
                    />
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddItem}
                      sx={{ borderRadius: '20px' }}
                    >
                      Add
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              {/* Grocery List */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                  Your Shopping List ({filteredItems.length} items)
                </Typography>
                
                <Divider sx={{ mb: 2 }} />
                
                {filteredItems.length > 0 ? (
                  <List disablePadding>
                    {filteredItems.map((item) => (
                      <ListItem 
                        key={item.id}
                        disablePadding
                        sx={{ 
                          py: 1, 
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          textDecoration: item.checked ? 'line-through' : 'none',
                          color: item.checked ? 'text.disabled' : 'text.primary'
                        }}
                        secondaryAction={
                          <IconButton 
                            edge="end" 
                            aria-label="delete"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        }
                      >
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={item.checked}
                            onChange={() => handleToggleCheck(item.id)}
                            disableRipple
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.name}
                          secondary={`${item.quantity} ${item.unit}`}
                          primaryTypographyProps={{ fontWeight: 500 }}
                        />
                        <Chip 
                          label={item.category} 
                          size="small" 
                          sx={{ mr: 3, bgcolor: 'primary.lighter', color: 'primary.main' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <ShoppingCartIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      No items found
                    </Typography>
                    <Typography variant="body2" color="text.disabled">
                      {searchQuery ? 'Try a different search term' : 'Add some items to your grocery list'}
                    </Typography>
                  </Box>
                )}
              </Box>
              
              {filteredItems.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setGroceryItems(groceryItems.filter(item => !item.checked))}
                    sx={{ borderRadius: '20px' }}
                  >
                    Remove Checked Items
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setGroceryItems(groceryItems.map(item => ({ ...item, checked: false })))}
                    sx={{ borderRadius: '20px' }}
                  >
                    Uncheck All
                  </Button>
                </Box>
              )}
            </Paper>

            {/* Recently Added Items */}
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                Recently Added
              </Typography>
              <Grid container spacing={2}>
                {groceryItems.slice(-4).reverse().map(item => (
                  <Grid item xs={12} sm={6} md={3} key={item.id}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="600">
                        {item.name}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {item.quantity} {item.unit}
                        </Typography>
                        <IconButton size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default GroceriesPage;