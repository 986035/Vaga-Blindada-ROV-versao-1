import React from 'react';

// Simple toaster component - placeholder for now
export const Toaster = () => {
  return <div id="toast-container" className="fixed top-4 right-4 z-50" />;
};

export const toast = (message, type = 'info') => {
  console.log(`Toast (${type}): ${message}`);
  // In a real implementation, this would create and show toast notifications
};