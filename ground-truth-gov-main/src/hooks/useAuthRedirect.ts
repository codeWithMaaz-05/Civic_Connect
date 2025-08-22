import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useAuthRedirect = (action?: string) => {
  const { user, loading } = useAuth();

  const requireAuth = (intendedAction?: string) => {
    if (!loading && !user) {
      // Store the intended action in sessionStorage
      if (intendedAction) {
        sessionStorage.setItem('intendedAction', intendedAction);
      }
      // Redirect to auth page
      window.location.href = '/auth';
      return false;
    }
    
    // If user is logged in, execute the action immediately
    if (user && !loading && intendedAction) {
      executeAction(intendedAction);
    }
    
    return true;
  };

  const executeAction = (action: string) => {
    switch (action) {
      case 'report-issue':
        document.getElementById('report')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'view-issues':
        document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'track-issues':
        document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'dashboard':
        document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        break;
    }
  };

  const handleIntendedAction = () => {
    if (user && !loading) {
      const intendedAction = sessionStorage.getItem('intendedAction');
      if (intendedAction) {
        sessionStorage.removeItem('intendedAction');
        
        // Handle different intended actions using the same function
        executeAction(intendedAction);
      }
    }
  };

  useEffect(() => {
    handleIntendedAction();
  }, [user, loading]);

  return { requireAuth, isAuthenticated: !!user, loading };
};