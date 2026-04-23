import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle, Play, Users, BookOpen, Award, Clock, Download, Target, Star, ArrowRight, PlayCircle, FileText, MessageCircle, Calendar, Map, UserCheck, Shield, Trophy, Gift, ChevronDown, ChevronUp, Compass, Lock } from "lucide-react";
import { useCourseInfo, useCheckout, useAnalytics } from "../hooks/useApi";
import Header from "./Header";
import Footer from "./Footer";
import LoadingSpinner from "./LoadingSpinner";

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [expandedModules, setExpandedModules] = useState({});
  const [playingTestimonial, setPlayingTestimonial] = useState(null);
  const { courseData, isLoading, error } = useCourseInfo();
  
  // Kiwify checkout URL
  const kiwifyCheckoutUrl = "https://pay.kiwify.com.br/pkz4J3e";

  // Module icon mapping
  const moduleIcons = {
    "map": Map,
    "user-check": UserCheck,
    "shield": Shield,
    "trophy": Trophy,
    "gift": Gift
  };

  // Module color mapping
  const moduleColors = {
    "blue": { bg: "rgba(52, 152, 219, 0.12)", border: "rgba(52, 152, 219, 0.4)", text: "#3498db", glow: "rgba(52, 152, 219, 0.2)" },
    "green": { bg: "rgba(46, 204, 113, 0.12)", border: "rgba(46, 204, 113, 0.4)", text: "#2ecc71", glow: "rgba(46, 204, 113, 0.2)" },
    "purple": { bg: "rgba(155, 89, 182, 0.12)", border: "rgba(155, 89, 182, 0.4)", text: "#9b59b6", glow: "rgba(155, 89, 182, 0.2)" },
    "orange": { bg: "rgba(230, 126, 34, 0.12)", border: "rgba(230, 126, 34, 0.4)", text: "#e67e22", glow: "rgba(230, 126, 34, 0.2)" },
    "gold": { bg: "rgba(241, 196, 15, 0.15)", border: "rgba(241, 196, 15, 0.5)", text: "#f1c40f", glow: "rgba(241, 196, 15, 0.25)" }
  };

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };
  
  // Dados dos depoimentos com fotos e textos
  const testimonials = [
    {
      id: 1,
      name: "Lucas Barreto",
      role: "Aprovado como Trainee ROV",
      videoUrl: "https://customer-assets.emergentagent.com/job_hello-world-9728/artifacts/me4naltt_Lucas%20Barreto.mp4",
      text: "Antes do Vaga Blindada, eu era ignorado em todos os processos seletivos de Trainee ROV. Depois de aplicar o método estratégico, consegui minha vaga em apenas 45 dias!"
    },
    {
      id: 2,
      name: "Rafael Duarte",
      role: "Aprovado como Trainee ROV",
      videoUrl: "https://customer-assets.emergentagent.com/job_hello-world-9728/artifacts/uqu9wrpp_Rafael%20Duarte.mp4",
      text: "O método Vaga Blindada mudou completamente minha abordagem nos processos seletivos. Hoje trabalho embarcado e realizado profissionalmente!"
    },
    {
      id: 3,
      name: "Bruna Albuquerque",
      role: "Aprovada como Trainee ROV",
      videoUrl: "https://customer-assets.emergentagent.com/job_hello-world-9728/artifacts/d57i71cp_Bruna%20Albuquerque.mp4",
      text: "Tentei por 2 anos conseguir uma vaga offshore sem sucesso. Com o Vaga Blindada, em 2 meses recebi minha primeira proposta. O método realmente funciona!"
    }
  ];
  const { createCheckoutSession, isProcessing } = useCheckout();
  const { trackEvent } = useAnalytics();

  // Link do Telegram para lista de espera (fallback se não tiver Kiwify URL)
  const telegramLink = "https://t.me/+UoeYC9QlR9I2MGM5";

  useEffect(() => {
    setIsVisible(true);
    // Track page view
    trackEvent('page_view', 'landing_page');
  }, [trackEvent]);

  const handlePurchase = async (source = 'hero') => {
    try {
      await trackEvent('cta_click', source, { button: 'purchase' });
      // Se tiver link da Kiwify, redireciona para lá
      const checkoutUrl = data.checkout_url || kiwifyCheckoutUrl;
      if (checkoutUrl) {
        window.open(checkoutUrl, '_blank');
      } else {
        // Fallback para Telegram enquanto não tem checkout
        window.open(telegramLink, '_blank');
      }
    } catch (error) {
      console.error('Error:', error);
      const checkoutUrl = data.checkout_url || kiwifyCheckoutUrl;
      if (checkoutUrl) {
        window.open(checkoutUrl, '_blank');
      } else {
        window.open(telegramLink, '_blank');
      }
    }
  };

  const handleLearnMore = () => {
    trackEvent('cta_click', 'hero', { button: 'learn_more' });
    document.getElementById('benefits').scrollIntoView({ behavior: 'smooth' });
  };

  // Show loading spinner while fetching data
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Show error state
  if (error) {
    return (
      <div className="error-page">
        <div className="container">
          <h1>Erro ao carregar</h1>
          <p>Tente recarregar a página.</p>
        </div>
      </div>
    );
  }

  // Use real data from API
  const data = courseData || {};

  return (
    <div className="landing-page">
      <Header onPurchase={handlePurchase} />
      
      {/* Hero Section with Background */}
      <section className={`hero-section hero-with-bg ${isVisible ? 'animate-in' : ''}`}>
        <div className="hero-bg-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-announcement">
              <Target size={16} />
              <span>VAGA BLINDADA ROV • Método Estratégico</span>
            </div>
            
            <h1 className="hero-title heading-hero">
              Por que técnicos não são chamados para o Processo Seletivo de Trainee de ROV — e como fazer seu currículo passar pelo sistema que elimina a maioria antes mesmo da entrevista
            </h1>
            
            <p className="hero-subtitle body-large">
              Um método prático para encontrar as vagas certas, montar um currículo estratégico e passar pela filtragem das empresas — mesmo sem experiência em ROV.
            </p>

            {/* Video Section - MP4 nativo com capa (poster) */}
            <div className="hero-video-container">
              <div className="video-player-wrapper">
                <video
                  id="hero-yt-player"
                  className="video-iframe"
                  src="https://customer-assets.emergentagent.com/job_hello-world-9728/artifacts/7awd41d7_Editado%20e%20Final.mp4"
                  poster="https://customer-assets.emergentagent.com/job_hello-world-9728/artifacts/d67yfso0_Editado%20e%20Final-Cover.jpg"
                  controls
                  autoPlay
                  muted
                  playsInline
                  preload="metadata"
                >
                  Seu navegador não suporta a reprodução de vídeo HTML5.
                </video>
              </div>
            </div>

            {/* Bloco de Identificação - logo abaixo do vídeo */}
            <div className="pain-points-box">
              <h3 className="pain-points-title">Se você está nessa situação:</h3>
              <ul className="pain-points-list">
                <li className="pain-point-item">
                  <span className="pain-point-bullet">✗</span>
                  <span>Já enviou currículo e não teve resposta</span>
                </li>
                <li className="pain-point-item">
                  <span className="pain-point-bullet">✗</span>
                  <span>Não sabe onde encontrar vagas reais de Trainee de ROV</span>
                </li>
                <li className="pain-point-item">
                  <span className="pain-point-bullet">✗</span>
                  <span>Não entende como funciona o processo seletivo</span>
                </li>
                <li className="pain-point-item">
                  <span className="pain-point-bullet">✗</span>
                  <span>Sente que está sempre um passo atrás</span>
                </li>
              </ul>
              <div className="pain-points-cta">
                <span className="pain-points-cta-arrow">👉</span>
                <span className="pain-points-cta-text">Então esse método foi feito pra você.</span>
              </div>
            </div>

            {/* Banner Promocional de Lançamento — logo abaixo do vídeo */}
            <div className="promo-banner">
              <div className="promo-icon">⚠️</div>
              <div className="promo-content">
                <h3 className="promo-title">AVISO: Valor Promocional de Lançamento</h3>
                <p className="promo-text">
                  O treinamento completo tem o valor de <span className="promo-old-price">R$ 297,00</span>, mas você pode garantir seu acesso ao <strong>Plano de Entrada</strong> hoje por apenas <strong className="promo-new-price">R$ 97,00</strong>. Aproveite enquanto esta condição de lançamento está disponível!
                </p>
              </div>
            </div>

            {/* Hero CTA Box - Highlighted checkout box */}
            <div className="hero-cta-section">
              <div className="hero-cta-box">
                <div className="hero-cta-icon">🎯</div>
                <h3 className="hero-cta-title">Garanta sua Vaga Agora</h3>
                <p className="hero-cta-subtitle">
                  Acesso imediato ao guia.<br />
                  <strong>Plano de Entrada por apenas R$ 97,00</strong>
                </p>
                <a
                  href="https://pay.kiwify.com.br/pkz4J3e"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="checkout-cta-button"
                  onClick={() => trackEvent('checkout_click', 'hero_box_cta')}
                >
                  <Shield size={22} className="checkout-cta-icon" />
                  <span className="checkout-cta-text">QUERO GARANTIR A MINHA VAGA</span>
                  <ArrowRight size={22} className="checkout-cta-arrow" />
                </a>
                <a
                  href="https://wa.me/5522988196922?text=Quero%20entender%20como%20entrar%20no%20ROV"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-cta-button"
                  onClick={() => trackEvent('whatsapp_click', 'hero_box_cta')}
                >
                  <MessageCircle size={20} className="whatsapp-cta-icon" />
                  <span className="whatsapp-cta-text">Tirar dúvidas no WhatsApp</span>
                </a>
                <p className="hero-cta-safety">
                  ✅ Acesso imediato &nbsp;•&nbsp; 🔒 Pagamento 100% seguro via Kiwify
                </p>
              </div>
            </div>

            {/* Testimonials Section - Video Cards */}
            <div className="testimonials-section">
              <h3 className="testimonials-title">
                <Star size={24} className="text-yellow-400" />
                Veja quem já conquistou sua vaga
              </h3>
              <div className="testimonials-grid">
                {testimonials.map((testimonial) => {
                  const isPlaying = playingTestimonial === testimonial.id;
                  return (
                    <div key={testimonial.id} className="testimonial-card-text">
                      <div className="testimonial-video-container">
                        <video
                          className="testimonial-video"
                          src={testimonial.videoUrl}
                          controls={isPlaying}
                          muted={!isPlaying}
                          playsInline
                          preload="metadata"
                          poster=""
                          onLoadedMetadata={(e) => {
                            // Jumps to 0.5s so the first frame shows the person (not a black frame)
                            try {
                              if (e.target.currentTime === 0) {
                                e.target.currentTime = 0.5;
                              }
                            } catch (err) { /* noop */ }
                          }}
                          onClick={(e) => {
                            if (!isPlaying) {
                              e.preventDefault();
                              // Pause all other testimonial videos
                              document.querySelectorAll('video.testimonial-video').forEach((v) => {
                                if (v !== e.target) {
                                  try { v.pause(); v.muted = true; } catch (err) { /* noop */ }
                                }
                              });
                              e.target.muted = false;
                              e.target.currentTime = 0;
                              const p = e.target.play();
                              if (p && typeof p.then === 'function') {
                                p.catch(() => { /* autoplay blocked */ });
                              }
                              setPlayingTestimonial(testimonial.id);
                              trackEvent('testimonial_play', 'hero', { testimonial_id: testimonial.id });
                            }
                          }}
                          onEnded={() => setPlayingTestimonial(null)}
                          onPause={(e) => {
                            // If user pauses via native control, reset state so overlay re-appears if they want to replay from start
                            if (isPlaying && e.target.ended) {
                              setPlayingTestimonial(null);
                            }
                          }}
                        />
                        {!isPlaying && (
                          <button
                            type="button"
                            className="testimonial-video-overlay"
                            aria-label={`Reproduzir depoimento de ${testimonial.name}`}
                            onClick={(e) => {
                              e.preventDefault();
                              const videoEl = e.currentTarget.parentElement.querySelector('video.testimonial-video');
                              if (videoEl) {
                                // Pause others
                                document.querySelectorAll('video.testimonial-video').forEach((v) => {
                                  if (v !== videoEl) {
                                    try { v.pause(); v.muted = true; } catch (err) { /* noop */ }
                                  }
                                });
                                videoEl.muted = false;
                                videoEl.currentTime = 0;
                                const p = videoEl.play();
                                if (p && typeof p.then === 'function') {
                                  p.catch(() => { /* noop */ });
                                }
                                setPlayingTestimonial(testimonial.id);
                                trackEvent('testimonial_play', 'hero', { testimonial_id: testimonial.id });
                              }
                            }}
                          >
                            <span className="testimonial-video-play-icon">
                              <Play size={28} fill="currentColor" />
                            </span>
                            <span className="testimonial-video-play-label">Assistir depoimento</span>
                          </button>
                        )}
                        <div className="testimonial-quote-icon">"</div>
                      </div>
                      <div className="testimonial-content">
                        <p className="testimonial-text">{testimonial.text}</p>
                        <div className="testimonial-author">
                          <h4 className="testimonial-name">{testimonial.name}</h4>
                          <p className="testimonial-role">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="hero-actions">
              <Button onClick={handleLearnMore} variant="outline" className="btn-secondary">
                {data.hero?.ctaSecondary || 'Conhecer o Método'}
              </Button>
            </div>
            
            <div className="hero-stats">
              {(data.stats || []).map((stat, index) => (
                <div key={index} className="stat-item">
                  <span className="stat-number">{stat.number}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section with Background */}
      <section id="benefits" className="benefits-section section-with-bg">
        <div className="section-bg-overlay"></div>
        <div className="container">
          <div className="section-header">
            <h2 className="heading-1">
              {data.sections?.benefits?.title || "O que você vai aprender"}
            </h2>
            <p className="body-medium">
              {data.sections?.benefits?.subtitle || "Conteúdo completo e prático"}
            </p>
          </div>
          
          <div className="voice-grid">
            {(data.benefits || []).map((benefit, index) => (
              <Card key={index} className="voice-card accent-blue hover-lift">
                <CardContent className="p-6">
                  <div className="benefit-icon">
                    <CheckCircle className="text-accent-blue-400" size={24} />
                  </div>
                  <h3 className="voice-card-title">{benefit.title}</h3>
                  <p className="voice-card-description">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* === MODULES / CURRICULUM SECTION === */}
      <section id="modules" className="modules-section">
        <div className="container">
          <div className="section-header">
            <div className="modules-section-badge">
              <Compass size={18} />
              <span>CURRÍCULO COMPLETO</span>
            </div>
            <h2 className="heading-1">
              {data.sections?.modules?.title || "Conteúdo Completo do Curso"}
            </h2>
            <p className="body-medium">
              {data.sections?.modules?.subtitle || "5 módulos estratégicos para te levar do zero à vaga"}
            </p>
          </div>
          
          <div className="modules-grid">
            {(data.modules || []).map((mod, index) => {
              const isBonus = mod.id === "bonus";
              const colors = moduleColors[mod.color] || moduleColors.blue;
              const IconComp = moduleIcons[mod.icon] || BookOpen;
              const isExpanded = expandedModules[mod.id] !== undefined ? expandedModules[mod.id] : true;
              
              return (
                <div 
                  key={mod.id} 
                  className={`module-card ${isBonus ? 'module-card-bonus' : ''}`}
                  style={{
                    '--module-bg': colors.bg,
                    '--module-border': colors.border,
                    '--module-text': colors.text,
                    '--module-glow': colors.glow
                  }}
                >
                  {/* Module Header */}
                  <div 
                    className="module-card-header"
                    onClick={() => toggleModule(mod.id)}
                  >
                    <div className="module-card-header-left">
                      <div className="module-icon-wrapper" style={{ background: colors.bg, borderColor: colors.border }}>
                        <IconComp size={24} style={{ color: colors.text }} />
                      </div>
                      <div className="module-header-text">
                        <span className="module-number" style={{ color: colors.text }}>
                          {isBonus ? "BÔNUS" : `MÓDULO ${mod.id}`}
                        </span>
                        <h3 className="module-title">{mod.title}</h3>
                        <span className="module-subtitle">{mod.subtitle}</span>
                      </div>
                    </div>
                    <div className="module-toggle">
                      <span className="module-lesson-count" style={{ color: colors.text }}>
                        {mod.lessons.length} {mod.lessons.length === 1 ? 'item' : 'aulas'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp size={20} style={{ color: colors.text }} />
                      ) : (
                        <ChevronDown size={20} style={{ color: colors.text }} />
                      )}
                    </div>
                  </div>
                  
                  {/* Module Lessons */}
                  <div className={`module-lessons ${isExpanded ? 'module-lessons-expanded' : 'module-lessons-collapsed'}`}>
                    {mod.lessons.map((lesson, lessonIdx) => (
                      <div key={lessonIdx} className="module-lesson-item">
                        <div className="lesson-number-badge" style={{ background: colors.bg, borderColor: colors.border, color: colors.text }}>
                          {lesson.number}
                        </div>
                        <span className="lesson-title">{lesson.title}</span>
                        <Lock size={14} className="lesson-lock-icon" />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA after modules */}
          <div className="modules-cta">
            <Button 
              onClick={() => handlePurchase('modules')} 
              className="btn-primary cta-button"
            >
              Garantir Minha Vaga Agora
              <ArrowRight size={18} className="ml-2" />
            </Button>
            <a
              href="https://wa.me/5522988196922?text=Quero%20entender%20como%20entrar%20no%20ROV"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-cta-button"
              onClick={() => trackEvent('whatsapp_click', 'modules_cta')}
            >
              <MessageCircle size={20} className="whatsapp-cta-icon" />
              <span className="whatsapp-cta-text">Tirar dúvidas no WhatsApp</span>
            </a>
            <p className="modules-cta-subtitle">Acesso imediato a todos os 5 módulos + bônus</p>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="target-section">
        <div className="container">
          <div className="target-content">
            <div className="target-text">
              <h2 className="heading-1">
                {data.sections?.target?.title || "Para quem é esse curso?"}
              </h2>
              <div className="target-list">
                {[
                  "Jovens técnicos que querem entrar no setor offshore",
                  "Quem está iniciando na área e quer começar com vantagem",
                  "Quem quer um método direto e estratégico para conquistar sua vaga",
                  "Técnicos em elétrica, mecânica, automação, mecatrônica ou áreas correlatas"
                ].map((item, index) => (
                  <div key={index} className="target-item">
                    <CheckCircle className="text-green-500" size={20} />
                    <span className="body-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="target-visual">
              <Card className="voice-card accent-green">
                <CardContent className="p-6 text-center">
                  <Users size={48} className="mx-auto mb-4 text-accent-green-400" />
                  <h3 className="voice-card-title">
                    {data.sections?.target?.cardTitle || "Técnicos de Todas as Áreas"}
                  </h3>
                  <p className="voice-card-description">
                    {data.sections?.target?.cardDescription || "Elétrica, Mecânica, Automação, Mecatrônica"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content Section with Background */}
      <section id="content" className="content-section section-with-bg-alt">
        <div className="section-bg-overlay"></div>
        <div className="container">
          <div className="section-header">
            <h2 className="heading-1">
              {data.sections?.content?.title || "O que você recebe ao se inscrever"}
            </h2>
            <p className="body-medium">
              {data.sections?.content?.subtitle || "Conteúdo completo para sua preparação"}
            </p>
          </div>
          
          <div className="content-grid">
            {(data.course_content || []).map((item, index) => {
              const iconMap = {
                "10 Aulas em Vídeo": PlayCircle,
                "Apostilas e Slides": FileText,
                "Modelo de Currículo": Download,
                "Checklists de Preparação": CheckCircle,
                "Certificado de Conclusão": Award,
                "Acesso ao Instrutor": MessageCircle
              };
              const IconComponent = iconMap[item.title] || BookOpen;
              
              return (
                <Card key={index} className="voice-card accent-purple">
                  <CardContent className="p-5">
                    <div className="content-icon">
                      <IconComponent className="text-accent-purple-400" size={32} />
                    </div>
                    <h3 className="heading-3">{item.title}</h3>
                    <p className="body-small">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bonus Section */}
      <section className="bonus-section">
        <div className="container">
          <div className="bonus-header">
            <Badge variant="secondary" className="bonus-badge">
              <Star size={16} />
              {data.sections?.bonus?.badge || "BÔNUS EXCLUSIVOS"}
            </Badge>
            <h2 className="heading-1">
              {data.sections?.bonus?.title || "Vantagens adicionais"}
            </h2>
          </div>
          
          <div className="ai-grid">
            {(data.bonuses || []).map((bonus, index) => {
              const iconMap = {
                "Canal de Vagas Reais": Target,
                "Lista de Empresas": Users,
                "Cronograma de Estudos": Calendar,
                "Atualizações Gratuitas": Clock
              };
              const IconComponent = iconMap[bonus.title] || Star;
              
              return (
                <Card key={index} className="voice-card accent-orange hover-lift">
                  <CardContent className="p-6">
                    <div className="bonus-icon">
                      <IconComponent className="text-accent-orange-400" size={28} />
                    </div>
                    <h3 className="voice-card-title">{bonus.title}</h3>
                    <p className="voice-card-description">{bonus.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Instructor Section with Background */}
      <section id="instructor" className="instructor-section section-with-bg-underwater">
        <div className="section-bg-overlay"></div>
        <div className="container">
          <Card className="instructor-card voice-card accent-grey">
            <CardContent className="p-8">
              <div className="instructor-content">
                <div className="instructor-info">
                  <h2 className="heading-1">
                    {data.sections?.instructor?.title || "Sobre o Instrutor"}
                  </h2>
                  <h3 className="heading-2">{data.instructor?.name || "Leandro Pinheiro"}</h3>
                  <p className="body-large">{data.instructor?.bio}</p>
                  <p className="body-medium">{data.instructor?.experience}</p>
                </div>
                <div className="instructor-visual">
                  <div className="instructor-avatar">
                    <Award size={64} className="text-accent-blue-400" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Strategic Checkout CTA — after instructor credibility, before final CTA */}
      <section className="strategic-cta-section">
        <div className="container">
          <div className="strategic-cta-wrapper">
            <p className="strategic-cta-text">
              Você já sabe o que vai aprender, conheceu o instrutor e viu os resultados reais.<br />
              <strong>Agora é a sua vez de conquistar a sua vaga.</strong>
            </p>
            <a
              href="https://pay.kiwify.com.br/pkz4J3e"
              target="_blank"
              rel="noopener noreferrer"
              className="checkout-cta-button"
              onClick={() => trackEvent('checkout_click', 'strategic_mid_cta')}
            >
              <Shield size={22} className="checkout-cta-icon" />
              <span className="checkout-cta-text">QUERO GARANTIR A MINHA VAGA</span>
              <ArrowRight size={22} className="checkout-cta-arrow" />
            </a>
            <a
              href="https://wa.me/5522988196922?text=Quero%20entender%20como%20entrar%20no%20ROV"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-cta-button"
              onClick={() => trackEvent('whatsapp_click', 'strategic_mid_cta')}
            >
              <MessageCircle size={20} className="whatsapp-cta-icon" />
              <span className="whatsapp-cta-text">Tirar dúvidas no WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section with ROV Background */}
      <section className="cta-section section-with-bg-cta">
        <div className="section-bg-overlay"></div>
        <div className="container">
          <Card className="cta-card voice-card accent-pink">
            <CardContent className="p-8 text-center">
              <h2 className="heading-1">
                {data.sections?.cta?.title || "Não deixe sua oportunidade escapar"}
              </h2>
              <p className="body-large">
                {data.sections?.cta?.subtitle || "Os primeiros inscritos terão acompanhamento especial."}
              </p>
              <div className="cta-urgency">
                <Clock size={20} />
                <span className="mono-text">
                  Vagas limitadas para o grupo VIP
                </span>
              </div>
              <Button 
                onClick={() => handlePurchase('cta_final')} 
                size="lg" 
                className="btn-primary cta-button"
              >
                Garantir Minha Vaga Agora
                <ArrowRight size={20} className="ml-2" />
              </Button>
              <a
                href="https://wa.me/5522988196922?text=Quero%20entender%20como%20entrar%20no%20ROV"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-cta-button"
                onClick={() => trackEvent('whatsapp_click', 'cta_final')}
                style={{ marginLeft: 'auto', marginRight: 'auto', display: 'flex' }}
              >
                <MessageCircle size={20} className="whatsapp-cta-icon" />
                <span className="whatsapp-cta-text">Tirar dúvidas no WhatsApp</span>
              </a>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;