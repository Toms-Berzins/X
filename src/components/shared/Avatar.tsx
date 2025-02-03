import React, { useState } from 'react';
import classNames from 'classnames';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type AvatarStatus = 'online' | 'offline' | 'away' | 'busy';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  className?: string;
  onClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  status,
  className,
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);

  const sizes = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-14 w-14 text-xl',
  };

  const statusColors = {
    online: 'bg-success-500',
    offline: 'bg-gray-400',
    away: 'bg-warning-500',
    busy: 'bg-error-500',
  };

  const getInitials = (name?: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const statusSize = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-3.5 w-3.5',
  };

  const showInitials = !src || imageError;
  const initials = getInitials(name);
  const hasStatus = status !== undefined;

  return (
    <div className="relative inline-block">
      <div
        className={classNames(
          'relative flex items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-secondary-700',
          sizes[size],
          onClick && 'cursor-pointer hover:opacity-80',
          className
        )}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
      >
        {!showInitials ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-medium text-gray-600 dark:text-gray-200">
            {initials}
          </span>
        )}
      </div>
      {hasStatus && (
        <span
          className={classNames(
            'absolute right-0 top-0 block rounded-full ring-2 ring-white dark:ring-secondary-800',
            statusColors[status],
            statusSize[size]
          )}
        />
      )}
    </div>
  );
}; 
