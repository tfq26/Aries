import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { signInWithGoogle } from '../../Api/api';

const SocialLogin = ({ onError = () => {} }) => {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      if (result && !result.success) {
        onError(result.error || 'Failed to sign in with Google');
      }
    } catch (error) {
      onError(error.message || 'An error occurred during Google sign in');
    }
  };

  const socialButtons = [
    {
      id: 'google',
      icon: <FcGoogle className="w-5 h-5" />,
      text: 'Continue with Google',
      onClick: handleGoogleLogin,
      className: 'border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:bg-rich-black-600 dark:hover:bg-rich-black-500',
    }
  ];

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-rich-black-900 text-gray-500 dark:text-gray-400">
            Or continue with
          </span>
        </div>
      </div>
      
      {socialButtons.map((button) => (
        <button
          key={button.id}
          type="button"
          onClick={button.onClick}
          className={`w-full inline-flex justify-center items-center py-2.5 px-4 border rounded-lg shadow-sm text-sm font-medium transition-all duration-200 ${button.className}`}
        >
          <span className="flex-shrink-0">{button.icon}</span>
          <span className="ml-3">{button.text}</span>
        </button>
      ))}
    </div>
  );
};

export default SocialLogin;
