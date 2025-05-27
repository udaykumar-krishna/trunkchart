import React from 'react';

interface AvatarProps {
  src: string | undefined;
  alt: string;
  size?: 'small' | 'medium' | 'large';
  status?: 'online' | 'away' | 'offline';
}

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  size = 'medium',
  status
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12'
  };

  return (
    <div className="relative inline-block">
      <img
        src={src || `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=random`}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
      
      {status && (
        <span 
          className={`absolute bottom-0 right-0 block rounded-full ${
            status === 'online' ? 'bg-green-500' : 
            status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
          } ${size === 'small' ? 'w-2 h-2' : 'w-3 h-3'} ring-2 ring-white`}
        ></span>
      )}
    </div>
  );
};

export default Avatar;