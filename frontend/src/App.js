import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Professional Loading Component
const ProfessionalLoader = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center z-50">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <h3 className="text-xl font-semibold text-white">VAGA BLINDADA ROV</h3>
      <p className="text-blue-200">Carregando sua oportunidade...</p>
    </div>
  </div>
);

// Premium CTA Button
const PremiumCTAButton = ({ children, onClick, className = "", size = "lg", variant = "primary", disabled = false }) => {
  const sizeClasses = {
    sm: "px-6 py-3 text-sm",
    md: "px-8 py-4 text-base", 
    lg: "px-10 py-5 text-lg",
    xl: "px-12 py-6 text-xl"
  };

  const variantClasses = {
    primary: "bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white shadow-2xl hover:shadow-red-500/25",
    secondary: "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white shadow-2xl hover:shadow-blue-500/25",
    gold: "bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 hover:from-yellow-600 hover:via-yellow-700 hover:to-yellow-800 text-black shadow-2xl hover:shadow-yellow-500/25"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]} 
        ${variantClasses[variant]}
        font-bold uppercase tracking-wider rounded-lg
        transform hover:scale-105 hover:-translate-y-1
        transition-all duration-300 ease-out
        border-2 border-white/20 hover:border-white/40
        backdrop-blur-sm
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${className}
      `}
    >
      {disabled ? "ENVIANDO..." : children}
    </button>
  );
};

// Professional Lead Form
const ProfessionalLeadForm = ({ source = "unknown", onSuccess }) => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!formData.email.trim()) newErrors.email = "Email é obrigatório";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido";
    if (!formData.phone.trim()) newErrors.phone = "Telefone é obrigatório";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    setErrors(formErrors);
    
    if (Object.keys(formErrors).length > 0) return;

    setLoading(true);
    
    try {
      await axios.post(`${API}/analytics/event`, {
        event: "form_start", 
        source,
        metadata: { form_location: source }
      });

      const response = await axios.post(`${API}/leads/capture`, {
        ...formData,
        source
      });
      
      if (response.data.success) {
        setSuccess(true);
        if (onSuccess) onSuccess();
        
        await axios.post(`${API}/analytics/event`, {
          event: "lead_capture",
          source,
          metadata: { lead_id: response.data.leadId }
        });
      }
    } catch (error) {
      console.error("Erro ao capturar lead:", error);
      setErrors({ submit: "Erro ao enviar. Tente novamente." });
    }
    
    setLoading(false);
  };

  if (success) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-green-800 mb-2">🎉 Perfeito!</h3>
        <p className="text-green-700 text-lg mb-2">Seus dados foram enviados com sucesso!</p>
        <p className="text-green-600">Nossa equipe entrará em contato em breve para garantir sua vaga no curso.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <input
          type="text"
          placeholder="Seu nome completo"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className={`w-full px-6 py-4 rounded-lg border-2 ${errors.name ? 'border-red-300' : 'border-gray-200'} focus:border-blue-500 focus:outline-none text-gray-800 text-lg transition-colors`}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>
      
      <div>
        <input
          type="email"
          placeholder="Seu melhor e-mail"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className={`w-full px-6 py-4 rounded-lg border-2 ${errors.email ? 'border-red-300' : 'border-gray-200'} focus:border-blue-500 focus:outline-none text-gray-800 text-lg transition-colors`}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>
      
      <div>
        <input
          type="tel"
          placeholder="Seu WhatsApp (com DDD)"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className={`w-full px-6 py-4 rounded-lg border-2 ${errors.phone ? 'border-red-300' : 'border-gray-200'} focus:border-blue-500 focus:outline-none text-gray-800 text-lg transition-colors`}
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-center">{errors.submit}</p>
        </div>
      )}
      
      <PremiumCTAButton 
        type="submit"
        disabled={loading}
        className="w-full animate-pulse"
        size="lg"
      >
        {loading ? "ENVIANDO..." : "🚀 GARANTIR MINHA VAGA AGORA"}
      </PremiumCTAButton>
      
      <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
        <div className="flex items-center">
          <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Dados protegidos
        </div>
        <div className="flex items-center">
          <svg className="w-4 h-4 text-blue-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Garantia 30 dias
        </div>
      </div>
    </form>
  );
};

// Main Landing Page Component
const VagaBlindadaROV = () => {
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalSource, setModalSource] = useState('');

  useEffect(() => {
    loadCourseData();
    trackPageView();
  }, []);

  const loadCourseData = async () => {
    try {
      const response = await axios.get(`${API}/course/info`);
      setCourseData(response.data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    setLoading(false);
  };

  const trackPageView = async () => {
    try {
      await axios.post(`${API}/analytics/event`, {
        event: "page_view",
        source: "landing_page",
        metadata: { 
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent
        }
      });
    } catch (error) {
      console.error("Erro ao rastrear:", error);
    }
  };

  const handleCTAClick = async (source) => {
    try {
      await axios.post(`${API}/analytics/event`, {
        event: "cta_click",
        source,
        metadata: { button_location: source, timestamp: new Date().toISOString() }
      });
      setModalSource(source);
      setShowModal(true);
    } catch (error) {
      console.error("Erro ao rastrear CTA:", error);
    }
  };

  if (loading) return <ProfessionalLoader />;
  if (!courseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-red-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Erro ao carregar</h1>
          <p className="text-xl">Tente recarregar a página</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 antialiased">
      {/* Premium Navigation */}
      <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">ROV</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                VAGA BLINDADA ROV
              </h1>
            </div>
            <PremiumCTAButton 
              onClick={() => handleCTAClick("nav")}
              size="sm"
              className="hidden sm:block"
            >
              GARANTIR VAGA
            </PremiumCTAButton>
          </div>
        </div>
      </nav>

      {/* Hero Section - Premium */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          {/* Announcement Bar */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-6 py-3 bg-red-600/90 backdrop-blur-sm rounded-full text-white font-semibold text-sm border border-red-400 animate-pulse">
              <svg className="w-4 h-4 mr-2 animate-ping" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {courseData.hero?.announcement || "🚨 ÚLTIMAS VAGAS DISPONÍVEIS - GARANTA JÁ A SUA!"}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent">
                  VAGA
                </span>
                <br />
                <span className="bg-gradient-to-r from-red-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
                  BLINDADA
                </span>
                <br />
                <span className="text-white">ROV</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-blue-200 mb-8 leading-relaxed font-light">
                {courseData.hero?.subtitle || "Torne-se um Operador ROV Certificado e Garanta sua Vaga no Mercado Offshore com Salário de R$ 15.000+"}
              </p>

              {/* Statistics Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {courseData.stats?.map((stat, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                    <div className="text-2xl lg:text-3xl font-bold text-yellow-400 mb-1">
                      {stat.number}
                    </div>
                    <div className="text-xs lg:text-sm text-blue-200 font-medium">
                      {stat.label}
                    </div>
                  </div>
                )) || [
                  {number: "95%", label: "Taxa de Emprego"},
                  {number: "R$ 15k", label: "Salário Inicial"},
                  {number: "500+", label: "Formados"},
                  {number: "24h", label: "Suporte"}
                ].map((stat, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                    <div className="text-2xl lg:text-3xl font-bold text-yellow-400 mb-1">
                      {stat.number}
                    </div>
                    <div className="text-xs lg:text-sm text-blue-200 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <PremiumCTAButton 
                onClick={() => handleCTAClick("hero")}
                size="xl"
                className="mb-6 shadow-2xl shadow-red-500/30"
              >
                🚀 GARANTIR MINHA VAGA AGORA
              </PremiumCTAButton>

              <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-blue-200">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Dados 100% Protegidos
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Garantia de 30 dias
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Acesso Imediato
                </div>
              </div>
            </div>

            {/* Right Column - Hero Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://images.pexels.com/photos/3216911/pexels-photo-3216911.jpeg"
                  alt="Plataforma Offshore ROV" 
                  className="w-full h-96 lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Video Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button 
                    className="bg-white/20 backdrop-blur-md border-2 border-white/40 rounded-full p-6 hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
                    onClick={() => handleCTAClick("video")}
                  >
                    <svg className="w-12 h-12 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-sm font-medium">▶ Veja como funciona uma plataforma offshore</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section - Professional */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Por que o <span className="bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">VAGA BLINDADA ROV</span> é diferente?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              O único programa do Brasil que garante sua colocação no mercado offshore com certificação internacional reconhecida
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(courseData.benefits || [
              {title: "🎯 Certificação Internacional", description: "Certificado reconhecido mundialmente pela indústria offshore"},
              {title: "💼 Garantia de Emprego", description: "Programa exclusivo de colocação no mercado de trabalho"},
              {title: "🌊 Treinamento Prático", description: "Simuladores reais de ROV usados na indústria"},
              {title: "📱 Acesso Vitalício", description: "Curso disponível para sempre + atualizações gratuitas"},
              {title: "👨‍🏫 Mentoria Individual", description: "Acompanhamento personalizado durante todo o curso"},
              {title: "🌐 Network Exclusivo", description: "Acesso à comunidade de profissionais ROV no Brasil"}
            ]).map((benefit, index) => (
              <div key={index} className="group bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <h3 className="text-xl font-bold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <PremiumCTAButton 
              onClick={() => handleCTAClick("benefits")}
              variant="secondary"
              size="lg"
            >
              🎯 QUERO TODOS ESSES BENEFÍCIOS
            </PremiumCTAButton>
          </div>
        </div>
      </section>

      {/* Special Offers Section - Premium */}
      <section className="py-20 bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-yellow-400 text-black rounded-full font-bold text-sm mb-6 animate-bounce">
              🔥 OFERTA ESPECIAL - APENAS HOJE!
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-black mb-6">
              De <span className="line-through opacity-75">R$ 597</span><br />
              Por apenas <span className="text-yellow-400">R$ 297</span>
            </h2>
            
            <div className="bg-yellow-400 text-black px-8 py-4 rounded-2xl inline-block mb-8 transform -rotate-2">
              <span className="text-2xl font-bold">ECONOMIA DE R$ 300</span>
            </div>
            
            <p className="text-xl mb-12 bg-black/20 rounded-lg px-6 py-3 inline-block">
              ⏰ Oferta válida apenas para as próximas 24 horas
            </p>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-6 text-yellow-400">O QUE ESTÁ INCLUÍDO:</h3>
                <div className="space-y-3 text-left">
                  {[
                    "✅ Curso Completo VAGA BLINDADA ROV",
                    "✅ Certificação Internacional Reconhecida",
                    "✅ 6 Meses de Mentoria Individual",
                    "✅ Acesso ao Simulador ROV Profissional",
                    "✅ Garantia de Colocação no Mercado",
                    "✅ Suporte 24h Durante o Curso",
                    "✅ Acesso Vitalício + Atualizações",
                    "✅ Bônus Exclusivos (R$ 1.085)"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <span className="text-green-400 font-bold">✅</span>
                      <span className="text-white">{item.replace('✅ ', '')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-black p-8 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-4">🚨 ÚLTIMAS 12 VAGAS!</h4>
                  <p className="text-lg font-semibold">
                    Após esgotar as vagas,<br />preço volta para R$ 597
                  </p>
                </div>
                
                <PremiumCTAButton 
                  onClick={() => handleCTAClick("special_offer")}
                  variant="gold"
                  size="xl"
                  className="animate-pulse w-full mb-6"
                >
                  🔥 NÃO QUERO PERDER ESSA CHANCE!
                </PremiumCTAButton>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Pagamento Seguro
                  </div>
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Acesso Imediato
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-screen overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">🎯 Garantir Minha Vaga</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-3xl font-light"
              >
                ×
              </button>
            </div>
            
            <div className="mb-6 text-center">
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-lg mb-4">
                🚨 <strong>ÚLTIMA CHANCE!</strong> Apenas 12 vagas restantes
              </div>
              <p className="text-gray-600">
                Preencha os dados abaixo para garantir sua vaga com desconto especial de <strong>R$ 300</strong>
              </p>
            </div>
            
            <ProfessionalLeadForm 
              source={modalSource} 
              onSuccess={() => {
                setTimeout(() => setShowModal(false), 4000);
              }}
            />
          </div>
        </div>
      )}

      {/* Premium Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">ROV</span>
                </div>
                <h3 className="text-xl font-bold">VAGA BLINDADA ROV</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                O programa mais completo do Brasil para formação de Operadores ROV, com garantia de emprego no mercado offshore.
              </p>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-4">Contato</h4>
              <div className="space-y-2 text-gray-300">
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  contato@vagablindadarov.com
                </p>
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  (11) 99999-9999
                </p>
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Atendimento: 9h às 18h
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-4">Garanta Sua Vaga</h4>
              <p className="text-gray-300 mb-4">
                Fale diretamente com nossa equipe de consultores especializados
              </p>
              <PremiumCTAButton 
                onClick={() => handleCTAClick("footer")}
                variant="secondary"
                className="w-full"
              >
                💬 FALAR COM CONSULTOR
              </PremiumCTAButton>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 VAGA BLINDADA ROV. Todos os direitos reservados.</p>
            <p className="text-sm mt-2">
              CNPJ: 00.000.000/0001-00 | Desenvolvido por Emergent
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <div className="App">
      <VagaBlindadaROV />
    </div>
  );
}

export default App;