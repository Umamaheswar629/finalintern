// src/components/common/Sidebar.jsx
import { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  Avatar, 
  Button,
  Divider,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import ExploreIcon from '@mui/icons-material/Explore';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LightModeIcon from '@mui/icons-material/LightMode';

// Custom styled list item for navigation
const NavItem = styled(ListItem)(({ theme, active }) => ({
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  backgroundColor: active ? theme.palette.primary.lighter : 'transparent',
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.lighter : theme.palette.action.hover,
  },
}));

const drawerWidth = 260;

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);

  // Navigation items
  const navItems = [
    { text: 'Planner', icon: <DateRangeIcon />, path: '/dashboard' },
    { text: 'Groceries', icon: <ShoppingBasketIcon />, path: '/groceries' },
    { text: 'Discover', icon: <ExploreIcon />, path: '/discover' },
    { text: 'Custom Recipes', icon: <RestaurantIcon />, path: '/recipes' },
    { text: 'Collections', icon: <CollectionsBookmarkIcon />, path: '/collections' },
    { text: 'Saved Plans', icon: <BookmarkIcon />, path: '/saved-plans' },
  ];

  const healthItems = [
    // { text: 'Diet & Nutrition', icon: <RestaurantMenuIcon />, path: '/nutrition' },
    // { text: 'Meals & Schedule', icon: <DateRangeIcon />, path: '/schedule' },
    // { text: 'Physical Stats', icon: <AssessmentIcon />, path: '/stats' },
    // { text: 'Weight and Goal', icon: <MonitorWeightIcon />, path: '/weight-goal' },
    // { text: 'Generator Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const accountItems = [
    { text: 'Account', icon: <PersonIcon />, path: '/account' },
    { text: 'Invite Friends', icon: <GroupAddIcon />, path: '/invite' },
    { text: 'Help', icon: <HelpOutlineIcon />, path: '/help' },
  ];

  // Check if the current path matches the nav item path
  const isActive = (path) => {
    return location.pathname === path;
  };

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2 }}>
        {/* User Profile Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>Mm</Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              mannemohith
            </Typography>
            <Button 
              variant="contained" 
              size="small" 
              color="warning"
              sx={{ 
                borderRadius: '12px', 
                textTransform: 'none',
                fontSize: '0.7rem',
                py: 0.25,
                px: 1
              }}
            >
              What's in Premium?
            </Button>
          </Box>
        </Box>

        {/* Main Navigation */}
        <List component="nav" sx={{ p: 0 }}>
          {navItems.map((item) => (
            <NavItem
              button
              key={item.text}
              component={RouterLink}
              to={item.path}
              active={isActive(item.path) ? 1 : 0}
            >
              <ListItemIcon sx={{ 
                color: isActive(item.path) ? 'primary.main' : 'inherit',
                minWidth: 36
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontSize: '0.95rem',
                  fontWeight: isActive(item.path) ? 600 : 400
                }}
              />
            </NavItem>
          ))}
        </List>

        {/* <Divider sx={{ my: 2 }} /> */}

        {/* Health & Nutrition Section */}
        <List component="nav" sx={{ p: 0 }}>
          {healthItems.map((item) => (
            <NavItem
              button
              key={item.text}
              component={RouterLink}
              to={item.path}
              active={isActive(item.path) ? 1 : 0}
            >
              <ListItemIcon sx={{ 
                color: isActive(item.path) ? 'primary.main' : 'inherit',
                minWidth: 36
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontSize: '0.95rem',
                  fontWeight: isActive(item.path) ? 600 : 400
                }}
              />
            </NavItem>
          ))}
        </List>

        {/* <Divider sx={{ my: 2 }} /> */}

        {/* Account Section */}
        <List component="nav" sx={{ p: 0 }}>
          {accountItems.map((item) => (
            <NavItem
              button
              key={item.text}
              component={RouterLink}
              to={item.path}
              active={isActive(item.path) ? 1 : 0}
            >
              <ListItemIcon sx={{ 
                color: isActive(item.path) ? 'primary.main' : 'inherit',
                minWidth: 36
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontSize: '0.95rem',
                  fontWeight: isActive(item.path) ? 600 : 400
                }}
              />
            </NavItem>
          ))}
        </List>
      </Box>

      {/* Theme Toggle - Bottom of Sidebar */}
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Button 
          fullWidth
          variant="outlined"
          startIcon={<LightModeIcon />}
          onClick={() => setDarkMode(!darkMode)}
          sx={{ justifyContent: 'flex-start', borderRadius: 2 }}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            borderRight: '1px solid rgba(0, 0, 0, 0.12)'
          },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            borderRight: '1px solid rgba(0, 0, 0, 0.12)'
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;