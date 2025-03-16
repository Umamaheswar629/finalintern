// src/pages/InviteFriendsPage.jsx
import { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Divider,
  Grid,
  IconButton,
  Avatar,
  Chip,
  Alert,
  Snackbar
} from '@mui/material';
import { motion } from 'framer-motion';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import SendIcon from '@mui/icons-material/Send';
import LinkIcon from '@mui/icons-material/Link';
import PeopleIcon from '@mui/icons-material/People';

const InviteFriendsPage = () => {
  const [emails, setEmails] = useState('');
  const [inviteSent, setInviteSent] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [error, setError] = useState('');

  // Referral link
  const referralLink = 'https://mealplan.app/ref/mannemohith123';

  // Handle email input change
  const handleEmailChange = (e) => {
    setEmails(e.target.value);
    setError('');
  };

  // Copy referral link to clipboard
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 3000);
      })
      .catch(() => {
        setError('Failed to copy link. Please try again.');
      });
  };

  // Send email invitations
  const sendInvitations = () => {
    if (!emails.trim()) {
      setError('Please enter at least one email address');
      return;
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Split by commas and validate each email
    const emailList = emails.split(',').map(email => email.trim());
    const invalidEmails = emailList.filter(email => !emailRegex.test(email));
    
    if (invalidEmails.length > 0) {
      setError(`Invalid email${invalidEmails.length > 1 ? 's' : ''}: ${invalidEmails.join(', ')}`);
      return;
    }

    // Here you would send the invitations to the API
    console.log('Sending invitations to:', emailList);
    
    // Show success notification
    setInviteSent(true);
    setEmails('');

    // Hide notification after 3 seconds
    setTimeout(() => setInviteSent(false), 3000);
  };

  // Rewards data
  const rewards = [
    { count: 1, reward: 'Free premium for a month' },
    { count: 5, reward: '3 months of premium access' },
    { count: 10, reward: 'A year of premium for free' },
  ];

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
            Invite Friends
          </Typography>
          
          <Grid container spacing={3}>
            {/* Main Invitation Card */}
            <Grid item xs={12}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  boxShadow: 3,
                  mb: 3,
                  bgcolor: 'primary.lighter'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <PeopleIcon />
                  </Avatar>
                  <Typography variant="h5" component="h2" fontWeight={600}>
                    Share the joy of meal planning
                  </Typography>
                </Box>
                
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Invite your friends to join our meal planning app and both of you will receive rewards!
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                    Your personal referral link
                  </Typography>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      p: 1.5,
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      mb: 2,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <LinkIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        flexGrow: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {referralLink}
                    </Typography>
                    <Button 
                      variant="contained" 
                      startIcon={<ContentCopyIcon />}
                      onClick={copyReferralLink}
                      size="small"
                    >
                      Copy
                    </Button>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    OR INVITE BY EMAIL
                  </Typography>
                </Divider>
                
                <Box sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    variant="outlined"
                    placeholder="Enter email addresses separated by commas"
                    value={emails}
                    onChange={handleEmailChange}
                    error={!!error}
                    helperText={error}
                    sx={{ mb: 2 }}
                  />
                  <Button 
                    variant="contained" 
                    size="large"
                    startIcon={<SendIcon />}
                    onClick={sendInvitations}
                  >
                    Send Invitations
                  </Button>
                </Box>
              </Paper>
            </Grid>
            
            {/* Share on social media */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  boxShadow: 3,
                  height: '100%'
                }}
              >
                <Typography variant="h6" component="h3" fontWeight={600} sx={{ mb: 2 }}>
                  Share via social media
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button 
                      fullWidth 
                      variant="outlined" 
                      startIcon={<WhatsAppIcon />}
                      sx={{ mb: 2, justifyContent: 'flex-start' }}
                    >
                      WhatsApp
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      fullWidth 
                      variant="outlined" 
                      startIcon={<FacebookIcon />}
                      sx={{ mb: 2, justifyContent: 'flex-start' }}
                    >
                      Facebook
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      fullWidth 
                      variant="outlined" 
                      startIcon={<TwitterIcon />}
                      sx={{ mb: 2, justifyContent: 'flex-start' }}
                    >
                      Twitter
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      fullWidth 
                      variant="outlined" 
                      startIcon={<EmailIcon />}
                      sx={{ mb: 2, justifyContent: 'flex-start' }}
                    >
                      Email
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            {/* Rewards information */}
            {/* <Grid item xs={12} md={6}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  boxShadow: 3,
                  height: '100%'
                }}
              >
                <Typography variant="h6" component="h3" fontWeight={600} sx={{ mb: 2 }}>
                  Your rewards
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  The more friends you invite, the better rewards you'll get:
                </Typography>
                
                <Box>
                  {rewards.map((item, index) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 2,
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: 'background.default'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: 'primary.main', 
                            width: 36, 
                            height: 36,
                            mr: 2,
                            fontSize: '0.9rem'
                          }}
                        >
                          {item.count}
                        </Avatar>
                        <Typography variant="body1">
                          {item.reward}
                        </Typography>
                      </Box>
                      <Chip 
                        label={`${item.count} invites`} 
                        color="primary" 
                        variant="outlined" 
                        size="small"
                      />
                    </Box>
                  ))}
                </Box>
                
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    You've successfully invited <b>0</b> friends so far
                  </Typography>
                </Box>
              </Paper>
            </Grid> */}
          </Grid>
        </motion.div>
      </Container>
      
      {/* Success notifications */}
      <Snackbar 
        open={inviteSent} 
        autoHideDuration={3000} 
        onClose={() => setInviteSent(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Invitations sent successfully!
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={linkCopied} 
        autoHideDuration={3000} 
        onClose={() => setLinkCopied(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Referral link copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InviteFriendsPage;