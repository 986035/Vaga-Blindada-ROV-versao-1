import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-page flex items-center justify-center z-50">
      <div className="professional-loader text-center">
        <div className="w-16 h-16 border-4 border-accent-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h3 className="heading-2 mb-2">VAGA BLINDADA ROV</h3>
        <p className="body-medium text-text-secondary">Carregando sua oportunidade...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;