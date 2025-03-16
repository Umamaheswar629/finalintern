// src/App.js
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Toolbar, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import theme from './theme/theme';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import MealPlannerPage from './pages/MealPlannerPage';
import SavedPlansPage from './pages/SavedPlansPage';
import HowItWorksPage from './pages/HowItWorksPage';
import Login from './pages/LoginPage';
import SignUp from './pages/SignUpPage';
import GroceriesPage from './pages/GroceriesPage';
import DiscoverPage from './pages/DiscoverPage';
import RecipesPage from './pages/RecipesPage';
import AccountPage from './pages/AccountPage';
import InviteFriendsPage from './pages/InviteFriends';
import CollectionsPage from './pages/CollectionPage';
import PrivateRoute from "./routes/PrivateRoute"; 

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
         <Route path="/groceries" element={<GroceriesPage />} />
        <Route path="register" element={<SignUp />} />
        <Route path="login" element={<Login />} />
          {/* Landing page route */}
          <Route 
            path="/" 
            element={
              <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Navbar />
                <Box component="main" sx={{ flexGrow: 1 }}>
                  <HomePage />
                </Box>
                <Footer />
              </Box>
            } 
          />
          
          {/* Dashboard and app routes with sidebar */}
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute>
              <Box sx={{ display: 'flex' }}>
                <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
                <Box 
                  component="main" 
                  sx={{ 
                    flexGrow: 1, 
                    width: { md: `calc(100% - 260px)` },
                    ml: { md: '260px' }
                  }}
                >
                  {/* Mobile menu button */}
                  <Box 
                    sx={{ 
                      display: { xs: 'block', md: 'none' }, 
                      position: 'fixed',
                      top: 10,
                      left: 10,
                      zIndex: 1100
                    }}
                  >
                    <IconButton
                      color="inherit"
                      aria-label="open drawer"
                      edge="start"
                      onClick={handleDrawerToggle}
                      sx={{ bgcolor: 'background.paper', boxShadow: 1 }}
                    >
                      <MenuIcon />
                    </IconButton>
                  </Box>
                  
                  <Routes>
                    <Route index element={<DashboardPage />} />
                    <Route path="account" element={<AccountPage />} />
                    <Route path="groceries" element={<GroceriesPage />} />
                    <Route path="recipes" element={<RecipesPage />} />  
                    <Route path="discover" element={<DiscoverPage />} />
                    <Route path="meal-planner" element={<MealPlannerPage />} />
                    <Route path="saved-plans" element={<SavedPlansPage />} />
                    <Route path="how-it-works" element={<HowItWorksPage />} />
                    <Route path="invite" element={<InviteFriendsPage />} />
                    <Route path="collections" element={<CollectionsPage />} />
                    {/* Add more routes for dashboard features */}
                  </Routes>
                </Box>
              </Box>
              </PrivateRoute>
            }
          />
          
          {/* Redirects */}
          <Route path="/login" element={<Navigate to="/dashboard/login" replace />} />
          <Route path="/register" element={<Navigate to="/dashboard/register" replace />} />
          <Route path="/meal-planner" element={<Navigate to="/dashboard/meal-planner" replace />} />
          <Route path="/saved-plans" element={<Navigate to="/dashboard/saved-plans" replace />} />
          <Route path="/how-it-works" element={<Navigate to="/dashboard/how-it-works" replace />} />
          <Route path="/groceries" element={<Navigate to="/dashboard/groceries" replace />} />
          <Route path="/discover" element={<Navigate to="/dashboard/discover" replace />} />
          <Route path="/recipes" element={<Navigate to="/dashboard/recipes" replace />} />
          <Route path="/account" element={<Navigate to="/dashboard/account" replace />} />
          <Route path="/invite" element={<Navigate to="/dashboard/invite" replace />} />
          <Route path="/collections" element={<Navigate to="/dashboard/collections" replace />} />
          
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;