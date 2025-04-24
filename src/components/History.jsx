import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Paper,
  Snackbar,
  Grid
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Edit, Delete } from '@mui/icons-material';
import { auth } from '../firebase/firebase';
import { db } from '../firebase/firebase';
import { collection, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { NumericFormat } from 'react-number-format';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);
  const [netBalance, setNetBalance] = useState(0);
  const [filterType, setFilterType] = useState('All');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const user = auth.currentUser;
  const userEmail = user?.email;

  const fetchTransactions = async () => {
    if (!userEmail) return;
    try {
      const transactionsRef = collection(db, 'users', userEmail, 'transactions');
      const querySnapshot = await getDocs(transactionsRef);
      let deposits = 0, withdrawals = 0;
      const txs = [];
      querySnapshot.forEach(docSnap => {
        const data = docSnap.data();
        const amount = data.amount;
        txs.push({
          id: docSnap.id,
          type: data.type,
          amount,
          date: data.date.toDate().toLocaleString(),
        });
        if (data.type === 'Deposit') deposits += amount;
        else if (data.type === 'Withdraw') withdrawals += amount;
      });
      setTransactions(txs);
      setTotalDeposits(deposits);
      setTotalWithdrawals(withdrawals);
      setNetBalance(deposits - withdrawals);
      setFilteredTransactions(txs);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [userEmail]);

  useEffect(() => {
    setFilteredTransactions(
      filterType === 'All' ? transactions : transactions.filter(tx => tx.type === filterType)
    );
  }, [filterType, transactions]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', userEmail, 'transactions', id));
      fetchTransactions();
      setFeedbackMessage('Transaction deleted successfully');
      setOpenSnackbar(true);
    } catch (err) {
      console.error("Failed to delete transaction", err);
    }
  };

  const handleEditClick = (tx) => {
    setEditTransaction(tx);
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    try {
      const txRef = doc(db, 'users', userEmail, 'transactions', editTransaction.id);
      await updateDoc(txRef, {
        amount: parseFloat(editTransaction.amount),
        type: editTransaction.type,
      });
      setEditDialogOpen(false);
      fetchTransactions();
      setFeedbackMessage('Transaction updated successfully');
      setOpenSnackbar(true);
    } catch (err) {
      console.error("Failed to update transaction", err);
    }
  };

  const columns = [
    { field: 'date', headerName: 'Date', width: 180 },
    {
      field: 'type',
      headerName: 'Transaction Type',
      width: 160,
      renderHeader: () => (
        <FormControl size="small" sx={{ width: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            label="Type"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Deposit">Deposit</MenuItem>
            <MenuItem value="Withdraw">Withdraw</MenuItem>
          </Select>
        </FormControl>
      )
    },
    { field: 'amount', headerName: 'Amount ($)', width: 140 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditClick(params.row)}>
            <Edit color="primary" />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <Delete color="error" />
          </IconButton>
        </>
      ),
    }
  ];

  return (
    <>
      {/* Full-Width Header Section */}
      <Box
        sx={{
          width: '100%',
          backgroundColor: '#ffe5ec',
          pt: 20, // Adjust top padding if needed
          pb: 6,
          textAlign: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'black' }}>
          Transaction History
        </Typography>
        <Typography variant="h6" sx={{ color: 'black', mt: 1 }}>
          Overview of your deposits and withdrawals
        </Typography>
      </Box>

      {/* Main Content Container */}
      <Container maxWidth="lg" sx={{ mt: 5, mb: 5, pt: 2 }}>
        {/* Totals Display */}
        <Paper elevation={3} sx={{ p: 2, mb: 4, textAlign: 'center' }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Typography variant="h6">
                Total Deposits: ${totalDeposits}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6">
                Total Withdrawals: ${totalWithdrawals}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6">
                Net Balance: ${netBalance}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

         {/* DataGrid Table */}
         <Box sx={{ height: 450, width: '100%', mb: 5 }}>
          <DataGrid
            rows={filteredTransactions}
            columns={columns}
            pageSize={5}
            components={{ Toolbar: GridToolbar }}
            getRowClassName={(params) =>
              params.row.type === 'Deposit'
                ? 'deposit'
                : params.row.type === 'Withdraw'
                ? 'withdrawal'
                : ''
            }
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#B0C4B1',
                color: '#4A5759',
                fontWeight: 'bold',
              }
              // Remove explicit row hover styling so our CSS classes take effect.
            }}
          />
        </Box>
      </Container>

      {/* Edit Transaction Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Transaction</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Amount"
            type="number"
            margin="normal"
            value={editTransaction?.amount || ''}
            onChange={(e) =>
              setEditTransaction({ ...editTransaction, amount: e.target.value })
            }
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select
              value={editTransaction?.type || ''}
              onChange={(e) =>
                setEditTransaction({ ...editTransaction, type: e.target.value })
              }
              label="Type"
            >
              <MenuItem value="Deposit">Deposit</MenuItem>
              <MenuItem value="Withdraw">Withdraw</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Feedback */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={feedbackMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        ContentProps={{
          style: {
            backgroundColor: feedbackMessage.includes("error") ? '#f44336' : '#4caf50',
            padding: '12px 24px',
          },
        }}
      />

      {/* CSS: Hover styles for rows */}
      <style>
        {`
          .deposit:hover { background-color: #e8f5e9 !important; }
          .withdrawal:hover { background-color: #ffebee !important; }
        `}
      </style>
    </>
  );
};

export default History;

