// src/components/Avatar.tsx
import { useState } from 'react';

interface AvatarProps {
  avatarUrl?: string;
  username: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

const Avatar = ({ avatarUrl, username, size = 'md', onClick, className = '' }: AvatarProps) => {
  const [imageError, setImageError] = useState(false);

  // Estrai le iniziali (prime 2 lettere)
  const getInitials = (name: string): string => {
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Genera un colore basato sul nome (sempre lo stesso per lo stesso nome)
  const getColorFromName = (name: string): string => {
    const colors = [
      'from-amber-400 to-orange-500',
      'from-blue-400 to-indigo-500',
      'from-green-400 to-emerald-500',
      'from-purple-400 to-pink-500',
      'from-red-400 to-rose-500',
      'from-teal-400 to-cyan-500',
      'from-yellow-400 to-amber-500',
      'from-fuchsia-400 to-purple-500',
    ];

    // Hash semplice del nome per scegliere sempre lo stesso colore
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
  };

  const baseClasses = `rounded-full ${onClick ? 'cursor-pointer' : ''} border-2 border-white shadow-md transition-transform hover:scale-105 ${sizeClasses[size]} ${className}`;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  // Se c'è un avatar URL valido e non c'è errore, mostra l'immagine
  if (avatarUrl && !imageError) {
    return (
      <img
        src={avatarUrl}
        alt={username}
        className={`${baseClasses} object-cover bg-gray-200`}
        onClick={handleClick}
        onError={() => setImageError(true)}
      />
    );
  }

  // Altrimenti mostra avatar con iniziali
  return (
    <div
      className={`${baseClasses} bg-gradient-to-br ${getColorFromName(username)} flex items-center justify-center font-bold text-white select-none`}
      onClick={handleClick}
    >
      {getInitials(username)}
    </div>
  );
};

export default Avatar;
