import { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from "../context/AuthProvider";
import { LogOut, User, Settings } from 'lucide-react';

interface AvatarProps {
  avatarUrl?: string;
  username: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Avatar = ({ avatarUrl, username, size = 'md', className = '' }: AvatarProps) => {
  const [imageError, setImageError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const auth = useContext(AuthContext);

  // Automatic close when there's outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getInitials = (name: string): string => {
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

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
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      {/* Avatar Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`rounded-full cursor-pointer border-2 border-white dark:border-slate-800 shadow-md transition-all hover:scale-105 active:scale-95 overflow-hidden ${sizeClasses[size]} ${className}`}
      >
        {avatarUrl && !imageError ? (
          <img
            data-testid="user-avatar"
            src={avatarUrl}
            alt={username}
            className="w-full h-full object-cover bg-gray-200"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${getColorFromName(username)} flex items-center justify-center font-bold text-white select-none`}>
            {getInitials(username)}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 py-2 z-[999] animate-in fade-in zoom-in duration-200">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Account</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{username}</p>
          </div>

          <div className="p-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <User size={16} />
              Profile
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <Settings size={16} />
              Settings
            </button>
          </div>

          <div className="border-t border-gray-100 dark:border-slate-800 mt-1 p-1">
            <button
              onClick={() => {
                setIsOpen(false);
                auth.logout();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors font-semibold"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Avatar;
