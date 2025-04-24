import { db } from "./firebase";
import { 
  doc, setDoc, getDoc, updateDoc, collection, addDoc, serverTimestamp, getDocs, where, query, deleteDoc 
} from "firebase/firestore";

/** 
 * Create a user's balance when they sign up (if it doesn't exist)
 */
export const createUserBalance = async (email) => {
  try {
    console.log(`Checking if balance exists for user: ${email}`);
    const userRef = doc(db, "users", email);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      const userData = {
        balance: 0,
        email: email,
      };
      await setDoc(userRef, userData);
      console.log(`Created balance for user with email ${email}`);
    } else {
      console.log(`Balance already exists for user: ${email}`);
    }
  } catch (error) {
    console.error(`Error creating balance for ${email}: ${error.message}`);
  }
};

/** 
 * Fetch user's balance
 */
export const getBalance = async (identifier) => {
  try {
    console.log(`Fetching balance for user: ${identifier}`);
    const userRef = doc(db, "users", identifier);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      console.log(`Balance found for user ${identifier}: $${userDoc.data().balance}`);
      return userDoc.data().balance;
    } else {
      console.log(`No balance found for ${identifier}, user may not exist`);
      throw new Error(`User with identifier ${identifier} does not exist.`);
    }
  } catch (error) {
    console.error(`Error fetching balance for ${identifier}: ${error.message}`);
    throw error;
  }
};

/** 
 * Update user's balance
 */
export const updateBalance = async (userId, newBalance) => {
  try {
    console.log(`Updating balance for user ${userId} to $${newBalance}`);
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { balance: newBalance });
    console.log(`Updated balance for user ${userId} to $${newBalance}`);
  } catch (error) {
    console.error(`Error updating balance for user ${userId}: ${error.message}`);
  }
};

/** 
 * Add a transaction record
 */
export const addTransaction = async (userId, type, amount, balanceAfterTransaction, goalId = null) => {
  try {
    console.log(`Attempting to add transaction for user ${userId}: ${type} of $${amount}`);

    // Reference to the user document
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    // Check if the user document exists
    if (!userDoc.exists()) {
      console.log(`User document with ID ${userId} does not exist`);
      return;
    }

    // Reference to the transactions collection under this user
    const transactionsRef = collection(userRef, "transactions");

    // Prepare the new transaction data
    const newTransaction = {
      type,
      amount,
      date: serverTimestamp(), // Use Firestore server timestamp
      balanceAfterTransaction,
      goalId, // Track if the transaction is related to a goal (optional)
    };

    console.log("New transaction data being added:", newTransaction);

    // Add the transaction to the Firestore collection
    const docRef = await addDoc(transactionsRef, newTransaction);

    console.log(`Transaction added successfully for user ${userId}: ${type} of $${amount}, Document ID: ${docRef.id}`);
  } catch (error) {
    console.error(`Error adding transaction for user ${userId}:`, error);
  }
};

/** 
 * Set user balance (alias for updateBalance)
 */
export const setUserBalance = updateBalance;

/** 
 * Create or update a savings goal for a user
 */
export const setUserGoal = async (userId, title, targetAmount, deadline, description = '') => {
  try {
    console.log(`Creating or updating goal for user ${userId}: ${title}`);
    await addDoc(collection(db, 'goals'), {
      userId,
      title,
      targetAmount,
      currentBalance: 0,
      currentProgress: 0,
      deadline,
      description: description || '',  // Store description as an empty string if not provided
    });
    console.log(`Goal created for user ${userId}: ${title}`);
  } catch (error) {
    console.error(`Error creating or updating goal for user ${userId}: ${error.message}`);
    alert(`Error adding goal: ${error.message}`);
  }
};

/** 
 * Delete a goal for a user
 */
export const deleteGoal = async (goalId) => {
  try {
    console.log(`Deleting goal with ID ${goalId}`);
    const goalDocRef = doc(db, "goals", goalId);
    await deleteDoc(goalDocRef);
    console.log(`Goal with ID ${goalId} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting goal with ID ${goalId}: ${error.message}`);
  }
};

/** 
 * Fetch goals for a specific user
 */
export const getGoalsForUser = async (userId) => {
  try {
    console.log(`Fetching goals for user ${userId}`);
    const goalsRef = collection(db, 'goals');
    const q = query(goalsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const goals = [];
    
    querySnapshot.forEach((doc) => {
      goals.push({ id: doc.id, ...doc.data() });
      console.log(`Goal found for user ${userId}:`, doc.data());
    });

    if (goals.length === 0) {
      console.log(`No goals found for user ${userId}`);
    }

    return goals;
  } catch (error) {
    console.error(`Error fetching goals for user ${userId}: ${error.message}`);
    return [];
  }
};

/** 
 * Update the progress of a goal when money is added
 */
export const updateGoalProgress = async (userEmail, goalId, newBalance) => {
  try {
    console.log(`Updating goal progress for user ${userEmail}, goal ID ${goalId}`);
    const goalRef = doc(db, 'goals', goalId);
    await updateDoc(goalRef, {
      currentBalance: newBalance,
    });

    console.log("Goal progress updated successfully.");
  } catch (error) {
    console.error(`Error updating goal progress for user ${userEmail}, goal ID ${goalId}: ${error.message}`);
  }
};

/** 
 * Function to update a goal's balance
 */
export const updateGoalBalance = async (goalId, newBalance) => {
  try {
    console.log(`Updating goal balance for goal ID ${goalId} to $${newBalance}`);
    const goalRef = doc(db, 'goals', goalId);
    await updateDoc(goalRef, {
      balance: newBalance,
    });
    console.log('Goal balance updated successfully');
  } catch (error) {
    console.error(`Error updating goal balance for goal ID ${goalId}: ${error.message}`);
    throw new Error('Error updating goal balance');
  }
};
