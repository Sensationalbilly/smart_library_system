import React, { createContext, useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      setUser(currentUser);
      setError(null);
    } catch (err) {
      setUser(null);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  // Sign up
  const signUp = async (email, password) => {
    setLoading(true);
    try {
      const { user } = await Auth.signUp({ username: email, password });
      console.log('Sign-up success:', user);
      setError(null);
      return user;
    } catch (error) {
      const errorMsg = error.message || 'Sign-up failed';
      console.log('Sign-up error:', error);
      setError(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const user = await Auth.signIn(email, password);
      console.log('Sign-in success:', user);
      setUser(user);
      setError(null);
      return user;
    } catch (error) {
      const errorMsg = error.message || 'Sign-in failed';
      console.log('Sign-in error:', error);
      setError(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    setLoading(true);
    try {
      await Auth.signOut();
      console.log('Sign-out success');
      setUser(null);
      setError(null);
    } catch (error) {
      const errorMsg = error.message || 'Sign-out failed';
      console.log('Sign-out error:', error);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Confirm sign up (email verification)
  const confirmSignUp = async (email, code) => {
    setLoading(true);
    try {
      await Auth.confirmSignUp(email, code);
      console.log('Confirm sign-up success');
      setError(null);
    } catch (error) {
      const errorMsg = error.message || 'Confirmation failed';
      console.log('Confirm sign-up error:', error);
      setError(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      signUp, 
      signIn, 
      login: signIn, // Alias for backward compatibility
      signOut, 
      confirmSignUp 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
