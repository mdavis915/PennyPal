import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Typography,
  Container,
  Grid,
  Box,
  Card,
  CardContent,
  CardActions,
  Divider
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  AttachMoney as AttachMoneyIcon,
  History as HistoryIcon,
  TrendingUp as TrendingUpIcon,
  BarChart as BarChartIcon,
  Category as CategoryIcon,
  NotificationsActive as NotificationsActiveIcon,
  AccessAlarm as AccessAlarmIcon,
  TrackChanges as TrackChangesIcon
} from '@mui/icons-material';

import '../App.css';

function Home() {
  return (
    <div className="home-container">
      {/* Hero Section with light pink background */}
      <Box
        sx={{
          minHeight: '100vh', // fills entire viewport height
          pt: 20,
          pb: 10,
          backgroundColor: '#fff0f3',
          width: '100%'
        }}
      >
        <Container maxWidth="md" disableGutters sx={{ p: 0 }}>
          <Grid container spacing={5} direction="column" alignItems="center" textAlign="center">
            <Grid item>
              <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
                Welcome to PennyPal
              </Typography>
              <Typography variant="h6" color="textSecondary" align="center" sx={{ mb: 3 }}>
                Your savings journey starts here. Build smarter habits with every deposit.
              </Typography>
            </Grid>
            <Grid item>
              <Link to="/deposit-withdraw" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: '#74c69d',
                    px: 5,
                    py: 1.5,
                    fontWeight: 600,
                    '&:hover': { backgroundColor: '#388E3C' },
                  }}
                  endIcon={<ArrowForwardIcon />}
                >
                  Get Started
                </Button>
              </Link>
            </Grid>
            <Grid item>
              <img 
                src="/penny.png" 
                alt="Piggy Bank" 
                className="piggy-bank-graphic" 
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How PennyPal Works Section */}
      <Box sx={{ backgroundColor: '#ffffff', py: 10, width: '100%' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight="bold" align="center" sx={{ mb: 3 }}>
            How PennyPal Works
          </Typography>
          <Typography variant="body1" color="textSecondary" align="center" sx={{ mb: 6 }}>
            Follow these simple steps to take control of your finances.
          </Typography>

          <Grid container spacing={4}>
            {/* Step 1: Manage Funds */}
            <Grid item xs={12} md={4}>
              <Box textAlign="center" px={2}>
                <AttachMoneyIcon sx={{ fontSize: 48, color: '#4CAF50' }} />
                <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                  Streamline Fund Management
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Easily manage your funds—deposit, withdraw, and monitor your balance using a simple, intuitive dashboard.
                </Typography>
              </Box>
            </Grid>

            {/* Step 2: Track Transactions */}
            <Grid item xs={12} md={4}>
              <Box textAlign="center" px={2}>
                <HistoryIcon sx={{ fontSize: 48, color: '#4CAF50' }} />
                <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                  Track Transactions
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Access a detailed ledger of all your financial activities, giving you complete insight into your transactions.
                </Typography>
              </Box>
            </Grid>

            {/* Step 3: Achieve Savings Goals */}
            <Grid item xs={12} md={4}>
              <Box textAlign="center" px={2}>
                <TrendingUpIcon sx={{ fontSize: 48, color: '#4CAF50' }} />
                <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                  Achieve Savings Goals
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Set personalized targets and monitor your progress—making it easier than ever to reach your savings milestones.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Divider between Unified Cards and How PennyPal Works */}
      <Box sx={{ width: '100%', textAlign: 'center', my: 5 }}>
        <Divider sx={{ mx: 'auto', width: '80%', borderColor: '#ccc' }} />
      </Box>

      {/* Unified Cards Section for Features */}
      <Box sx={{ py: 10, backgroundColor: '#ffffff', width: '100%' }}>
        <Container maxWidth="lg" disableGutters sx={{ p: 0 }}>
          <Typography variant="h4" fontWeight="bold" align="center" gutterBottom sx={{ mb: 5 }}>
            Explore Our Features
          </Typography>
          <Grid container spacing={6} alignItems="stretch" justifyContent="center">
            {/* Card: Manage Funds */}
            <Grid item xs={12} md={4}>
              <Card
                elevation={3}
                sx={{
                  borderRadius: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
                    Manage Funds
                  </Typography>
                  <Typography variant="body2" align="center" color="textSecondary">
                    Effortlessly deposit, withdraw, and monitor your finances at a glance.
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', mt: 'auto', pb: 2 }}>
                  <Link to="/deposit-withdraw" style={{ textDecoration: 'none' }}>
                    <Button 
                      variant="contained" 
                      endIcon={<ArrowForwardIcon />} 
                      sx={{
                        backgroundColor: '#74c69d',
                        textTransform: 'none',
                        '&:hover': { backgroundColor: '#B4C8B5' }
                      }}
                    >
                      Go to Manage
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            </Grid>
            {/* Card: Transaction History */}
            <Grid item xs={12} md={4}>
              <Card
                elevation={3}
                sx={{
                  borderRadius: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
                    Transaction History
                  </Typography>
                  <Typography variant="body2" align="center" color="textSecondary">
                    View all your transactions in one comprehensive, transparent space.
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', mt: 'auto', pb: 2 }}>
                  <Link to="/history" style={{ textDecoration: 'none' }}>
                    <Button 
                      variant="contained" 
                      endIcon={<ArrowForwardIcon />} 
                      sx={{
                        backgroundColor: '#74c69d',
                        textTransform: 'none',
                        '&:hover': { backgroundColor: '#B4C8B5' }
                      }}
                    >
                      View History
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            </Grid>
            {/* Card: Savings Goals */}
            <Grid item xs={12} md={4}>
              <Card
                elevation={3}
                sx={{
                  borderRadius: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
                    Savings Goals
                  </Typography>
                  <Typography variant="body2" align="center" color="textSecondary">
                    Set, track, and achieve your savings milestones with ease.
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', mt: 'auto', pb: 2 }}>
                  <Link to="/goals" style={{ textDecoration: 'none' }}>
                    <Button 
                      variant="contained" 
                      endIcon={<ArrowForwardIcon />} 
                      sx={{
                        backgroundColor: '#74c69d',
                        textTransform: 'none',
                        '&:hover': { backgroundColor: '#B4C8B5' }
                      }}
                    >
                      Track Goals
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  );
}

export default Home;
