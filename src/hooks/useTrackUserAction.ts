import { useCallback, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { trackUserAction } from '../middleware/usageTracking';

export const useTrackUserAction = () => {
  const { currentUser } = useContext(AuthContext);

  const logAction = useCallback(
    (action: string, path: string = window.location.pathname, metadata?: Record<string, any>) => {
      if (currentUser?.uid) {
        trackUserAction(currentUser.uid, action, path, metadata);
      }
    },
    [currentUser]
  );

  return logAction;
};

// Example usage in a component:
/*
const MyComponent = () => {
  const trackAction = useTrackUserAction();

  const handleButtonClick = () => {
    trackAction('BUTTON_CLICK', undefined, { buttonId: 'my-button' });
  };

  return <button onClick={handleButtonClick}>Click Me</button>;
};
*/ 