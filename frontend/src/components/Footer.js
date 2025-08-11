import React from 'react';
import { Button } from './ui/button';
import { Mail, Phone, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-text">VAGA BLINDADA ROV</div>
            </div>
            <p className="body-medium">
              O curso mais completo para conquistar sua vaga de trainee ROV no mercado offshore.
            </p>
            <div className="footer-contact">
              <div className="contact-item">
                <Mail size={16} />
                <span className="body-small">contato@vagablindadarov.com</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span className="body-small">(11) 99999-9999</span>
              </div>
              <div className="contact-item">
                <Clock size={16} />
                <span className="body-small">Atendimento: 9h às 18h</span>
              </div>
            </div>
          </div>
          
          <div className="footer-links">
            <div>
              <h4 className="footer-title heading-3">Links Rápidos</h4>
              <ul className="footer-list">
                <li><a href="#benefits" className="footer-link">Benefícios</a></li>
                <li><a href="#content" className="footer-link">Conteúdo</a></li>
                <li><a href="#instructor" className="footer-link">Instrutor</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom-content">
          <div className="footer-legal">
            <span className="caption">© 2024 VAGA BLINDADA ROV. Todos os direitos reservados.</span>
          </div>
          <div className="footer-legal">
            <a href="#" className="footer-link caption">Política de Privacidade</a>
            <a href="#" className="footer-link caption">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;