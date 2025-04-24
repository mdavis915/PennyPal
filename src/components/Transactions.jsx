import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  MenuItem,
  Menu,
  Snackbar,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { AccountBalanceWallet, AttachMoney } from '@mui/icons-material';
import { NumericFormat } from 'react-number-format';
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";

import { auth } from '../firebase/firebase';
import {
  getBalance,
  setUserBalance,
  createUserBalance,
  addTransaction,
  getGoalsForUser,
  updateGoalProgress
} from '../firebase/db';

import CoinDrop from './CoinDrop';
import '../App.css';

const DepositWithdraw = () => {
  const [transactionType, setTransactionType] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackColor, setFeedbackColor] = useState('error');
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [coinDropTrigger, setCoinDropTrigger] = useState(false);
  const [goalReached, setGoalReached] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  const { width, height } = useWindowSize();

  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const identifier = user.email;

      getBalance(identifier)
        .then(setBalance)
        .catch(async (error) => {
          console.error("Error getting balance:", error.message);
          if (error.message.includes("does not exist")) {
            await createUserBalance(identifier);
            const newBalance = await getBalance(identifier);
            setBalance(newBalance);
          } else {
            setFeedbackMessage("Error fetching balance");
          }
        });

      getGoalsForUser(user.uid)
        .then((fetchedGoals) => {
          setGoals(fetchedGoals);
        })
        .catch((error) => {
          console.error("Error fetching goals:", error.message);
        });
    }
  }, [user]);

  const handleTransaction = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setFeedbackMessage('Please enter a valid amount');
      setFeedbackColor('error');
      setOpenSnackbar(true);
      return;
    }

    if (transactionType === 'withdraw' && parseFloat(amount) > balance) {
      setFeedbackMessage('Insufficient funds');
      setFeedbackColor('error');
      setOpenSnackbar(true);
      return;
    }

    const newBalance = transactionType === 'deposit'
      ? balance + parseFloat(amount)
      : balance - parseFloat(amount);

    await setUserBalance(user.email, newBalance);
    setBalance(newBalance);

    if (selectedGoal) {
      const newGoalBalance = selectedGoal.currentBalance + (transactionType === 'deposit' ? parseFloat(amount) : -parseFloat(amount));
      await updateGoalProgress(user.email, selectedGoal.id, newGoalBalance);

      setGoals(goals.map(goal =>
        goal.id === selectedGoal.id ? { ...goal, currentBalance: newGoalBalance } : goal
      ));

      if (newGoalBalance >= selectedGoal.targetAmount) {
        setGoalReached(true);
        setFeedbackMessage(`🎯 Congratulations! You reached your goal: ${selectedGoal.title}!`);
        setFeedbackColor('success');
        setOpenSnackbar(true);
      
        setTimeout(() => {
          setGoalReached(false);
          setFeedbackMessage("");
        }, 10000);
      
        // Delay regular success message until after goal message
        setTimeout(() => {
          setFeedbackMessage(`Successfully ${transactionType}ed $${amount}`);
          setFeedbackColor('success');
          setOpenSnackbar(true);
        }, 11000);
      } else {
        setFeedbackMessage(`Successfully ${transactionType}ed $${amount}`);
        setFeedbackColor('success');
        setOpenSnackbar(true);
      }
    } else {
      setFeedbackMessage(`Successfully ${transactionType}ed $${amount}`);
      setFeedbackColor('success');
      setOpenSnackbar(true);
    }

    setAmount('');
    if (transactionType === 'deposit') {
      setCoinDropTrigger(true);
      setTimeout(() => setCoinDropTrigger(false), 2000);
    }

    await addTransaction(
      user.email,
      transactionType.charAt(0).toUpperCase() + transactionType.slice(1),
      parseFloat(amount),
      newBalance,
      selectedGoal?.id
    );
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSelectGoal = (goal) => {
    setSelectedGoal(goal);
    handleMenuClose();
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5, mb: 5 }}>
      {/* Confetti Effect */}
      {goalReached && <ReactConfetti width={width} height={height} />}
      
      {/* Header Card - Uses light pink background */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          textAlign: 'center',
          borderRadius: 2,
          backgroundColor: '#fff0f3' // Slightly brighter than #fff0f3
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
          {transactionType === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
        </Typography>
        <Typography variant="h6" sx={{ color: 'black' }}>
          Current Balance: ${balance !== null ? balance : "Loading..."}
        </Typography>
      </Paper>

      {/* Transaction Form Card */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 2,
          backgroundColor: '#ffffff'
        }}
      >
        <Grid container spacing={2} direction="column" alignItems="center">
          {/* Goal Selection */}
          <Grid item>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={handleMenuClick}
              sx={{
                backgroundColor: '#74c69d', // Brighter variant for mint; adjust as desired
                px: 3,
                py: 1.5,
                textTransform: 'none',
                '&:hover': { backgroundColor: '#B4C8B5' }
              }}
            >
              Select Goal
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              {goals.length > 0 ? (
                goals.map((goal) => (
                  <MenuItem key={goal.id} onClick={() => handleSelectGoal(goal)}>
                    {goal.title}
                  </MenuItem>
                ))
              ) : (
                <MenuItem sx={{ color: 'inherit', pointerEvents: 'none' }}>
                  No goals found. Create a goal first!
                </MenuItem>
              )}
            </Menu>
          </Grid>
          {selectedGoal && (
            <Grid item>
              <Typography variant="body1" align="center">
                Selected Goal: {selectedGoal.title} (Target: ${selectedGoal.targetAmount})
              </Typography>
            </Grid>
          )}
          {/* Transaction Amount Input */}
          <Grid item sx={{ width: '100%' }}>
            <NumericFormat
              label="Amount"
              variant="outlined"
              value={amount}
              onValueChange={(values) => setAmount(values.value)}
              thousandSeparator={true}
              prefix="$"
              allowNegative={false}
              customInput={TextField}
              sx={{ width: '100%' }}
            />
          </Grid>
          {/* Transaction Type Selection */}
          <Grid item>
            <RadioGroup row value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
              <FormControlLabel value="deposit" control={<Radio />} label="Deposit" />
              <FormControlLabel value="withdraw" control={<Radio />} label="Withdraw" />
            </RadioGroup>
          </Grid>
          {/* Action Button */}
          <Grid item>
            <Button
              variant="contained"
              onClick={handleTransaction}
              sx={{
                backgroundColor: '#f4acb7', // Brighter pastel pink variant for action button
                px: 3,
                py: 1.5,
                textTransform: 'none',
                '&:hover': { backgroundColor: '#F1A7B4' }
              }}
              startIcon={transactionType === 'deposit' ? <AttachMoney /> : <AccountBalanceWallet />}
            >
              {transactionType === 'deposit' ? 'Deposit' : 'Withdraw'}
            </Button>
          </Grid>
          {/* Feedback Snackbar */}
          {feedbackMessage && (
            <Grid item>
              <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                message={feedbackMessage}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                ContentProps={{
                  style: {
                    backgroundColor: feedbackColor === 'error' ? '#f44336' : '#4caf50',
                    padding: '12px 24px'
                  }
                }}
              />
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Coin Drop Animation */}
      {coinDropTrigger && <CoinDrop trigger={coinDropTrigger} />}
    </Container>
  );
};

export default DepositWithdraw;
