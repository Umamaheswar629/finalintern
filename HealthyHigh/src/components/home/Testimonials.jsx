// src/components/home/Testimonials.jsx
import { useState } from 'react';
import { Box, Container, Typography, Paper, Avatar, Rating, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Fitness Enthusiast',
    image: 'https://randomuser.me/api/portraits/women/32.jpg',
    quote: 'MealPlan has completely transformed how I approach nutrition. The meal plans are delicious and perfectly aligned with my fitness goals!',
    rating: 5
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    role: 'Busy Professional',
    image: 'https://randomuser.me/api/portraits/men/54.jpg',
    quote: 'As someone with a hectic schedule, MealPlan has been a lifesaver. I save so much time and mental energy not having to plan my meals.',
    rating: 5
  },
  {
    id: 3,
    name: 'Emma Chen',
    role: 'Health Coach',
    image: 'https://randomuser.me/api/portraits/women/45.jpg',
    quote: 'I recommend MealPlan to all my clients. The nutrition balance is spot-on and the interface makes it so easy to use!',
    rating: 5
  }
];

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom>
            What Our Users Say
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
            Discover how MealPlan is helping people reach their nutrition and fitness goals.
          </Typography>
        </Box>
        
        <Box sx={{ position: 'relative', maxWidth: '900px', mx: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Paper 
                elevation={3}
                sx={{ 
                  p: { xs: 4, md: 5 },
                  borderRadius: 4,
                  position: 'relative',
                }}
              >
                <FormatQuoteIcon 
                  sx={{ 
                    fontSize: 80, 
                    opacity: 0.1, 
                    color: 'primary.main',
                    position: 'absolute',
                    top: 20,
                    left: 20
                  }} 
                />
                
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: 'center',
                  gap: 4
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center'
                  }}>
                    <Avatar 
                      src={testimonials[currentTestimonial].image} 
                      alt={testimonials[currentTestimonial].name}
                      sx={{ 
                        width: 100, 
                        height: 100, 
                        border: 4, 
                        borderColor: 'primary.light' 
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ 
                    textAlign: { xs: 'center', md: 'left' },
                    position: 'relative',
                    zIndex: 1
                  }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontSize: '1.1rem',
                        fontStyle: 'italic',
                        mb: 3
                      }}
                    >
                      "{testimonials[currentTestimonial].quote}"
                    </Typography>
                    
                    <Rating 
                      value={testimonials[currentTestimonial].rating} 
                      readOnly 
                      sx={{ mb: 1 }}
                    />
                    
                    <Typography variant="h6" component="h4" gutterBottom sx={{ fontWeight: 600 }}>
                      {testimonials[currentTestimonial].name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testimonials[currentTestimonial].role}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </AnimatePresence>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: 4, 
            gap: 2 
          }}>
            <IconButton 
              onClick={prevTestimonial}
              sx={{ 
                bgcolor: 'background.paper', 
                boxShadow: 2,
                '&:hover': { bgcolor: 'grey.100' } 
              }}
              aria-label="Previous testimonial"
            >
              <ArrowBackIcon />
            </IconButton>
            <IconButton 
              onClick={nextTestimonial}
              sx={{ 
                bgcolor: 'background.paper', 
                boxShadow: 2,
                '&:hover': { bgcolor: 'grey.100' } 
              }}
              aria-label="Next testimonial"
            >
              <ArrowForwardIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Testimonials;