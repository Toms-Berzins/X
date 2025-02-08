import { usageTrackingService } from '../services/usageTrackingService';

export const trackUserAction = (userId: string, action: string, path: string, metadata?: Record<string, any>) => {
  usageTrackingService.logUserAction({
    userId,
    action,
    path,
    metadata,
  });
};

// Example usage:
// trackUserAction('user123', 'PAGE_VIEW', '/dashboard', { referrer: document.referrer });
// trackUserAction('user123', 'BUTTON_CLICK', '/dashboard', { buttonId: 'submit-form' }); 