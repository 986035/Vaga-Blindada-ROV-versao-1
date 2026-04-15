from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Models
class Lead(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    source: str = "unknown"
    status: str = "new"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class LeadCreate(BaseModel):
    name: str
    email: str
    phone: str
    source: str = "unknown"

class CourseInfo(BaseModel):
    product: dict
    hero: dict
    stats: List[dict]
    benefits: List[dict]
    course_content: List[dict]
    bonuses: List[dict]
    instructor: dict
    offers: List[dict]
    testimonials: List[dict]

# Course data with real module structure
course_data = {
    "product": {
        "name": "VAGA BLINDADA ROV",
        "subtitle": "Tudo o que você precisa para proteger sua vaga dos concorrentes. O guia completo para conquistar uma vaga de trainee de ROV no mercado offshore.",
        "price": "R$ 297,00",
        "oldPrice": "R$ 497,00"
    },
    
    "hero": {
        "announcement": "Vagas Limitadas • Acesso Prioritário",
        "title": "VAGA BLINDADA ROV",
        "subtitle": "Tudo o que você precisa para proteger sua vaga dos concorrentes. O guia completo para conquistar uma vaga de trainee de ROV no mercado offshore.",
        "videoText": "▶ Assista ao vídeo de apresentação",
        "ctaPrimary": "Garantir Minha Vaga",
        "ctaSecondary": "Conhecer o Método"
    },
    
    "stats": [
        {"number": "15+", "label": "Anos de Experiência"},
        {"number": "12", "label": "Aulas + Bônus"},
        {"number": "5", "label": "Módulos Completos"},
        {"number": "100%", "label": "Método Prático"}
    ],
    
    "modules": [
        {
            "id": 1,
            "title": "O Mapa da Mina",
            "subtitle": "Visão de Campo",
            "icon": "map",
            "color": "blue",
            "lessons": [
                {"number": "00", "title": "Boas-vindas: O seu cronograma até o primeiro embarque"},
                {"number": "01", "title": "A Realidade Offshore: Onde o dinheiro está escondido"},
                {"number": "02", "title": "A Carreira de ROV: Do Trainee ao Piloto Supervisor"}
            ]
        },
        {
            "id": 2,
            "title": "O Perfil de Elite",
            "subtitle": "O que o RH não fala",
            "icon": "user-check",
            "color": "green",
            "lessons": [
                {"number": "03", "title": "Mapa das Gigantes: Lista de empresas e onde elas postam as vagas"},
                {"number": "04", "title": "DNA Offshore: O comportamento e as soft skills que valem ouro"},
                {"number": "05", "title": "O Combo de Certificações: O que é obrigatório e o que é perda de tempo/dinheiro"}
            ]
        },
        {
            "id": 3,
            "title": "Blindagem de Candidatura",
            "subtitle": "A Prática",
            "icon": "shield",
            "color": "purple",
            "lessons": [
                {"number": "06", "title": "Currículo Magnético: O modelo exato para passar nos filtros de IA"},
                {"number": "07", "title": "O Caminho do Contrato: Entendendo as etapas (da ligação ao exame médico)"},
                {"number": "08", "title": "Campo Minado: Os 5 erros que queimam sua ficha no mercado para sempre"}
            ]
        },
        {
            "id": 4,
            "title": "Diferenciação e Vantagem Competitiva",
            "subtitle": "Seu Diferencial",
            "icon": "trophy",
            "color": "orange",
            "lessons": [
                {"number": "09", "title": "O Segredo da Vaga: Como ser o candidato nº 1 mesmo sem experiência offshore"},
                {"number": "10", "title": "Seu Plano de Guerra: O passo a passo para os próximos 30 dias"},
                {"number": "11", "title": "Conclusão: O próximo nível da sua carreira"}
            ]
        },
        {
            "id": "bonus",
            "title": "Arsenal do Candidato",
            "subtitle": "Módulo BÔNUS",
            "icon": "gift",
            "color": "gold",
            "lessons": [
                {"number": "B1", "title": "O que estudar para a Prova Técnica (Simulado)"},
                {"number": "B2", "title": "Modelos de Currículo (Word) + Checklists em PDF"}
            ]
        }
    ],

    "benefits": [
        {
            "title": "Mercado Offshore e ROV",
            "description": "Entenda onde o dinheiro está escondido e como funciona a carreira do Trainee ao Piloto Supervisor."
        },
        {
            "title": "Mapa das Gigantes",
            "description": "Lista completa de empresas que contratam e onde elas postam as vagas. Pare de procurar no lugar errado."
        },
        {
            "title": "Perfil de Elite",
            "description": "As soft skills, comportamentos e certificações que o RH realmente valoriza — e o que é perda de dinheiro."
        },
        {
            "title": "Currículo Magnético",
            "description": "O modelo exato para passar nos filtros de IA e chegar na mão do recrutador, mesmo sem experiência offshore."
        },
        {
            "title": "Blindagem Total",
            "description": "Os 5 erros que queimam sua ficha no mercado para sempre e como evitar cada um deles."
        },
        {
            "title": "Plano de Guerra 30 Dias",
            "description": "O passo a passo estratégico para os próximos 30 dias até conquistar sua vaga de trainee ROV."
        }
    ],
    
    "course_content": [
        {
            "title": "12 Aulas em Vídeo",
            "description": "4 módulos + bônus, organizados do zero ao embarque"
        },
        {
            "title": "Apostilas e Slides",
            "description": "Materiais complementares para reforçar o aprendizado"
        },
        {
            "title": "Modelo de Currículo",
            "description": "Pronto para edição, otimizado para passar nos filtros de IA"
        },
        {
            "title": "Simulado de Prova Técnica",
            "description": "Prepare-se para a prova técnica com questões reais do mercado"
        },
        {
            "title": "Checklists em PDF",
            "description": "Para você não esquecer nenhum detalhe importante"
        },
        {
            "title": "Acesso ao Instrutor",
            "description": "Canal direto no Telegram para tirar dúvidas"
        }
    ],
    
    "bonuses": [
        {
            "title": "Canal de Vagas Reais",
            "description": "Canal fechado com alertas de vagas reais do mercado offshore"
        },
        {
            "title": "Lista de Empresas",
            "description": "Lista completa de empresas que contratam profissionais de ROV"
        },
        {
            "title": "Simulado de Prova Técnica",
            "description": "Questões reais para você treinar antes do processo seletivo"
        },
        {
            "title": "Atualizações Gratuitas",
            "description": "Sempre que o curso for ampliado, você recebe as atualizações"
        }
    ],
    
    "instructor": {
        "name": "Leandro Pinheiro",
        "bio": "Técnico mecatrônico com mais de 15 anos de experiência no setor offshore, especializado em sistemas de ROV.",
        "experience": "Começou como técnico de ferramentas, evoluiu para piloto e hoje é referência em treinamento de novos profissionais.",
        "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300"
    },
    
    "checkout_url": "",
    
    "sections": {
        "benefits": {
            "title": "O que você vai aprender",
            "subtitle": "Conteúdo completo e prático para se destacar no mercado offshore"
        },
        "modules": {
            "title": "Conteúdo Completo do Curso",
            "subtitle": "5 módulos estratégicos para te levar do zero à vaga"
        },
        "target": {
            "title": "Para quem é esse curso?",
            "cardTitle": "Técnicos de Todas as Áreas",
            "cardDescription": "Elétrica, Mecânica, Automação, Mecatrônica e áreas correlatas"
        },
        "content": {
            "title": "O que você recebe ao se inscrever",
            "subtitle": "Conteúdo completo para sua preparação"
        },
        "bonus": {
            "badge": "BÔNUS EXCLUSIVOS",
            "title": "Vantagens adicionais para os primeiros inscritos"
        },
        "instructor": {
            "title": "Sobre o Instrutor"
        },
        "cta": {
            "title": "Não deixe sua oportunidade escapar",
            "subtitle": "Os primeiros inscritos terão acompanhamento especial e acesso prioritário às atualizações do curso.",
            "urgency": "Vagas limitadas para o grupo com acesso direto ao instrutor",
            "button": "Garantir Minha Vaga Agora"
        }
    }
}

# Routes
@api_router.get("/")
async def root():
    return {"message": "VAGA BLINDADA ROV API Online"}

@api_router.get("/course/info", response_model=dict)
async def get_course_info():
    return course_data

@api_router.post("/leads/capture", response_model=dict)
async def capture_lead(lead: LeadCreate):
    try:
        lead_obj = Lead(**lead.dict())
        result = await db.leads.insert_one(lead_obj.dict())
        return {
            "success": True,
            "lead_id": lead_obj.id,
            "message": "Lead capturado com sucesso!"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao capturar lead: {str(e)}")

@api_router.get("/leads", response_model=List[dict])
async def get_leads():
    try:
        leads = await db.leads.find().to_list(100)
        # Convert ObjectId to string for JSON serialization
        for lead in leads:
            if "_id" in lead:
                lead["_id"] = str(lead["_id"])
        return leads
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar leads: {str(e)}")

@api_router.post("/checkout/create")
async def create_checkout(checkout_data: dict):
    # Por enquanto, retorna dados simulados - será implementado com Stripe
    return {
        "checkout_url": "https://checkout.stripe.com/session_id_mock",
        "payment_id": str(uuid.uuid4()),
        "success": True
    }

@api_router.post("/analytics/event")
async def track_event(event_data: dict):
    try:
        event_data["timestamp"] = datetime.utcnow()
        await db.analytics.insert_one(event_data)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao rastrear evento: {str(e)}")

# Include router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()