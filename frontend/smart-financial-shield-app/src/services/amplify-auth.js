import { Auth } from 'aws-amplify';

/**
 * AWS Amplify Authentication Service
 * Direct implementation of the auth functions you provided
 */

// Sign up
export const signUp = async (email, password) => {
  try {
    const { user } = await Auth.signUp({ username: email, password });
    console.log('Sign-up success:', user);
    return user;
  } catch (error) {
    console.log('Sign-up error:', error);
    throw error;
  }
};

// Sign in
export const signIn = async (email, password) => {
  try {
    const user = await Auth.signIn(email, password);
    console.log('Sign-in success:', user);
    return user;
  } catch (error) {
    console.log('Sign-in error:', error);
    throw error;
  }
};

// Sign out
export const signOut = async () => {
  try {
    await Auth.signOut();
    console.log('Sign-out success');
  } catch (error) {
    console.log('Sign-out error:', error);
    throw error;
  }
};

// Confirm sign up (email verification)
export const confirmSignUp = async (email, code) => {
  try {
    await Auth.confirmSignUp(email, code);
    console.log('Confirm sign-up success');
  } catch (error) {
    console.log('Confirm sign-up error:', error);
    throw error;
  }
};

// Get current authenticated user
export const getCurrentUser = async () => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    return user;
  } catch (error) {
    console.log('Get current user error:', error);
    return null;
  }
};

// Resend confirmation code
export const resendConfirmationCode = async (email) => {
  try {
    await Auth.resendSignUp(email);
    console.log('Confirmation code resent');
  } catch (error) {
    console.log('Resend confirmation error:', error);
    throw error;
  }
};

export default {
  signUp,
  signIn,
  signOut,
  confirmSignUp,
  getCurrentUser,
  resendConfirmationCode,
};