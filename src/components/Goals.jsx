import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  TextField,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Paper,
  Divider
} from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled } from '@mui/material/styles';
import { getAuth } from 'firebase/auth';
import { setUserGoal, getGoalsForUser } from '../firebase/db';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const ExpandMoreButton = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [newGoal, setNewGoal] = useState({ title: '', targetAmount: '', description: '' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedGoal, setEditedGoal] = useState({ title: '', targetAmount: '', description: '' });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchGoals(user.uid);
      } else {
        setGoals([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchGoals = (userId) => {
    getGoalsForUser(userId)
      .then((fetchedGoals) => {
        setGoals(fetchedGoals.map(goal => ({
          ...goal,
          currentBalance: goal.currentBalance || 0,
        })));
      })
      .catch((error) => {
        console.error('Error fetching goals:', error);
      });
  };

  const handleAddGoal = () => {
    if (newGoal.title && newGoal.targetAmount) {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userId = currentUser.uid;
        const deadline = new Date().toISOString();
        setUserGoal(userId, newGoal.title, parseFloat(newGoal.targetAmount), deadline, newGoal.description)
          .then(() => {
            fetchGoals(userId);
            setNewGoal({ title: '', targetAmount: '', description: '' });
            setFeedbackMessage('Goal added successfully');
            setOpenSnackbar(true);
          }).catch((error) => {
            console.error('Error saving goal:', error);
          });
      }
    } else {
      alert('Please fill in both the title and target amount for your goal.');
    }
  };

  const handleExpandClick = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleMenuClick = (event, goalId) => {
    setAnchorEl(event.currentTarget);
    setSelectedGoal(goalId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteGoal = () => {
    const goalDocRef = doc(db, 'goals', selectedGoal);
    deleteDoc(goalDocRef)
      .then(() => {
        setGoals(goals.filter((goal) => goal.id !== selectedGoal));
        handleMenuClose();
        setFeedbackMessage('Goal deleted successfully');
        setOpenSnackbar(true);
      })
      .catch((error) => {
        console.error("Error deleting goal:", error);
      });
  };

  const handleEditGoal = () => {
    const goalToEdit = goals.find(goal => goal.id === selectedGoal);
    if (goalToEdit) {
      setEditedGoal({
        title: goalToEdit.title,
        targetAmount: goalToEdit.targetAmount,
        description: goalToEdit.description || '',
      });
      setOpenEditDialog(true);
      handleMenuClose();
    } else {
      console.error('Goal not found');
    }
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
  };

  const handleSaveEditedGoal = async () => {
    if (!selectedGoal) {
      console.error('No goal selected to edit.');
      return;
    }
    const goalToEdit = goals.find(goal => goal.id === selectedGoal);
    if (goalToEdit) {
      const updatedGoal = { ...goalToEdit, ...editedGoal };
      await updateDoc(doc(db, 'goals', selectedGoal), updatedGoal);
      setGoals(goals.map(goal => (goal.id === selectedGoal ? updatedGoal : goal)));
      setFeedbackMessage('Goal updated successfully');
      setOpenSnackbar(true);
      handleEditDialogClose();
    } else {
      console.error('Goal to edit not found');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      {/* Header Title with Light Pink Background */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          textAlign: 'center',
          borderRadius: 2,
          backgroundColor: '#fff0f3'
        }}
      >
        <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', color: 'black' }}>
          Your Goals
        </Typography>
      </Paper>

      {/* Add New Goal Form */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2, backgroundColor: '#ffffff' }}>
        <Typography variant="h6" align="center" gutterBottom>
          Add a New Goal
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Goal Title"
              variant="outlined"
              fullWidth
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Target Amount"
              variant="outlined"
              fullWidth
              value={newGoal.targetAmount}
              onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleAddGoal}
              sx={{
                backgroundColor: '#f4acb7',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#F1A7B4' }
              }}
            >
              Save Goal
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Goal Cards */}
      <Grid container spacing={3}>
        {goals.map((goal) => {
          const currentProgress = (goal.currentBalance / goal.targetAmount) * 100;
          return (
            <Grid item xs={12} sm={6} md={4} key={goal.id}>
              <Card sx={{ maxWidth: 345, m: 'auto' }}>
                <CardHeader
                  // Removed the avatar property to eliminate the left-hand icon
                  title={<Typography variant="h6" noWrap>{goal.title}</Typography>}
                  subheader={`Target: $${goal.targetAmount}`}
                  action={
                    <IconButton onClick={(e) => handleMenuClick(e, goal.id)}>
                      <MoreVertIcon />
                    </IconButton>
                  }
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Current Balance:</strong> ${goal.currentBalance}
                  </Typography>
                  <LinearProgress variant="determinate" value={currentProgress} sx={{ mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    {Math.round(currentProgress)}% of goal achieved
                  </Typography>
                  {goal.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {goal.description}
                    </Typography>
                  )}
                </CardContent>
                <CardActions disableSpacing>
                  <ExpandMoreButton
                    expand={expanded === goal.id}
                    onClick={() => handleExpandClick(goal.id)}
                    aria-expanded={expanded === goal.id}
                    aria-label="show more"
                  >
                    <ExpandMore />
                  </ExpandMoreButton>
                </CardActions>
                <Collapse in={expanded === goal.id} timeout="auto" unmountOnExit>
                  <CardContent>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="h6" color="text.primary">
                      {goal.title} Details
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      More details about your goal...
                    </Typography>
                  </CardContent>
                </Collapse>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Menu for Edit/Delete */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        aria-hidden={!Boolean(anchorEl)}
      >
        <MenuItem onClick={() => handleEditGoal(goals.find(goal => goal.id === selectedGoal))}>
          Edit Goal
        </MenuItem>
        <MenuItem onClick={handleDeleteGoal}>
          Delete Goal
        </MenuItem>
      </Menu>

      {/* Edit Goal Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleEditDialogClose}
        aria-hidden={!openEditDialog}
      >
        <DialogTitle>Edit Goal</DialogTitle>
        <DialogContent>
          <TextField
            label="Goal Title"
            fullWidth
            value={editedGoal.title}
            onChange={(e) => setEditedGoal({ ...editedGoal, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Target Amount"
            fullWidth
            value={editedGoal.targetAmount}
            onChange={(e) => setEditedGoal({ ...editedGoal, targetAmount: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            fullWidth
            value={editedGoal.description}
            onChange={(e) => setEditedGoal({ ...editedGoal, description: e.target.value })}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleSaveEditedGoal}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={feedbackMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        ContentProps={{
          style: {
            backgroundColor: feedbackMessage.includes("error") ? '#f44336' : '#4caf50',
            padding: '12px 24px'
          }
        }}
      />
    </Container>
  );
};

export default Goals;
