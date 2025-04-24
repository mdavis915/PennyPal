import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createUserBalance } from "./db";

// Sign up a new user and create their balance using email as the ID
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user balance document using email as the ID
    await createUserBalance(email);

    return user;
  } catch (error) {
    console.error("Error signing up:", error.message);
    // Check for weak password error code
    if (error.code === "auth/weak-password") {
      throw new Error("Password should be at least 6 characters long.");
    }
    throw error;
  }
};

// Log in a user
export const logIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error.message);
    // Map Firebase error codes to friendly messages
    if (
      error.code === "auth/wrong-password" ||
      error.code === "auth/user-not-found" ||
      error.code === "auth/invalid-credential"
    ) {
      throw new Error("Incorrect username or password.");
    }
    throw error;
  }
};

// Log out a user
export const logOut = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Error signing out:", error.message);
  }
};
