import React, { useEffect } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { useAnalytics } from '../hooks/useApi';

const SuccessPage = () => {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent('page_view', 'success_page');
  }, [trackEvent]);

  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="voice-card accent-green p-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="heading-1 mb-4">🎉 Parabéns!</h1>
          <h2 className="heading-2 mb-6">Sua vaga foi garantida com sucesso!</h2>
          
          <div className="body-large mb-8 space-y-4">
            <p>
              Você agora faz parte do programa <strong>VAGA BLINDADA ROV</strong>!
            </p>
            <p>
              Em breve você receberá um email com todas as informações para acessar o curso
              e começar sua jornada rumo ao mercado offshore.
            </p>
          </div>

          <div className="bg-accent-blue-200 rounded-lg p-6 mb-8">
            <h3 className="heading-3 mb-4">📚 Próximos Passos:</h3>
            <div className="text-left space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-accent-blue-400" />
                <span className="body-medium">Verifique seu email (inbox e spam)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-accent-blue-400" />
                <span className="body-medium">Acesse a plataforma do curso</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-accent-blue-400" />
                <span className="body-medium">Entre no grupo exclusivo no Telegram</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-accent-blue-400" />
                <span className="body-medium">Comece sua jornada ROV!</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={() => window.location.href = '/'}
            className="btn-primary"
            size="lg"
          >
            Voltar ao Início
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;