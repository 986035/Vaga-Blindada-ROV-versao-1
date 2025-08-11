import React, { useState } from 'react';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';

const Header = ({ onPurchase }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header-nav">
      <div className="container">
        <div className="nav-content">
          <div className="logo-section">
            <div className="logo-text">VAGA BLINDADA ROV</div>
          </div>
          
          <nav className={`nav-menu ${isMenuOpen ? 'nav-menu-open' : ''}`}>
            <button className="nav-link" onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}>
              Benefícios
            </button>
            <button className="nav-link" onClick={() => document.getElementById('content')?.scrollIntoView({ behavior: 'smooth' })}>
              Conteúdo
            </button>
            <button className="nav-link" onClick={() => document.getElementById('instructor')?.scrollIntoView({ behavior: 'smooth' })}>
              Instrutor
            </button>
            <Button 
              onClick={onPurchase}
              className="btn-primary"
              size="sm"
            >
              Garantir Vaga
            </Button>
          </nav>

          <button 
            className="mobile-menu-toggle btn-nav"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;