import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle, Play, Users, BookOpen, Award, Clock, Download, Target, Star, ArrowRight, PlayCircle, FileText, MessageCircle, Calendar } from "lucide-react";
import { useCourseInfo, useCheckout, useAnalytics } from "../hooks/useApi";
import Header from "./Header";
import Footer from "./Footer";
import LoadingSpinner from "./LoadingSpinner";

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [playingTestimonial, setPlayingTestimonial] = useState(null);
  const { courseData, isLoading, error } = useCourseInfo();
  
  // Dados dos depoimentos
  const testimonials = [
    {
      id: 1,
      name: "Carlos Miranda",
      role: "Aprovado como Trainee na Oceaneering",
      videoUrl: "https://customer-assets.emergentagent.com/job_br-domain-config/artifacts/bli1zgma_IMG_6137.mp4"
    },
    {
      id: 2,
      name: "Nicolas Paiva",
      role: "Aprovado como Trainee na Oceaneering",
      videoUrl: "https://customer-assets.emergentagent.com/job_br-domain-config/artifacts/bt3ff692_WhatsApp%20Video%202026-03-02%20at%2009.29.17.mp4"
    },
    {
      id: 3,
      name: "Nathalia Antonieto",
      role: "Aprovada como Trainee na Oceaneering",
      videoUrl: "https://customer-assets.emergentagent.com/job_br-domain-config/artifacts/n46rnyx3_WhatsApp%20Video%202026-03-02%20at%2009.29.20.mp4"
    }
  ];
  const { createCheckoutSession, isProcessing } = useCheckout();
  const { trackEvent } = useAnalytics();

  // Link do Telegram para lista de espera
  const telegramLink = "https://t.me/+UoeYC9QlR9I2MGM5";

  useEffect(() => {
    setIsVisible(true);
    // Track page view
    trackEvent('page_view', 'landing_page');
  }, [trackEvent]);

  const handlePurchase = async (source = 'hero') => {
    try {
      await trackEvent('cta_click', source, { button: 'telegram_waitlist' });
      // Redireciona para o Telegram
      window.open(telegramLink, '_blank');
    } catch (error) {
      console.error('Error:', error);
      // Abre o Telegram mesmo se o tracking falhar
      window.open(telegramLink, '_blank');
    }
  };

  const handleLearnMore = () => {
    trackEvent('cta_click', 'hero', { button: 'learn_more' });
    document.getElementById('benefits').scrollIntoView({ behavior: 'smooth' });
  };

  const handleWatchVideo = () => {
    trackEvent('video_play_attempt', 'hero');
    setIsVideoPlaying(true);
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
              <span>{data.hero?.announcement || "Vagas Limitadas • Acesso Prioritário"}</span>
            </div>
            
            <h1 className="hero-title heading-hero">
              {data.product?.name || "VAGA BLINDADA ROV"}
            </h1>
            
            <p className="hero-subtitle body-large">
              {data.product?.subtitle || "Tudo o que você precisa para proteger sua vaga dos concorrentes."}
            </p>

            {/* Video Section */}
            <div className="hero-video-container">
              {!isVideoPlaying ? (
                <div className="video-placeholder" onClick={handleWatchVideo}>
                  <img 
                    src="https://img.youtube.com/vi/t2WO4HhINIE/maxresdefault.jpg" 
                    alt="Vídeo de apresentação do curso Vaga Blindada ROV"
                    className="video-thumbnail"
                  />
                  <div className="video-play-button">
                    <PlayCircle size={80} />
                  </div>
                  <div className="video-overlay">
                    <span className="video-text">
                      {data.hero?.videoText || "▶ Assista ao vídeo de apresentação"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="video-player-wrapper">
                  <iframe
                    src="https://www.youtube.com/embed/t2WO4HhINIE?autoplay=1&rel=0"
                    title="Vaga Blindada ROV - Apresentação"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="video-iframe"
                  ></iframe>
                </div>
              )}
            </div>

            {/* Testimonials Section */}
            <div className="testimonials-section">
              <h3 className="testimonials-title">
                <Star size={24} className="text-yellow-400" />
                Veja quem já conquistou sua vaga
              </h3>
              <div className="testimonials-grid">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="testimonial-card">
                    <div className="testimonial-video-container">
                      <video
                        className="testimonial-video"
                        controls={playingTestimonial === testimonial.id}
                        muted={playingTestimonial !== testimonial.id}
                        playsInline
                        preload="auto"
                        src={testimonial.videoUrl}
                        onLoadedData={(e) => {
                          // Pula para 0.5s para mostrar o rosto
                          if (e.target.currentTime === 0) {
                            e.target.currentTime = 0.5;
                          }
                        }}
                        onClick={(e) => {
                          if (playingTestimonial !== testimonial.id) {
                            e.preventDefault();
                            setPlayingTestimonial(testimonial.id);
                            e.target.currentTime = 0;
                            e.target.muted = false;
                            e.target.play();
                          }
                        }}
                      >
                        Seu navegador não suporta vídeos.
                      </video>
                      {playingTestimonial !== testimonial.id && (
                        <div 
                          className="testimonial-play-overlay"
                          onClick={(e) => {
                            const video = e.currentTarget.previousSibling;
                            setPlayingTestimonial(testimonial.id);
                            video.currentTime = 0;
                            video.muted = false;
                            video.play();
                          }}
                        >
                          <div className="testimonial-play-button">
                            <PlayCircle size={48} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="testimonial-info">
                      <h4 className="testimonial-name">{testimonial.name}</h4>
                      <p className="testimonial-role">{testimonial.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* MailerLite Lead Capture Form */}
            <div className="mailerlite-section">
              <div className="mailerlite-authority">
                <p className="authority-line-1">Antes de tentar o processo seletivo de Trainee ROV, veja se você está cometendo algum desses <strong>7 erros</strong>.</p>
                <p className="authority-line-2">Baixe gratuitamente o checklist estratégico e descubra o que pode estar <strong>eliminando técnicos qualificados</strong> antes mesmo da entrevista.</p>
              </div>
              <div className="mailerlite-container">
                <div className="mailerlite-icon">📋</div>
                <h3 className="mailerlite-title">Checklist Gratuito – Trainee ROV</h3>
                <div id="mlb2-37275437" className="ml-form-embedContainer ml-subscribe-form ml-subscribe-form-37275437">
                  <form 
                    className="mailerlite-form" 
                    action="https://assets.mailerlite.com/jsonp/2120972/forms/179669314127791407/subscribe" 
                    method="post" 
                    target="_blank"
                  >
                    <input 
                      type="email" 
                      name="fields[email]" 
                      placeholder="Digite seu melhor email" 
                      required
                      className="mailerlite-input"
                    />
                    <input type="hidden" name="ml-submit" value="1" />
                    <input type="hidden" name="anticsrf" value="true" />
                    <button type="submit" className="mailerlite-button">
                      <Download size={18} />
                      QUERO O CHECKLIST GRATUITO
                    </button>
                  </form>
                  <p className="mailerlite-privacy">🔒 Seu email está seguro. Não enviamos spam.</p>
                </div>
              </div>
            </div>
            
            {/* Important Information Box - Below Video */}
            <div className="info-box-container">
              <div className="info-box">
                <div className="info-icon">💡</div>
                <div className="info-content">
                  <strong className="info-title">INFORMAÇÃO IMPORTANTE:</strong>
                  <p className="info-text">
                    Você <strong>NÃO precisa gastar R$ 15.000+</strong> em cursos técnicos de ROV! 
                    As empresas offshore fornecem treinamento completo ao contratar. 
                    Este curso te prepara para <strong>CONSEGUIR a vaga!</strong>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="hero-actions">
              <Button 
                onClick={() => handlePurchase('hero')} 
                className="btn-primary"
              >
                Entrar na Lista VIP
                <ArrowRight size={16} className="ml-2" />
              </Button>
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
                  "Quem busca um guia completo e direto para conquistar sua vaga",
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
            {(data.courseContent || []).map((item, index) => {
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
                Entrar no Grupo VIP do Telegram
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;