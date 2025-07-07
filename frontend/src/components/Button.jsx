import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  loading = false,
  isLoading = false, // Accept isLoading as an alias for loading
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  // Use either loading or isLoading
  const isButtonLoading = loading || isLoading;
  const buttonClass = `btn btn-${variant} btn-${size} ${isButtonLoading ? 'btn-loading' : ''} ${className}`;

  return (
    <button 
      type={type}
      className={buttonClass}
      disabled={disabled || isButtonLoading}
      onClick={onClick}
      {...props}
    >
      {isButtonLoading ? (
        <span className="spinner"></span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
