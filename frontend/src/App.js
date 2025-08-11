import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Components
const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const CTAButton = ({ children, onClick, className = "", size = "lg" }) => {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg font-bold",
    xl: "px-12 py-5 text-xl font-bold"
  };

  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 uppercase tracking-wide ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};

const LeadForm = ({ source = "unknown", onSuccess }) => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(`${API}/leads/capture`, {
        ...formData,
        source
      });
      
      if (response.data.success) {
        setSuccess(true);
        if (onSuccess) onSuccess();
        
        // Track conversion
        await axios.post(`${API}/analytics/event`, {
          event: "lead_capture",
          source,
          metadata: { form_location: source }
        });
      }
    } catch (error) {
      console.error("Erro ao capturar lead:", error);
      alert("Erro ao enviar formulário. Tente novamente.");
    }
    
    setLoading(false);
  };

  if (success) {
    return (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-center">
        <h3 className="font-bold text-lg">🎉 Sucesso!</h3>
        <p>Seus dados foram enviados com sucesso!</p>
        <p className="text-sm mt-2">Em breve entraremos em contato.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Seu nome completo"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none text-gray-800"
      />
      <input
        type="email"
        placeholder="Seu melhor e-mail"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none text-gray-800"
      />
      <input
        type="tel"
        placeholder="Seu WhatsApp (com DDD)"
        value={formData.phone}
        onChange={(e) => setFormData({...formData, phone: e.target.value})}
        required
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none text-gray-800"
      />
      <CTAButton 
        type="submit" 
        disabled={loading}
        className="w-full"
        size="lg"
      >
        {loading ? "ENVIANDO..." : "GARANTIR MINHA VAGA 🚀"}
      </CTAButton>
    </form>
  );
};

const HomePage = () => {
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadCourseData();
    trackPageView();
  }, []);

  const loadCourseData = async () => {
    try {
      const response = await axios.get(`${API}/course/info`);
      setCourseData(response.data);
    } catch (error) {
      console.error("Erro ao carregar dados do curso:", error);
    }
    setLoading(false);
  };

  const trackPageView = async () => {
    try {
      await axios.post(`${API}/analytics/event`, {
        event: "page_view",
        source: "homepage",
        metadata: { user_agent: navigator.userAgent }
      });
    } catch (error) {
      console.error("Erro ao rastrear page view:", error);
    }
  };

  const handleCTAClick = async (source) => {
    try {
      await axios.post(`${API}/analytics/event`, {
        event: "cta_click",
        source,
        metadata: { button_location: source }
      });
      setShowModal(true);
    } catch (error) {
      console.error("Erro ao rastrear CTA click:", error);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!courseData) return <div className="text-center p-8">Erro ao carregar dados do curso</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-800">VAGA BLINDADA ROV</h1>
            <CTAButton onClick={() => handleCTAClick("header")} size="sm">
              GARANTIR VAGA
            </CTAButton>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="bg-red-600 text-white px-6 py-2 rounded-full inline-block mb-6 animate-pulse">
              {courseData.hero.announcement}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {courseData.hero.title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
              {courseData.hero.subtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/159164/submarine-underwater-boat-torpedo-tube-torpedeo-159164.jpeg" 
                alt="ROV Technology" 
                className="rounded-lg shadow-2xl w-full"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
                <div className="bg-white bg-opacity-20 rounded-full p-6 hover:bg-opacity-30 transition-all cursor-pointer">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {courseData.stats.map((stat, index) => (
                  <div key={index} className="text-center bg-white bg-opacity-10 rounded-lg p-4">
                    <div className="text-3xl font-bold text-yellow-400">{stat.number}</div>
                    <div className="text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
              <CTAButton 
                onClick={() => handleCTAClick("hero")}
                className="w-full"
                size="xl"
              >
                GARANTIR MINHA VAGA AGORA
              </CTAButton>
              <p className="text-center text-sm opacity-75">
                🔒 Dados protegidos por SSL • ⭐ Garantia de 30 dias
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Por que Escolher o VAGA BLINDADA ROV?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              O único curso do Brasil que oferece garantia real de emprego no mercado offshore
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courseData.benefits.map((benefit, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <CTAButton onClick={() => handleCTAClick("benefits")} size="lg">
              QUERO TODOS ESSES BENEFÍCIOS
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-4">
          {courseData.offers.map((offer, index) => (
            <div key={index} className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">{offer.title}</h2>
              <p className="text-2xl mb-6">{offer.subtitle}</p>
              <div className="bg-yellow-400 text-black px-8 py-4 rounded-lg inline-block mb-6">
                <span className="text-2xl font-bold">{offer.highlight}</span>
              </div>
              <p className="text-lg mb-8 bg-black bg-opacity-20 rounded-lg px-6 py-3 inline-block">
                ⏰ {offer.urgency}
              </p>
              
              {offer.included && (
                <div className="bg-white bg-opacity-10 rounded-lg p-6 mb-8">
                  <h3 className="text-2xl font-bold mb-4">O QUE ESTÁ INCLUÍDO:</h3>
                  <div className="grid md:grid-cols-2 gap-2 text-left">
                    {offer.included.map((item, i) => (
                      <div key={i} className="flex items-start space-x-2">
                        <span className="text-green-400">✅</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="text-center">
                <div className="mb-6">
                  <span className="text-lg line-through opacity-75">De R$ {courseData.product.old_price}</span>
                  <span className="text-5xl font-bold ml-4">R$ {courseData.product.price}</span>
                </div>
                <CTAButton 
                  onClick={() => handleCTAClick("offer")}
                  className="animate-pulse"
                  size="xl"
                >
                  NÃO QUERO PERDER ESSA CHANCE! 🔥
                </CTAButton>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Course Content */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Conteúdo Completo do Curso
            </h2>
            <p className="text-xl text-gray-600">
              Metodologia comprovada para formar operadores ROV profissionais
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseData.course_content.map((module, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-4xl mb-4">{module.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{module.title}</h3>
                <p className="text-gray-600">{module.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <CTAButton onClick={() => handleCTAClick("content")} size="lg">
              QUERO ACESSO A TODO CONTEÚDO
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Bonuses */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              BÔNUS EXCLUSIVOS (Valor Total: R$ 1.085)
            </h2>
            <p className="text-xl">
              Receba gratuitamente estes materiais de apoio
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseData.bonuses.map((bonus, index) => (
              <div key={index} className="bg-white bg-opacity-10 p-6 rounded-lg">
                <div className="text-4xl mb-4">{bonus.icon}</div>
                <h3 className="text-xl font-bold mb-3">{bonus.title}</h3>
                <p className="text-sm opacity-90">{bonus.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <CTAButton 
              onClick={() => handleCTAClick("bonuses")}
              className="bg-yellow-500 hover:bg-yellow-600 text-black"
              size="lg"
            >
              GARANTIR TODOS OS BÔNUS
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Instructor */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src={courseData.instructor.photo} 
                  alt={courseData.instructor.name}
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                  Conheça Seu Instrutor
                </h2>
                <h3 className="text-2xl font-bold text-blue-600 mb-4">
                  {courseData.instructor.name}
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  {courseData.instructor.bio}
                </p>
                <p className="text-blue-600 font-semibold mb-8">
                  {courseData.instructor.experience}
                </p>
                <CTAButton onClick={() => handleCTAClick("instructor")} size="lg">
                  QUERO SER ORIENTADO POR ELE
                </CTAButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Depoimentos de Alunos
            </h2>
            <p className="text-xl text-gray-600">
              Veja o que nossos alunos falam sobre o curso
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {courseData.testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-bold text-gray-800">{testimonial.name}</p>
                  <p className="text-sm text-blue-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-800 to-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Não Perca Esta Oportunidade Única!
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Transforme sua carreira hoje mesmo e entre para o mercado offshore com garantia de emprego
          </p>
          
          <div className="max-w-md mx-auto mb-8">
            <div className="bg-red-600 rounded-lg p-6 mb-6">
              <div className="text-3xl font-bold">ÚLTIMAS 12 VAGAS!</div>
              <div className="text-lg">Após esgotar, preço volta para R$ 597</div>
            </div>
            
            <CTAButton 
              onClick={() => handleCTAClick("final")}
              className="w-full animate-pulse"
              size="xl"
            >
              GARANTIR MINHA VAGA AGORA! 🚀
            </CTAButton>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>🔒 Pagamento 100% Seguro</div>
            <div>✅ Garantia de 30 dias</div>
            <div>⚡ Acesso imediato</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">VAGA BLINDADA ROV</h3>
              <p className="text-gray-400">
                O curso mais completo de ROV do Brasil com garantia de emprego.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contato</h3>
              <div className="space-y-2 text-gray-400">
                <p>📧 contato@vagablindadarov.com</p>
                <p>📱 (11) 99999-9999</p>
                <p>🕒 Atendimento: 9h às 18h</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Garanta sua vaga</h3>
              <CTAButton onClick={() => handleCTAClick("footer")} size="md" className="w-full">
                FALAR COM CONSULTOR
              </CTAButton>
            </div>
          </div>
          <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 VAGA BLINDADA ROV. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Lead Capture Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">🎯 Garantir Minha Vaga</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-800 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="mb-6 text-center">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                🚨 <strong>ÚLTIMA CHANCE!</strong> Apenas 12 vagas restantes
              </div>
              <p className="text-gray-600">
                Preencha os dados abaixo para garantir sua vaga com desconto especial
              </p>
            </div>
            
            <LeadForm 
              source="modal" 
              onSuccess={() => {
                setTimeout(() => setShowModal(false), 3000);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;