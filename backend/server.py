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

# Course data with complete offers and benefits
course_data = {
    "product": {
        "name": "VAGA BLINDADA ROV",
        "subtitle": "Curso Completo de Operador ROV com Garantia de Emprego",
        "price": 297.00,
        "old_price": 597.00,
        "currency": "BRL"
    },
    "hero": {
        "announcement": "🚨 ÚLTIMAS VAGAS DISPONÍVEIS - GARANTA JÁ A SUA!",
        "title": "VAGA BLINDADA ROV",
        "subtitle": "Torne-se um Operador ROV Certificado e Garanta sua Vaga no Mercado Offshore",
        "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    "stats": [
        {"number": "95%", "label": "Taxa de Empregabilidade"},
        {"number": "R$ 15k", "label": "Salário Médio Inicial"},
        {"number": "500+", "label": "Alunos Certificados"},
        {"number": "24h", "label": "Suporte Direto"}
    ],
    "benefits": [
        {
            "title": "🎯 Certificação Internacional",
            "description": "Certificado reconhecido mundialmente pela indústria offshore"
        },
        {
            "title": "💼 Garantia de Emprego",
            "description": "Programa exclusivo de colocação no mercado de trabalho"
        },
        {
            "title": "🌊 Treinamento Prático",
            "description": "Simuladores reais de ROV usados na indústria"
        },
        {
            "title": "📱 Acesso Vitalício",
            "description": "Curso disponível para sempre + atualizações gratuitas"
        },
        {
            "title": "👨‍🏫 Mentoria Individual",
            "description": "Acompanhamento personalizado durante todo o curso"
        },
        {
            "title": "🌐 Network Exclusivo",
            "description": "Acesso à comunidade de profissionais ROV no Brasil"
        }
    ],
    "course_content": [
        {
            "icon": "🤖",
            "title": "Fundamentos de ROV",
            "description": "História, tipos, componentes e aplicações industriais"
        },
        {
            "icon": "⚙️",
            "title": "Sistemas e Componentes",
            "description": "Thrusters, câmeras, manipuladores e sensores"
        },
        {
            "icon": "🕹️",
            "title": "Operação e Pilotagem",
            "description": "Técnicas avançadas de controle e navegação"
        },
        {
            "icon": "🔧",
            "title": "Manutenção Preventiva",
            "description": "Inspeção, diagnóstico e reparo de equipamentos"
        },
        {
            "icon": "📋",
            "title": "Segurança Offshore",
            "description": "Protocolos de segurança e procedimentos emergenciais"
        },
        {
            "icon": "📜",
            "title": "Certificação Final",
            "description": "Prova prática + teórica para certificação internacional"
        }
    ],
    "bonuses": [
        {
            "icon": "📚",
            "title": "E-book: Manual Completo ROV",
            "description": "Guia definitivo com 200+ páginas sobre ROV (Valor: R$ 97)"
        },
        {
            "icon": "🎥",
            "title": "Masterclass: Mercado Offshore",
            "description": "Como conseguir sua primeira vaga offshore (Valor: R$ 197)"
        },
        {
            "icon": "💻",
            "title": "Software de Simulação",
            "description": "Acesso ao simulador ROV profissional por 1 ano (Valor: R$ 397)"
        },
        {
            "icon": "🤝",
            "title": "Consultoria de Carreira",
            "description": "1h de consultoria individual para alavancar sua carreira (Valor: R$ 297)"
        },
        {
            "icon": "📱",
            "title": "App Mobile Exclusivo",
            "description": "Aplicativo com conteúdo offline e exercícios práticos (Valor: R$ 97)"
        }
    ],
    "offers": [
        {
            "title": "🎁 OFERTA ESPECIAL - APENAS HOJE!",
            "subtitle": "De R$ 597 por apenas R$ 297",
            "highlight": "ECONOMIA DE R$ 300",
            "urgency": "Oferta válida apenas para as próximas 24 horas",
            "included": [
                "✅ Curso Completo VAGA BLINDADA ROV",
                "✅ Certificação Internacional",
                "✅ Todos os 5 Bônus (Valor R$ 1.085)",
                "✅ Garantia de Emprego",
                "✅ Suporte 24h por 6 meses",
                "✅ Acesso Vitalício",
                "✅ Garantia de 30 dias"
            ]
        },
        {
            "title": "🔥 ÚLTIMO DIA DA PROMOÇÃO",
            "subtitle": "Não perca esta oportunidade única!",
            "highlight": "ÚLTIMAS 12 VAGAS",
            "urgency": "Após esgotar as vagas, preço volta para R$ 597",
            "benefits": [
                "💰 Economia imediata de R$ 300",
                "🚀 Entrada no mercado mais rápida",
                "📈 ROI em menos de 30 dias",
                "🎯 Vaga garantida ou seu dinheiro de volta"
            ]
        }
    ],
    "instructor": {
        "name": "Eng. Carlos Marinho",
        "bio": "Especialista em ROV com mais de 15 anos de experiência offshore",
        "experience": "Ex-Petrobras • Instrutor Certificado • 1000+ ROVs operados",
        "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300"
    },
    "testimonials": [
        {
            "name": "João Silva",
            "role": "Operador ROV - Oceaneering",
            "text": "Em 2 meses já estava empregado offshore ganhando R$ 18k. O curso é completo demais!",
            "rating": 5
        },
        {
            "name": "Maria Santos",
            "role": "ROV Pilot - Subsea 7",
            "text": "A certificação abriu portas que eu nem imaginava. Hoje trabalho em projetos internacionais.",
            "rating": 5
        },
        {
            "name": "Pedro Costa",
            "role": "Senior ROV Tech - TechnipFMC",
            "text": "Carlos é referência no mercado. O conteúdo é atual e extremamente prático.",
            "rating": 5
        }
    ]
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