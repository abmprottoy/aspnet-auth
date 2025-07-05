import React from 'react';
import { Navigate } from 'react-router-dom';
import { Spinner, makeStyles, shorthands } from '@fluentui/react-components';
import { useAuth } from '../contexts/AuthContext';

const useStyles = makeStyles({
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    ...shorthands.padding('20px')
  }
});

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const classes = useStyles();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className={classes.loadingContainer}>
        <Spinner size="large" label="Checking authentication..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}; 