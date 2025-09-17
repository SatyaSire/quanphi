import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  setCredentials,
  clearCredentials,
  setLoading,
  setError,
  clearError,
} from '../app/slices/sessionSlice';
import { addNotification } from '../app/slices/uiSlice';
import {
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useRefreshTokenMutation,
} from '../api/apiService';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  fullName: string;
  email: string;
  phone: string;
  organizationName: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const { user, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.session
  );
  
  const [loginMutation] = useLoginMutation();
  const [signupMutation] = useSignupMutation();
  const [logoutMutation] = useLogoutMutation();
  const [forgotPasswordMutation] = useForgotPasswordMutation();
  const [resetPasswordMutation] = useResetPasswordMutation();
  const [refreshTokenMutation] = useRefreshTokenMutation();
  
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());
      
      const result = await loginMutation(credentials).unwrap();
      
      dispatch(setCredentials({
        accessToken: result.accessToken,
        user: result.user,
      }));
      
      dispatch(addNotification({
        type: 'success',
        title: 'Welcome back!',
        message: `Hello ${result.user.fullName}`,
      }));
      
      navigate('/dashboard');
      
    } catch (error: any) {
      const errorMessage = error.data?.message || 'Login failed. Please try again.';
      dispatch(setError(errorMessage));
      
      dispatch(addNotification({
        type: 'error',
        title: 'Login Failed',
        message: errorMessage,
      }));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, navigate, loginMutation]);
  
  const signup = useCallback(async (signupData: SignupData) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());
      
      const result = await signupMutation(signupData).unwrap();
      
      dispatch(setCredentials({
        accessToken: result.accessToken,
        user: result.user,
      }));
      
      dispatch(addNotification({
        type: 'success',
        title: 'Account Created!',
        message: 'Welcome to ContractorPro',
      }));
      
      navigate('/dashboard');
      
    } catch (error: any) {
      const errorMessage = error.data?.message || 'Signup failed. Please try again.';
      dispatch(setError(errorMessage));
      
      dispatch(addNotification({
        type: 'error',
        title: 'Signup Failed',
        message: errorMessage,
      }));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, navigate, signupMutation]);
  
  const logout = useCallback(async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      // Even if logout fails on server, clear local state
      console.error('Logout error:', error);
    } finally {
      dispatch(clearCredentials());
      dispatch(addNotification({
        type: 'info',
        title: 'Logged Out',
        message: 'You have been successfully logged out.',
      }));
      navigate('/login');
    }
  }, [dispatch, navigate, logoutMutation]);
  
  const forgotPassword = useCallback(async (data: ForgotPasswordData) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());
      
      await forgotPasswordMutation(data).unwrap();
      
      dispatch(addNotification({
        type: 'success',
        title: 'Reset Email Sent',
        message: 'Check your email for password reset instructions.',
      }));
      
    } catch (error: any) {
      const errorMessage = error.data?.message || 'Failed to send reset email.';
      dispatch(setError(errorMessage));
      
      dispatch(addNotification({
        type: 'error',
        title: 'Reset Failed',
        message: errorMessage,
      }));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, forgotPasswordMutation]);
  
  const resetPassword = useCallback(async (data: ResetPasswordData) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());
      
      await resetPasswordMutation(data).unwrap();
      
      dispatch(addNotification({
        type: 'success',
        title: 'Password Reset',
        message: 'Your password has been successfully reset.',
      }));
      
      navigate('/login');
      
    } catch (error: any) {
      const errorMessage = error.data?.message || 'Failed to reset password.';
      dispatch(setError(errorMessage));
      
      dispatch(addNotification({
        type: 'error',
        title: 'Reset Failed',
        message: errorMessage,
      }));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, navigate, resetPasswordMutation]);
  
  const refreshToken = useCallback(async () => {
    try {
      const result = await refreshTokenMutation().unwrap();
      
      dispatch(setCredentials({
        accessToken: result.accessToken,
        user: result.user,
      }));
      
      return true;
    } catch (error) {
      dispatch(clearCredentials());
      return false;
    }
  }, [dispatch, refreshTokenMutation]);
  
  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);
  
  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword,
    refreshToken,
    clearAuthError,
  };
};