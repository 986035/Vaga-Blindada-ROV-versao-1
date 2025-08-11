import React from 'react';

export const Button = React.forwardRef(({ 
  className, 
  variant = 'default', 
  size = 'default', 
  disabled,
  children,
  onClick,
  type = 'button',
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-content cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    default: 'btn-primary',
    outline: 'btn-secondary',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-900',
    secondary: 'btn-secondary'
  };

  const sizes = {
    default: '',
    sm: 'text-sm px-3 py-1.5',
    lg: 'text-lg px-6 py-3',
    xl: 'text-xl px-8 py-4'
  };

  const variantClasses = variants[variant] || variants.default;
  const sizeClasses = sizes[size] || sizes.default;

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      ref={ref}
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";