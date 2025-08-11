import React, { useEffect } from 'react';
import { XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { useAnalytics } from '../hooks/useApi';

const CancelPage = () => {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent('page_view', 'cancel_page');
  }, [trackEvent]);

  const handleRetry = () => {
    trackEvent('cta_click', 'cancel_page', { action: 'retry' });
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="voice-card accent-pink p-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          
          <h1 className="heading-1 mb-4">😔 Ops!</h1>
          <h2 className="heading-2 mb-6">Sua compra foi cancelada</h2>
          
          <div className="body-large mb-8 space-y-4">
            <p>
              Tudo bem, entendemos que às vezes precisamos pensar um pouco mais.
            </p>
            <p>
              Mas lembre-se: <strong>as vagas são limitadas</strong> e o desconto especial 
              pode não estar disponível por muito tempo.
            </p>
          </div>

          <div className="bg-accent-orange-200 rounded-lg p-6 mb-8">
            <h3 className="heading-3 mb-4">💡 Por que não perder essa oportunidade?</h3>
            <div className="text-left space-y-2">
              <div className="flex items-center gap-2">
                <span>⏰</span>
                <span className="body-medium">Desconto especial por tempo limitado</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🎯</span>
                <span className="body-medium">Vagas limitadas no grupo VIP</span>
              </div>
              <div className="flex items-center gap-2">
                <span>💼</span>
                <span className="body-medium">Mercado offshore aquecido</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📈</span>
                <span className="body-medium">Investimento com retorno garantido</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleRetry}
              className="btn-primary"
              size="lg"
            >
              <RotateCcw size={16} className="mr-2" />
              Tentar Novamente
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
              size="lg"
            >
              Voltar ao Início
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelPage;