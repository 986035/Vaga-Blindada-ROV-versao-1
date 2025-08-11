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

# ORIGINAL Course data from course_data.py - RESTORED VERSION
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
        {"number": "10", "label": "Aulas Completas"},
        {"number": "100%", "label": "Método Prático"}
    ],
    
    "benefits": [
        {
            "title": "Mercado Offshore e ROV",
            "description": "Como funciona o mercado offshore e onde o ROV atua. Entenda as oportunidades reais do setor."
        },
        {
            "title": "Habilidades Valorizadas", 
            "description": "Quais habilidades as empresas realmente valorizam nos candidatos a trainee ROV."
        },
        {
            "title": "Sistemas e Ferramentas",
            "description": "Os principais sensores, ferramentas e sistemas usados no ROV que você precisa conhecer."
        },
        {
            "title": "Currículo Profissional",
            "description": "Como montar um currículo profissional mesmo sendo iniciante, destacando seus pontos fortes."
        },
        {
            "title": "Entrevistas e Seleções",
            "description": "Dicas práticas para entrevistas e processos seletivos das principais empresas offshore."
        },
        {
            "title": "Vantagem Competitiva",
            "description": "O principal: como proteger a SUA vaga dos concorrentes e se destacar no mercado."
        }
    ],
    
    "course_content": [
        {
            "title": "10 Aulas em Vídeo",
            "description": "Organizadas passo a passo para seu aprendizado progressivo"
        },
        {
            "title": "Apostilas e Slides", 
            "description": "Materiais complementares para reforçar o aprendizado"
        },
        {
            "title": "Modelo de Currículo",
            "description": "Pronto para edição, otimizado para o mercado offshore"
        },
        {
            "title": "Checklists de Preparação",
            "description": "Para você não esquecer nenhum detalhe importante"
        },
        {
            "title": "Certificado de Conclusão",
            "description": "10 horas de certificação para seu currículo"
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
            "title": "Cronograma de Estudos",
            "description": "Para te manter no foco e organizar seu tempo de estudo"
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
    
    "sections": {
        "benefits": {
            "title": "O que você vai aprender",
            "subtitle": "Conteúdo completo e prático para se destacar no mercado offshore"
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