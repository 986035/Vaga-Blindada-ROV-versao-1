import React from 'react';

export const Badge = React.forwardRef(({ 
  className, 
  variant = 'default',
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "bonus-badge",
    destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground border border-input bg-background hover:bg-accent hover:text-accent-foreground"
  };

  const variantClasses = variants[variant] || variants.default;

  return (
    <div
      className={`${baseClasses} ${variantClasses} ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Badge.displayName = "Badge";