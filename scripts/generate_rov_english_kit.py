"""
ROV English Kit — PDF Generator
Gera o guia de Inglês Técnico para Offshore do curso Vaga Blindada ROV.

Saída: /app/bonus_content/rov_english_kit.pdf
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm, mm
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    KeepTogether, ListFlowable, ListItem, Flowable
)
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

# =====================
# Theme / Brand
# =====================
GREEN = HexColor("#2ecc71")
DARK_GREEN = HexColor("#1e874b")
DARK_BG = HexColor("#0e1a24")
NAVY = HexColor("#1b2a38")
GOLD = HexColor("#f1c40f")
GRAY = HexColor("#e8eef3")
GRAY_DARK = HexColor("#4a5d6d")
RED = HexColor("#e74c3c")

OUTPUT_PATH = "/app/bonus_content/rov_english_kit.pdf"
os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)


# =====================
# Custom canvas with header/footer
# =====================
class BrandedCanvas(canvas.Canvas):
    """Canvas that draws a branded footer on every page except cover."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.pages = []

    def showPage(self):
        self.pages.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        total = len(self.pages)
        for i, page_state in enumerate(self.pages, start=1):
            self.__dict__.update(page_state)
            if i > 1:  # skip cover
                self._draw_footer(i, total)
            super().showPage()
        super().save()

    def _draw_footer(self, page_num, total):
        width, _ = A4
        # Footer line
        self.setStrokeColor(GREEN)
        self.setLineWidth(0.6)
        self.line(2 * cm, 1.6 * cm, width - 2 * cm, 1.6 * cm)
        # Brand
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(GREEN)
        self.drawString(2 * cm, 1.1 * cm, "VAGA BLINDADA ROV")
        self.setFont("Helvetica", 8)
        self.setFillColor(GRAY_DARK)
        self.drawString(5 * cm, 1.1 * cm, "ROV English Kit — Inglês Técnico para o Offshore")
        # Page number
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(GRAY_DARK)
        self.drawRightString(width - 2 * cm, 1.1 * cm, f"{page_num - 1} / {total - 1}")


# =====================
# Cover page — drawn directly on the canvas via onFirstPage callback
# =====================
def draw_cover(canv, doc):
    w, h = A4
    # Background
    canv.setFillColor(DARK_BG)
    canv.rect(0, 0, w, h, fill=1, stroke=0)
    # Top accent strip
    canv.setFillColor(GREEN)
    canv.rect(0, h - 0.4 * cm, w, 0.4 * cm, fill=1, stroke=0)
    # Bottom accent strip
    canv.setFillColor(GREEN)
    canv.rect(0, 0, w, 0.4 * cm, fill=1, stroke=0)
    # Large title
    canv.setFillColor(white)
    canv.setFont("Helvetica-Bold", 44)
    canv.drawCentredString(w / 2, h - 8 * cm, "ROV English Kit")
    # Subtitle
    canv.setFont("Helvetica", 18)
    canv.setFillColor(GREEN)
    canv.drawCentredString(w / 2, h - 9.4 * cm, "Inglês Técnico para o Offshore")
    # Decorative line
    canv.setStrokeColor(GREEN)
    canv.setLineWidth(2)
    canv.line(w / 2 - 3 * cm, h - 10.1 * cm, w / 2 + 3 * cm, h - 10.1 * cm)
    # Description
    canv.setFont("Helvetica", 12)
    canv.setFillColor(GRAY)
    canv.drawCentredString(w / 2, h - 11.5 * cm, "Glossário EN/PT  •  Frases Prontas  •  Dicas de Pronúncia")
    canv.drawCentredString(w / 2, h - 12.2 * cm, "Briefings  •  Operações  •  Manutenção  •  Emergências")
    # Badge
    canv.setFillColor(GOLD)
    canv.roundRect(w / 2 - 4 * cm, h - 14 * cm, 8 * cm, 0.9 * cm, 0.2 * cm, fill=1, stroke=0)
    canv.setFillColor(DARK_BG)
    canv.setFont("Helvetica-Bold", 12)
    canv.drawCentredString(w / 2, h - 13.45 * cm, "BÔNUS EXCLUSIVO DO CURSO")
    # Brand footer
    canv.setFont("Helvetica-Bold", 20)
    canv.setFillColor(GREEN)
    canv.drawCentredString(w / 2, 3.2 * cm, "VAGA BLINDADA ROV")
    canv.setFont("Helvetica", 10)
    canv.setFillColor(GRAY)
    canv.drawCentredString(w / 2, 2.5 * cm, "Do Zero ao Embarque — Curso para Trainee ROV")


# =====================
# Helpers for styled sections
# =====================
def styles():
    ss = getSampleStyleSheet()
    return {
        "h1": ParagraphStyle(
            "H1",
            parent=ss["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=24,
            textColor=GREEN,
            spaceAfter=8,
            spaceBefore=4,
            leading=28,
        ),
        "h2": ParagraphStyle(
            "H2",
            parent=ss["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=16,
            textColor=DARK_GREEN,
            spaceAfter=6,
            spaceBefore=14,
            leading=20,
        ),
        "h3": ParagraphStyle(
            "H3",
            parent=ss["Heading3"],
            fontName="Helvetica-Bold",
            fontSize=13,
            textColor=NAVY,
            spaceAfter=4,
            spaceBefore=10,
            leading=16,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=ss["BodyText"],
            fontName="Helvetica",
            fontSize=10.5,
            textColor=HexColor("#2c3e50"),
            leading=15,
            spaceAfter=6,
            alignment=TA_JUSTIFY,
        ),
        "callout": ParagraphStyle(
            "Callout",
            parent=ss["BodyText"],
            fontName="Helvetica-Oblique",
            fontSize=10.5,
            textColor=GRAY_DARK,
            leading=15,
            leftIndent=10,
            borderPadding=8,
        ),
        "phrase_en": ParagraphStyle(
            "PhraseEN",
            fontName="Helvetica-Bold",
            fontSize=10.5,
            textColor=NAVY,
            leading=14,
        ),
        "phrase_pt": ParagraphStyle(
            "PhrasePT",
            fontName="Helvetica-Oblique",
            fontSize=10,
            textColor=GRAY_DARK,
            leading=13,
            leftIndent=6,
        ),
        "note": ParagraphStyle(
            "Note",
            fontName="Helvetica",
            fontSize=9.5,
            textColor=GRAY_DARK,
            leading=12.5,
            leftIndent=8,
        ),
        "toc_item": ParagraphStyle(
            "TOC",
            fontName="Helvetica",
            fontSize=11,
            textColor=NAVY,
            leading=18,
            leftIndent=0,
        ),
    }


def glossary_table(pairs, st):
    """Build a 2-column glossary table EN | PT."""
    data = [[Paragraph("<b>English</b>", st["phrase_en"]), Paragraph("<b>Português</b>", st["phrase_en"])]]
    for en, pt in pairs:
        data.append([
            Paragraph(en, st["phrase_en"]),
            Paragraph(pt, st["phrase_pt"]),
        ])
    tbl = Table(data, colWidths=[7.2 * cm, 9.0 * cm], hAlign="LEFT")
    tbl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), GREEN),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 11),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [GRAY, white]),
        ("BOX", (0, 0), (-1, -1), 0.5, HexColor("#c0ccd6")),
        ("INNERGRID", (0, 0), (-1, -1), 0.3, HexColor("#d6dee6")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    return tbl


def phrase_block(en, pt, st):
    """Single EN phrase + PT translation block."""
    return KeepTogether([
        Paragraph(f"▸ <b>{en}</b>", st["phrase_en"]),
        Paragraph(f"&nbsp;&nbsp;&nbsp;<i>{pt}</i>", st["phrase_pt"]),
        Spacer(1, 3 * mm),
    ])


def tip_box(text, st):
    """Highlighted tip/callout box."""
    tbl = Table([[Paragraph(text, st["body"])]], colWidths=[16.4 * cm])
    tbl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), HexColor("#fff8dc")),
        ("BOX", (0, 0), (-1, -1), 1, GOLD),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    return tbl


def warning_box(text, st):
    """Red warning box."""
    tbl = Table([[Paragraph(f"<b>⚠ ATENÇÃO</b>: {text}", st["body"])]], colWidths=[16.4 * cm])
    tbl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), HexColor("#fce8e6")),
        ("BOX", (0, 0), (-1, -1), 1, RED),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    return tbl


# =====================
# Build the document
# =====================
def build_pdf():
    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=A4,
        rightMargin=2 * cm,
        leftMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2.5 * cm,
        title="ROV English Kit — Inglês Técnico para o Offshore",
        author="Vaga Blindada ROV",
        subject="Bônus exclusivo do curso Vaga Blindada ROV",
    )

    st = styles()
    story = []

    # =====================
    # COVER is drawn via onFirstPage callback. Story starts on page 2.
    # =====================
    # Reserve empty page 1 (the callback fills it)
    story.append(Spacer(1, 1))
    story.append(PageBreak())

    # =====================
    # WELCOME / INTRO
    # =====================
    story.append(Paragraph("Bem-vindo ao ROV English Kit", st["h1"]))
    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph(
        "Você está prestes a dar um passo gigante na sua carreira offshore. Este guia foi criado "
        "para <b>eliminar uma das maiores barreiras</b> que separam o técnico brasileiro da vaga de "
        "Trainee ROV nas grandes operadoras internacionais: <b>o inglês técnico</b>.",
        st["body"],
    ))
    story.append(Paragraph(
        "Aqui você não vai aprender gramática inglesa ou conjugação de verbos. Este não é um curso "
        "de inglês. Este é um <b>kit de sobrevivência linguística</b> para o ambiente offshore — "
        "com os termos, frases e situações que você realmente vai encontrar em uma operação de ROV.",
        st["body"],
    ))
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("Como usar este guia", st["h2"]))
    story.append(Paragraph(
        "<b>1. Leia por partes.</b> Não tente decorar tudo de uma vez. Escolha uma categoria "
        "(ex.: Equipamentos) e foque nela por alguns dias até os termos ficarem naturais.",
        st["body"],
    ))
    story.append(Paragraph(
        "<b>2. Fale em voz alta.</b> O cérebro memoriza melhor quando você <i>escuta a si mesmo</i> "
        "falando a palavra. Repita em voz alta mesmo sentindo vergonha.",
        st["body"],
    ))
    story.append(Paragraph(
        "<b>3. Pratique as frases em contexto.</b> Imagine situações reais (briefing antes de uma "
        "operação, reportar uma falha, etc.) e se coloque nelas mentalmente usando as frases deste guia.",
        st["body"],
    ))
    story.append(Paragraph(
        "<b>4. Volte sempre.</b> Este guia é para ser consultado. Mantenha ele salvo no celular e "
        "reveja antes de entrevistas, provas técnicas e, claro, antes do seu primeiro embarque.",
        st["body"],
    ))
    story.append(Spacer(1, 4 * mm))
    story.append(tip_box(
        "<b>Dica de ouro:</b> o inglês offshore é <b>limitado e repetitivo</b>. Os mesmos 200-300 "
        "termos e as mesmas 50-80 frases cobrem 90% de tudo que você vai precisar dizer ou entender "
        "no dia a dia. Foque neles e você já está à frente da maioria dos candidatos.",
        st,
    ))
    story.append(PageBreak())

    # =====================
    # TABLE OF CONTENTS
    # =====================
    story.append(Paragraph("Sumário", st["h1"]))
    story.append(Spacer(1, 4 * mm))
    toc_items = [
        ("Parte 1 — Glossário EN/PT por Categoria", ""),
        ("     1.1  Equipamentos e Componentes", ""),
        ("     1.2  Operações e Manobras", ""),
        ("     1.3  Manutenção e Diagnóstico", ""),
        ("     1.4  Segurança e Emergência", ""),
        ("     1.5  Comunicação e Rádio", ""),
        ("     1.6  Vida a Bordo e Logística", ""),
        ("Parte 2 — Frases Prontas por Situação", ""),
        ("     2.1  Briefings (DDS / Toolbox Talk / Pré-Dive)", ""),
        ("     2.2  Operações (durante o mergulho)", ""),
        ("     2.3  Manutenção (reportar falhas, pedir peças)", ""),
        ("     2.4  Emergências (alertas, evacuação)", ""),
        ("Parte 3 — Dicas de Pronúncia", ""),
        ("Parte 4 — Frases-Coringa (use em qualquer situação)", ""),
        ("Parte 5 — Mini-Exercícios de Fixação", ""),
        ("Encerramento — Próximos Passos", ""),
    ]
    for item, _ in toc_items:
        story.append(Paragraph(item, st["toc_item"]))
    story.append(PageBreak())

    # =====================
    # PART 1 — GLOSSARY
    # =====================
    story.append(Paragraph("Parte 1 — Glossário EN/PT por Categoria", st["h1"]))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        "A base de tudo é <b>vocabulário</b>. Antes de frase, antes de conversa, você precisa "
        "reconhecer os termos técnicos. Nas próximas páginas você tem mais de <b>250 termos</b> "
        "do inglês offshore de ROV traduzidos e organizados por contexto.",
        st["body"],
    ))
    story.append(Spacer(1, 4 * mm))

    # 1.1 Equipment
    story.append(Paragraph("1.1  Equipamentos e Componentes", st["h2"]))
    equipment = [
        ("ROV (Remotely Operated Vehicle)", "Veículo Operado Remotamente"),
        ("Work-class ROV", "ROV de trabalho (pesado, com manipuladores)"),
        ("Observation-class ROV", "ROV de observação (leve, só câmera)"),
        ("Tether", "Umbilical (cabo que conecta o ROV à superfície)"),
        ("Umbilical", "Cabo umbilical (suprimento de energia e dados)"),
        ("TMS (Tether Management System)", "Sistema de Gerenciamento do Umbilical"),
        ("Launch and Recovery System (LARS)", "Sistema de Lançamento e Recuperação"),
        ("A-frame", "Pórtico (estrutura de lançamento)"),
        ("Winch", "Guincho"),
        ("Manipulator / Manipulator arm", "Manipulador / Braço manipulador"),
        ("Seven-function manipulator", "Manipulador de 7 funções"),
        ("Thruster", "Propulsor"),
        ("Azimuth thruster", "Propulsor azimutal"),
        ("Skid", "Estrutura auxiliar (skid)"),
        ("Tooling skid", "Skid de ferramentas"),
        ("HPU (Hydraulic Power Unit)", "Unidade Hidráulica"),
        ("Hydraulic pump", "Bomba hidráulica"),
        ("Valve pack / Valve manifold", "Bloco de válvulas"),
        ("Camera / Main camera / Pan-tilt camera", "Câmera principal / Câmera pan-tilt"),
        ("Sonar", "Sonar"),
        ("Multibeam sonar", "Sonar multifeixe"),
        ("Lights / Spotlights", "Holofotes / Luzes"),
        ("Depth sensor", "Sensor de profundidade"),
        ("Gyro / Gyrocompass", "Giroscópio / Girocompasso"),
        ("Doppler (DVL)", "Doppler / DVL (sensor de velocidade)"),
        ("USBL (Ultra-Short Baseline)", "USBL (sistema de posicionamento acústico)"),
        ("BOP (Blowout Preventer)", "Preventor de Blowout"),
        ("Christmas Tree / X-mas Tree", "Árvore de Natal (equipamento de poço)"),
        ("Wellhead", "Cabeça de poço"),
        ("Manifold", "Manifold (bloco de válvulas submarino)"),
        ("Pipeline", "Duto / Tubulação"),
        ("Flowline", "Linha de fluxo"),
        ("Riser", "Riser (tubulação vertical)"),
        ("Jumper", "Jumper (tubulação curta de conexão)"),
        ("Flying lead", "Cabo flying lead"),
        ("Hot stab", "Hot stab (encaixe hidráulico rápido)"),
        ("Torque tool", "Ferramenta de torque"),
        ("ROV panel / Operator panel", "Painel de operação do ROV"),
        ("Joystick / Hand controller", "Joystick / Manche"),
        ("Control cabin / Control van", "Cabine de controle / Van de controle"),
        ("Monitor / Screen", "Monitor / Tela"),
    ]
    story.append(glossary_table(equipment, st))
    story.append(PageBreak())

    # 1.2 Operations
    story.append(Paragraph("1.2  Operações e Manobras", st["h2"]))
    operations = [
        ("Dive", "Imersão / Mergulho"),
        ("Launch", "Lançamento"),
        ("Recovery", "Recuperação"),
        ("Deployment", "Lançamento (termo formal)"),
        ("Descend / Descent", "Descer / Descida"),
        ("Ascend / Ascent", "Subir / Subida"),
        ("Hover / Hovering", "Pairar / Manter-se parado no local"),
        ("Station keeping", "Manter posição"),
        ("Heading", "Proa / Direção apontada"),
        ("Bearing", "Rumo / Azimute"),
        ("Pitch", "Arfagem (inclinação para frente/trás)"),
        ("Roll", "Balanço (inclinação lateral)"),
        ("Yaw", "Guinada (rotação horizontal)"),
        ("Target / Target depth", "Alvo / Profundidade-alvo"),
        ("Waypoint", "Ponto de referência"),
        ("Intervention", "Intervenção"),
        ("Inspection", "Inspeção"),
        ("IMR (Inspection, Maintenance, Repair)", "Inspeção, Manutenção e Reparo"),
        ("Survey", "Levantamento / Survey"),
        ("Pipeline inspection", "Inspeção de duto"),
        ("Visual inspection (VI)", "Inspeção visual"),
        ("CP survey (Cathodic Protection)", "Inspeção de Proteção Catódica"),
        ("FMECA check", "Verificação FMECA"),
        ("Launch window", "Janela de lançamento (condições OK)"),
        ("Weather window", "Janela meteorológica"),
        ("Sea state", "Estado do mar"),
        ("Current / Sea current", "Correnteza"),
        ("Water depth", "Profundidade da água"),
        ("Bottom / Seabed / Seafloor", "Fundo do mar"),
        ("On deck", "Em convés / Na plataforma"),
        ("In the water", "Na água (em operação)"),
        ("Pilot / ROV Pilot", "Piloto de ROV"),
        ("Co-pilot", "Copiloto"),
        ("Supervisor / ROV Supervisor", "Supervisor de ROV"),
        ("Trainee", "Trainee / Estagiário"),
        ("Client Representative / Company Man", "Representante da cliente / Company Man"),
        ("Shift / Watch", "Turno / Quarto"),
        ("Handover", "Passagem de turno"),
        ("Standby", "Em espera / Aguardando ordem"),
    ]
    story.append(glossary_table(operations, st))
    story.append(PageBreak())

    # 1.3 Maintenance
    story.append(Paragraph("1.3  Manutenção e Diagnóstico", st["h2"]))
    maintenance = [
        ("Maintenance", "Manutenção"),
        ("Preventive maintenance", "Manutenção preventiva"),
        ("Corrective maintenance", "Manutenção corretiva"),
        ("Troubleshooting", "Diagnóstico de falhas"),
        ("Failure / Fault", "Falha"),
        ("Malfunction", "Mau funcionamento"),
        ("Error / Error code", "Erro / Código de erro"),
        ("Alarm", "Alarme"),
        ("Warning", "Aviso / Alerta"),
        ("Replace / Replacement", "Substituir / Substituição"),
        ("Repair", "Reparar / Reparo"),
        ("Swap out", "Trocar / Substituir"),
        ("Inspect", "Inspecionar"),
        ("Check / Double-check", "Verificar / Conferir duas vezes"),
        ("Calibrate / Calibration", "Calibrar / Calibração"),
        ("Greasing / Lubricate", "Lubrificar / Engraxar"),
        ("Oil change", "Troca de óleo"),
        ("Pressure test", "Teste de pressão"),
        ("Leak / Leakage", "Vazamento"),
        ("Leak test", "Teste de vazamento"),
        ("Seal / O-ring", "Vedação / O-ring"),
        ("Bolt / Nut / Washer", "Parafuso / Porca / Arruela"),
        ("Torque / Torque wrench", "Torque / Torquímetro"),
        ("Wrench / Spanner", "Chave (de fenda/boca)"),
        ("Screwdriver", "Chave de fenda"),
        ("Spare part / Spare", "Peça sobressalente"),
        ("Consumable", "Consumível"),
        ("Stock / Inventory", "Estoque"),
        ("Downtime", "Tempo parado (sem operação)"),
        ("Uptime", "Tempo em operação"),
        ("MTBF (Mean Time Between Failures)", "Tempo Médio Entre Falhas"),
        ("Root cause", "Causa-raiz"),
        ("Workaround", "Contorno / Solução temporária"),
        ("Sea trial", "Teste em mar"),
        ("Function test / Functional test", "Teste funcional"),
        ("Wiring / Cabling", "Cabeamento / Fiação"),
        ("Connector", "Conector"),
        ("Power supply", "Fonte de alimentação"),
        ("Fuse", "Fusível"),
        ("Circuit breaker", "Disjuntor"),
    ]
    story.append(glossary_table(maintenance, st))
    story.append(PageBreak())

    # 1.4 Safety
    story.append(Paragraph("1.4  Segurança e Emergência", st["h2"]))
    story.append(Paragraph(
        "Essa é <b>a categoria mais importante</b>. Os termos aqui podem literalmente salvar uma vida. "
        "Memorize esses primeiro.",
        st["body"],
    ))
    story.append(Spacer(1, 3 * mm))
    safety = [
        ("PPE (Personal Protective Equipment)", "EPI (Equipamento de Proteção Individual)"),
        ("Helmet / Hard hat", "Capacete"),
        ("Safety boots / Steel-toe boots", "Botas de segurança / Bico de aço"),
        ("Safety glasses / Goggles", "Óculos de segurança"),
        ("Gloves", "Luvas"),
        ("Coveralls", "Macacão"),
        ("Earplugs / Ear protection", "Protetor auricular"),
        ("Harness", "Cinto de segurança / Arnês"),
        ("Life jacket / Life vest", "Colete salva-vidas"),
        ("Immersion suit / Survival suit", "Traje de imersão / Traje de sobrevivência"),
        ("JSA (Job Safety Analysis)", "APR (Análise Preliminar de Risco)"),
        ("Risk assessment", "Avaliação de risco"),
        ("Permit to work (PTW)", "Permissão de Trabalho (PT)"),
        ("Hot work permit", "Permissão para Trabalho a Quente"),
        ("Toolbox talk / Tailgate meeting", "DDS (Diálogo Diário de Segurança)"),
        ("Pre-job meeting / Kick-off", "Reunião pré-trabalho"),
        ("Hazard", "Perigo"),
        ("Risk", "Risco"),
        ("Mitigation / Control", "Mitigação / Controle"),
        ("Near miss", "Quase acidente"),
        ("Incident / Accident", "Incidente / Acidente"),
        ("LTI (Lost Time Injury)", "Acidente com Afastamento"),
        ("LOTO (Lockout / Tagout)", "Bloqueio e Etiquetagem"),
        ("Confined space", "Espaço confinado"),
        ("Working at height", "Trabalho em altura"),
        ("Muster station", "Ponto de encontro (emergência)"),
        ("Muster / Head count", "Reunião de emergência / Contagem"),
        ("Alarm / General alarm", "Alarme / Alarme geral"),
        ("Fire drill", "Simulado de incêndio"),
        ("Abandon ship drill", "Simulado de abandono"),
        ("Man overboard (MOB)", "Homem ao mar"),
        ("Evacuation", "Evacuação"),
        ("Lifeboat", "Baleeira / Bote salva-vidas motorizado"),
        ("Life raft", "Balsa salva-vidas"),
        ("EEBD (Emergency Escape Breathing Device)", "Equipamento de fuga respiratório"),
        ("Fire extinguisher", "Extintor de incêndio"),
        ("Fire hose", "Mangueira de incêndio"),
        ("Smoke", "Fumaça"),
        ("Mayday (extreme emergency)", "Mayday (emergência com risco de vida)"),
        ("Pan-pan (urgency)", "Pan-pan (urgência sem risco imediato)"),
        ("Securité (safety message)", "Securité (mensagem de segurança)"),
    ]
    story.append(glossary_table(safety, st))
    story.append(PageBreak())

    # 1.5 Communication
    story.append(Paragraph("1.5  Comunicação e Rádio", st["h2"]))
    comm = [
        ("Copy / Copy that", "Entendido"),
        ("Roger / Roger that", "Recebido / Confirmado"),
        ("Wilco", "Vou cumprir (will comply)"),
        ("Over", "Câmbio (fim da minha fala)"),
        ("Out", "Desligo (fim da conversa)"),
        ("Affirmative / Affirm", "Afirmativo / Sim"),
        ("Negative", "Negativo / Não"),
        ("Stand by", "Aguarde"),
        ("Say again / Repeat", "Repita, por favor"),
        ("Loud and clear", "Alto e claro"),
        ("Broken / Breaking up", "Com falhas / Cortando"),
        ("Read back", "Repita o que eu disse (confirmação)"),
        ("Go ahead", "Pode falar / Prossiga"),
        ("Break-break", "Interrupção urgente"),
        ("Channel", "Canal (de rádio)"),
        ("Switch channel", "Trocar de canal"),
        ("Radio check", "Teste de rádio"),
        ("NATO phonetic alphabet", "Alfabeto Fonético da OTAN (Alpha, Bravo…)"),
    ]
    story.append(glossary_table(comm, st))
    story.append(Spacer(1, 5 * mm))
    story.append(tip_box(
        "<b>Alfabeto Fonético:</b> Alpha, Bravo, Charlie, Delta, Echo, Foxtrot, Golf, Hotel, India, "
        "Juliet, Kilo, Lima, Mike, November, Oscar, Papa, Quebec, Romeo, Sierra, Tango, Uniform, "
        "Victor, Whiskey, X-ray, Yankee, Zulu. Use para soletrar nomes, matrículas, códigos em situações ruidosas.",
        st,
    ))
    story.append(PageBreak())

    # 1.6 Life onboard
    story.append(Paragraph("1.6  Vida a Bordo e Logística", st["h2"]))
    onboard = [
        ("Crew", "Tripulação"),
        ("Offshore", "Offshore (no mar)"),
        ("Onshore", "Onshore (em terra)"),
        ("Rig / Platform", "Plataforma / Sonda"),
        ("Drillship", "Navio-sonda"),
        ("FPSO", "FPSO (unidade flutuante de produção)"),
        ("PSV (Platform Supply Vessel)", "Navio de suprimentos"),
        ("AHTS (Anchor Handling Tug Supply)", "Rebocador / Barco de âncoras"),
        ("Vessel / Ship / Boat", "Embarcação / Navio"),
        ("Deck", "Convés"),
        ("Bridge", "Passadiço (cabine de comando)"),
        ("Mess room / Galley", "Refeitório / Cozinha"),
        ("Cabin", "Cabine / Camarote"),
        ("Bunk", "Beliche / Cama"),
        ("Change room / Locker room", "Vestiário"),
        ("Laundry", "Lavanderia"),
        ("Gym", "Academia"),
        ("HLO (Helicopter Landing Officer)", "Oficial de Pouso de Helicóptero"),
        ("Heliport / Helideck", "Heliponto"),
        ("Chopper / Helicopter", "Helicóptero"),
        ("Boat transfer / Crew transfer", "Transferência por embarcação"),
        ("POB (Persons on Board)", "Pessoas a Bordo"),
        ("Roster / Rotation / Hitch", "Escala / Rodízio"),
        ("28 on / 28 off", "28 dias embarcado / 28 em folga"),
        ("On tour / Off tour", "Em embarque / Em folga"),
        ("Sign on / Sign off", "Embarcar / Desembarcar"),
        ("Induction / Onboarding", "Treinamento introdutório de bordo"),
    ]
    story.append(glossary_table(onboard, st))
    story.append(PageBreak())

    # =====================
    # PART 2 — PHRASES
    # =====================
    story.append(Paragraph("Parte 2 — Frases Prontas por Situação", st["h1"]))
    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph(
        "Vocabulário sozinho não resolve — você precisa saber <b>montar frases</b> nas situações reais. "
        "Nesta parte você tem frases prontas, testadas e usadas no dia a dia offshore. "
        "<b>Dica:</b> leia em voz alta. Se familiarize com o som e o ritmo de cada uma.",
        st["body"],
    ))
    story.append(Spacer(1, 4 * mm))

    # 2.1 Briefings
    story.append(Paragraph("2.1  Briefings (DDS / Toolbox Talk / Pré-Dive)", st["h2"]))
    story.append(Paragraph("Cumprimentos e abertura", st["h3"]))
    briefing_open = [
        ("Good morning, everyone.", "Bom dia a todos."),
        ("Let's start the toolbox talk.", "Vamos começar o DDS."),
        ("Thanks for being here on time.", "Obrigado por estarem no horário."),
        ("Today we're going to perform a subsea inspection.", "Hoje vamos executar uma inspeção submarina."),
        ("The main goal of this operation is to inspect the manifold.", "O objetivo principal desta operação é inspecionar o manifold."),
        ("Please make sure your PPE is complete.", "Certifiquem-se de que o EPI está completo."),
    ]
    for en, pt in briefing_open:
        story.append(phrase_block(en, pt, st))

    story.append(Paragraph("Descrição da tarefa e riscos", st["h3"]))
    briefing_task = [
        ("The estimated dive time is four hours.", "O tempo estimado de mergulho é de quatro horas."),
        ("Target depth is 1,500 meters.", "Profundidade-alvo é 1.500 metros."),
        ("The main hazard is the subsea current — stay alert.", "O risco principal é a correnteza — fiquem atentos."),
        ("We have a permit to work signed and in place.", "Temos uma Permissão de Trabalho assinada e válida."),
        ("The JSA has been reviewed and signed by everyone.", "A APR foi revisada e assinada por todos."),
        ("If you see anything unsafe, stop the job immediately.", "Se virem algo inseguro, parem o trabalho imediatamente."),
        ("Remember: you have the right and the duty to refuse unsafe work.", "Lembrem-se: vocês têm o direito e o dever de recusar trabalho inseguro."),
    ]
    for en, pt in briefing_task:
        story.append(phrase_block(en, pt, st))

    story.append(Paragraph("Confirmação e encerramento", st["h3"]))
    briefing_close = [
        ("Does anyone have any questions?", "Alguém tem alguma pergunta?"),
        ("Any concerns before we start?", "Alguma preocupação antes de começarmos?"),
        ("Please sign the attendance sheet.", "Por favor, assinem a lista de presença."),
        ("Alright, let's get to work. Stay safe.", "Beleza, vamos ao trabalho. Fiquem seguros."),
    ]
    for en, pt in briefing_close:
        story.append(phrase_block(en, pt, st))

    story.append(Spacer(1, 3 * mm))
    story.append(tip_box(
        "Em briefings, <b>ouvir é mais importante do que falar</b>. Mesmo que seu inglês seja básico, "
        "mantenha contato visual, acene quando entender, e use \"Copy that\" ou \"Understood\" "
        "para confirmar. Quando não entender, pergunte sem medo: <i>\"Sorry, could you repeat that?\"</i>",
        st,
    ))
    story.append(PageBreak())

    # 2.2 Operations
    story.append(Paragraph("2.2  Operações (durante o mergulho)", st["h2"]))
    story.append(Paragraph("Início da operação", st["h3"]))
    ops_start = [
        ("ROV is powered up and ready to launch.", "ROV ligado e pronto para lançamento."),
        ("Launching ROV.", "Lançando o ROV."),
        ("ROV in the water.", "ROV na água."),
        ("Descending to target depth.", "Descendo à profundidade-alvo."),
        ("Tether is clear.", "Umbilical está livre."),
        ("All systems nominal.", "Todos os sistemas normais."),
        ("Video feed is clear.", "Imagem de vídeo está limpa."),
    ]
    for en, pt in ops_start:
        story.append(phrase_block(en, pt, st))

    story.append(Paragraph("Durante a operação", st["h3"]))
    ops_during = [
        ("Approaching target structure.", "Aproximando da estrutura-alvo."),
        ("Station keeping at 5 meters from the manifold.", "Mantendo posição a 5 metros do manifold."),
        ("Starting visual inspection now.", "Iniciando inspeção visual agora."),
        ("Zooming in on the valve.", "Aproximando a câmera na válvula."),
        ("Requesting permission to proceed with intervention.", "Solicitando autorização para prosseguir com intervenção."),
        ("Ready to engage the torque tool.", "Pronto para acoplar o torquímetro."),
        ("Torque applied — reading 450 Newton meters.", "Torque aplicado — leitura de 450 Newton-metros."),
        ("Operation complete. Retracting manipulator.", "Operação completa. Recolhendo manipulador."),
    ]
    for en, pt in ops_during:
        story.append(phrase_block(en, pt, st))

    story.append(Paragraph("Incidentes e anomalias", st["h3"]))
    ops_issues = [
        ("I'm seeing a leak on valve number three.", "Estou vendo um vazamento na válvula número três."),
        ("Visibility is poor due to sediment.", "Visibilidade está ruim por causa de sedimento."),
        ("Lost video on camera two.", "Perdi o vídeo na câmera dois."),
        ("Thruster fault on port side.", "Falha de propulsor no bordo esquerdo."),
        ("Current is picking up. Recommend abort.", "A correnteza está aumentando. Recomendo abortar."),
    ]
    for en, pt in ops_issues:
        story.append(phrase_block(en, pt, st))

    story.append(Paragraph("Fim da operação", st["h3"]))
    ops_end = [
        ("All tasks complete. Starting recovery.", "Todas as tarefas concluídas. Iniciando recuperação."),
        ("ROV clear of the structure.", "ROV afastado da estrutura."),
        ("Ascending to surface.", "Subindo à superfície."),
        ("ROV on deck. Dive complete.", "ROV em convés. Mergulho concluído."),
        ("Powering down the system.", "Desligando o sistema."),
    ]
    for en, pt in ops_end:
        story.append(phrase_block(en, pt, st))
    story.append(PageBreak())

    # 2.3 Maintenance
    story.append(Paragraph("2.3  Manutenção (reportar falhas, pedir peças)", st["h2"]))
    story.append(Paragraph("Reportar um problema", st["h3"]))
    mnt_report = [
        ("We have a hydraulic leak on the manipulator.", "Temos um vazamento hidráulico no manipulador."),
        ("The camera feed is intermittent.", "A imagem da câmera está intermitente."),
        ("Thruster number two is not responding.", "Propulsor número dois não está respondendo."),
        ("I'm getting an error on the control panel.", "Estou recebendo um erro no painel de controle."),
        ("The sonar stopped working mid-dive.", "O sonar parou de funcionar no meio do mergulho."),
        ("There's a strange noise coming from the HPU.", "Tem um barulho estranho vindo da HPU."),
    ]
    for en, pt in mnt_report:
        story.append(phrase_block(en, pt, st))

    story.append(Paragraph("Diagnóstico e reparo", st["h3"]))
    mnt_fix = [
        ("We need to isolate the circuit before working on it.", "Precisamos isolar o circuito antes de trabalhar nele."),
        ("Let's start with a visual inspection.", "Vamos começar com uma inspeção visual."),
        ("I think it's a faulty connector — let me swap it out.", "Acho que é um conector com defeito — vou substituí-lo."),
        ("We need to replace the seal on the manifold.", "Precisamos substituir a vedação do manifold."),
        ("Downtime is estimated at two hours.", "Tempo parado estimado em duas horas."),
        ("I'll run a function test after the repair.", "Vou rodar um teste funcional depois do reparo."),
    ]
    for en, pt in mnt_fix:
        story.append(phrase_block(en, pt, st))

    story.append(Paragraph("Pedindo peças / recursos", st["h3"]))
    mnt_parts = [
        ("Do we have a spare thruster motor on board?", "Temos um motor de propulsor sobressalente a bordo?"),
        ("Can you bring the spare O-ring kit?", "Você pode trazer o kit de O-rings sobressalente?"),
        ("I need a torque wrench, 3/4 inch.", "Preciso de um torquímetro, 3/4 de polegada."),
        ("Please add this item to the next mob list.", "Por favor, adicione este item à próxima lista de mobilização."),
        ("Request to order one new camera, model XYZ.", "Solicitação para pedir uma câmera nova, modelo XYZ."),
    ]
    for en, pt in mnt_parts:
        story.append(phrase_block(en, pt, st))
    story.append(PageBreak())

    # 2.4 Emergencies
    story.append(Paragraph("2.4  Emergências (alertas, evacuação)", st["h2"]))
    story.append(warning_box(
        "Em situações de emergência, mantenha a calma, <b>fale devagar e claro</b>, e use frases curtas. "
        "Se o inglês falhar, aponte, grite palavras-chave (\"FIRE!\", \"OVERBOARD!\") e siga as "
        "instruções do Muster Leader.",
        st,
    ))
    story.append(Spacer(1, 3 * mm))

    story.append(Paragraph("Chamadas de emergência (por rádio)", st["h3"]))
    emer_radio = [
        ("Mayday! Mayday! Mayday!", "Mayday! (emergência com risco à vida)"),
        ("This is ROV 1 — we have a fire in the control van.", "Aqui é ROV 1 — temos um incêndio na van de controle."),
        ("Pan-pan! Pan-pan! Pan-pan!", "Pan-pan! (urgência sem risco imediato)"),
        ("Require immediate medical assistance.", "Requerido assistência médica imediata."),
        ("Requesting MEDEVAC.", "Solicitando evacuação médica (MEDEVAC)."),
    ]
    for en, pt in emer_radio:
        story.append(phrase_block(en, pt, st))

    story.append(Paragraph("Alertas de incêndio e abandono", st["h3"]))
    emer_fire = [
        ("General alarm. Proceed to your muster station.", "Alarme geral. Dirijam-se ao ponto de encontro."),
        ("Fire on deck! Evacuate the area immediately.", "Incêndio no convés! Evacuem a área imediatamente."),
        ("Abandon ship! Abandon ship!", "Abandonem a embarcação!"),
        ("Grab your immersion suit.", "Peguem o traje de imersão."),
        ("Stay calm and follow the crew leader.", "Mantenham a calma e sigam o líder da tripulação."),
        ("Head count in progress.", "Contagem de pessoas em andamento."),
        ("All personnel accounted for.", "Todas as pessoas localizadas."),
    ]
    for en, pt in emer_fire:
        story.append(phrase_block(en, pt, st))

    story.append(Paragraph("Homem ao mar / Acidentes pessoais", st["h3"]))
    emer_mob = [
        ("Man overboard! Man overboard on starboard side!", "Homem ao mar! Homem ao mar no bombordo!"),
        ("Keep eyes on him — don't lose visual contact.", "Mantenham olhar nele — não percam contato visual."),
        ("Throw a life ring!", "Joguem uma boia!"),
        ("Launching rescue boat.", "Lançando bote de resgate."),
        ("Injured person on deck. Medic to the scene.", "Pessoa ferida no convés. Médico para o local."),
        ("Stop the bleeding. Apply pressure.", "Estanquem o sangramento. Apliquem pressão."),
    ]
    for en, pt in emer_mob:
        story.append(phrase_block(en, pt, st))
    story.append(PageBreak())

    # =====================
    # PART 3 — PRONUNCIATION TIPS
    # =====================
    story.append(Paragraph("Parte 3 — Dicas de Pronúncia", st["h1"]))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        "Essas são as palavras que mais causam erro de pronúncia entre brasileiros no offshore. "
        "Estude essa lista — errar uma dessas em entrevista pode te entregar como \"não fluente\".",
        st["body"],
    ))
    story.append(Spacer(1, 3 * mm))

    pronunciation = [
        ("ROV", "Sempre soletrado: \"ar-ou-vi\" (letra por letra). Nunca \"rov\" como palavra."),
        ("Tether", "\"TÉ-der\" (ê aberto, 'th' como 't' suave). NÃO é \"ZETA\"."),
        ("Thruster", "\"TRAS-ter\" (th como 't', 'u' curto)."),
        ("Subsea", "\"SÁB-si\" (com 'a' aberto, não 'sub-sê-a')."),
        ("Hydraulic", "\"rai-DRÓ-lik\" (começa com som de 'r', não 'h')."),
        ("Manifold", "\"MÉ-ni-fould\" (com 'é' aberto, não 'ma-ni-fóld')."),
        ("Umbilical", "\"am-BI-li-kol\" (começa com 'am', não 'um')."),
        ("Muster", "\"MÁS-ter\" (com 'a' aberto)."),
        ("Mayday", "\"MÊI-dêi\" (duas sílabas iguais, abertas)."),
        ("Manipulator", "\"me-NÍ-piu-lei-tor\" (tônica no 'ni')."),
        ("Jumper", "\"DJÂM-per\" (com som de 'dj')."),
        ("Wellhead", "\"UÉL-rréd\" (uma palavra só, 'h' sai suave)."),
        ("X-mas Tree (Christmas Tree)", "\"KRIS-mas tri\" — nunca pronuncie o 't' de Christmas."),
        ("Azimuth", "\"Á-zi-muth\" (o 'th' final é som de 's' suave)."),
        ("Bearing", "\"BÉ-rin\" (com 'é' aberto)."),
        ("Heading", "\"RÉ-din\" (não 'hé-ding' com 'h' forte)."),
        ("Galley", "\"GÉ-li\" (refeitório)."),
        ("Bridge", "\"BRÍDJ\" (com som de 'dj' no final)."),
    ]
    pron_data = [[Paragraph("<b>Palavra</b>", st["phrase_en"]), Paragraph("<b>Dica</b>", st["phrase_en"])]]
    for word, tip in pronunciation:
        pron_data.append([
            Paragraph(word, st["phrase_en"]),
            Paragraph(tip, st["phrase_pt"]),
        ])
    pron_table = Table(pron_data, colWidths=[4.5 * cm, 11.7 * cm], hAlign="LEFT")
    pron_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), GREEN),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [GRAY, white]),
        ("BOX", (0, 0), (-1, -1), 0.5, HexColor("#c0ccd6")),
        ("INNERGRID", (0, 0), (-1, -1), 0.3, HexColor("#d6dee6")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(pron_table)
    story.append(Spacer(1, 5 * mm))
    story.append(tip_box(
        "<b>Truque dos 200%:</b> quando não souber a pronúncia exata, <b>abra a vogal</b> e <b>fale "
        "firme</b>. Inglês offshore é falado no meio de ruído — é melhor falar alto e um pouco errado "
        "do que baixinho e certo. Ninguém vai se ofender.",
        st,
    ))
    story.append(PageBreak())

    # =====================
    # PART 4 — JOKER PHRASES
    # =====================
    story.append(Paragraph("Parte 4 — Frases-Coringa", st["h1"]))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        "Essas frases funcionam em <b>praticamente qualquer situação</b>. Se você só conseguir "
        "decorar algumas palavras deste guia, decore estas. Elas vão te salvar quando você não "
        "entender o que estão dizendo, quando precisar ganhar tempo para pensar, ou quando quiser "
        "demonstrar profissionalismo.",
        st["body"],
    ))
    story.append(Spacer(1, 4 * mm))

    story.append(Paragraph("Quando você não entende", st["h3"]))
    j1 = [
        ("Sorry, could you repeat that, please?", "Desculpe, você poderia repetir, por favor?"),
        ("Could you say it slower, please?", "Você poderia falar mais devagar, por favor?"),
        ("I'm not sure I understood. Let me confirm: ...", "Não tenho certeza se entendi. Deixa eu confirmar: ..."),
        ("Sorry, I didn't catch that.", "Desculpe, não peguei."),
        ("Could you spell that, please?", "Você poderia soletrar, por favor?"),
    ]
    for en, pt in j1:
        story.append(phrase_block(en, pt, st))

    story.append(Paragraph("Quando você precisa de tempo", st["h3"]))
    j2 = [
        ("Let me check and get back to you.", "Deixa eu verificar e te retornar."),
        ("Give me a moment, please.", "Me dê um momento, por favor."),
        ("Stand by — I'll confirm with the supervisor.", "Aguarde — vou confirmar com o supervisor."),
        ("I'll come back to you in five minutes.", "Te retorno em cinco minutos."),
    ]
    for en, pt in j2:
        story.append(phrase_block(en, pt, st))

    story.append(Paragraph("Quando você precisa de ajuda", st["h3"]))
    j3 = [
        ("Could you give me a hand with this?", "Você pode me dar uma mão com isso?"),
        ("I need help with the hydraulic hose.", "Preciso de ajuda com a mangueira hidráulica."),
        ("Can you explain how this works?", "Você pode explicar como isso funciona?"),
        ("I'm new — could you walk me through the procedure?", "Sou novo — você pode me passar pelo procedimento?"),
    ]
    for en, pt in j3:
        story.append(phrase_block(en, pt, st))

    story.append(Paragraph("Quando algo está errado (diplomático)", st["h3"]))
    j4 = [
        ("I'm not comfortable with this — I'd like to stop and review.", "Não estou confortável com isso — gostaria de parar e revisar."),
        ("I think we should double-check before proceeding.", "Acho que devíamos conferir de novo antes de prosseguir."),
        ("This doesn't look right to me.", "Isso não parece certo pra mim."),
        ("I'd rather be safe than sorry.", "Prefiro prevenir a remediar."),
    ]
    for en, pt in j4:
        story.append(phrase_block(en, pt, st))

    story.append(Paragraph("Fechamento profissional", st["h3"]))
    j5 = [
        ("Copy that, I'm on it.", "Entendido, já estou tratando."),
        ("Task complete. Standing by for next instruction.", "Tarefa concluída. Aguardando próxima instrução."),
        ("Thanks for the briefing. Let's stay safe out there.", "Obrigado pelo briefing. Vamos ficar seguros lá."),
    ]
    for en, pt in j5:
        story.append(phrase_block(en, pt, st))
    story.append(PageBreak())

    # =====================
    # PART 5 — EXERCISES
    # =====================
    story.append(Paragraph("Parte 5 — Mini-Exercícios de Fixação", st["h1"]))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        "Não pule esta parte. Esses exercícios simulam situações reais — resolvê-los ativa a memória "
        "do conteúdo de um jeito que só ler nunca consegue.",
        st["body"],
    ))
    story.append(Spacer(1, 4 * mm))

    story.append(Paragraph("Exercício 1 — Traduza para o inglês", st["h2"]))
    ex1 = [
        "1. \"Tenho um vazamento hidráulico no manipulador.\"",
        "2. \"Estou recebendo um erro no painel de controle.\"",
        "3. \"Profundidade-alvo é 1.500 metros.\"",
        "4. \"Todas as pessoas localizadas.\"",
        "5. \"Solicitando autorização para prosseguir com intervenção.\"",
        "6. \"A APR foi revisada e assinada por todos.\"",
    ]
    for line in ex1:
        story.append(Paragraph(line, st["body"]))
    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph("<b>Respostas:</b>", st["body"]))
    ans1 = [
        "1. \"We have a hydraulic leak on the manipulator.\"",
        "2. \"I'm getting an error on the control panel.\"",
        "3. \"Target depth is 1,500 meters.\"",
        "4. \"All personnel accounted for.\"",
        "5. \"Requesting permission to proceed with intervention.\"",
        "6. \"The JSA has been reviewed and signed by everyone.\"",
    ]
    for line in ans1:
        story.append(Paragraph(f"<i>{line}</i>", st["note"]))
    story.append(Spacer(1, 6 * mm))

    story.append(Paragraph("Exercício 2 — Associe o termo à definição", st["h2"]))
    ex2 = [
        ("a) Tether", "( ) Ponto de encontro de emergência"),
        ("b) JSA", "( ) Cabo umbilical do ROV"),
        ("c) LOTO", "( ) Análise Preliminar de Risco"),
        ("d) Muster station", "( ) Bloqueio e Etiquetagem"),
        ("e) Hot stab", "( ) Encaixe hidráulico rápido"),
    ]
    ex2_data = [[Paragraph(a, st["phrase_en"]), Paragraph(b, st["phrase_pt"])] for a, b in ex2]
    ex2_table = Table(ex2_data, colWidths=[5 * cm, 11.2 * cm])
    ex2_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(ex2_table)
    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph("<b>Respostas:</b> a → cabo umbilical &nbsp;|&nbsp; b → APR &nbsp;|&nbsp; "
                            "c → LOTO &nbsp;|&nbsp; d → ponto de encontro &nbsp;|&nbsp; e → encaixe rápido",
                            st["note"]))
    story.append(Spacer(1, 6 * mm))

    story.append(Paragraph("Exercício 3 — Complete a frase", st["h2"]))
    ex3 = [
        "1. \"ROV is powered up and ready to ________.\" (iniciar lançamento)",
        "2. \"General alarm. Proceed to your ________ station.\" (ponto de encontro)",
        "3. \"Sorry, could you ________ that, please?\" (repetir)",
        "4. \"I'll run a function ________ after the repair.\" (teste)",
        "5. \"________! ________! ________!\" (chamada máxima de emergência)",
    ]
    for line in ex3:
        story.append(Paragraph(line, st["body"]))
    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph("<b>Respostas:</b>", st["body"]))
    ans3 = [
        "1. launch &nbsp;&nbsp; 2. muster &nbsp;&nbsp; 3. repeat &nbsp;&nbsp; 4. test &nbsp;&nbsp; 5. Mayday! Mayday! Mayday!",
    ]
    for line in ans3:
        story.append(Paragraph(f"<i>{line}</i>", st["note"]))
    story.append(PageBreak())

    # =====================
    # CLOSING
    # =====================
    story.append(Paragraph("Encerramento — Próximos Passos", st["h1"]))
    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph(
        "Parabéns! Você chegou até o final do ROV English Kit. Se você absorveu pelo menos metade "
        "do que está aqui, já está à frente de <b>90% dos candidatos</b> a trainee de ROV.",
        st["body"],
    ))
    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph("O que fazer agora", st["h2"]))
    story.append(Paragraph(
        "<b>1. Revisite este guia pelo menos 3 vezes</b> antes da sua primeira entrevista. "
        "A repetição é o que transforma vocabulário em fluência.",
        st["body"],
    ))
    story.append(Paragraph(
        "<b>2. Assista vídeos reais de operações de ROV no YouTube</b> com legenda em inglês. "
        "Procure por \"ROV operations\", \"subsea intervention\", \"Oceaneering ROV\". Vai reconhecer "
        "dezenas de termos que aprendeu aqui.",
        st["body"],
    ))
    story.append(Paragraph(
        "<b>3. Pratique em voz alta por 10 minutos por dia.</b> Escolha um bloco de frases deste guia, "
        "leia em voz alta, tente gravar no celular e escutar. Vai se surpreender com a evolução em 30 dias.",
        st["body"],
    ))
    story.append(Paragraph(
        "<b>4. Use nas entrevistas.</b> Mesmo que a entrevista seja em português, comente: \"Estudei o "
        "inglês técnico específico de ROV e já domino o vocabulário do dia a dia operacional.\" Isso "
        "é um diferencial real.",
        st["body"],
    ))
    story.append(Spacer(1, 5 * mm))
    story.append(tip_box(
        "<b>Lembre-se:</b> a empresa não espera que você seja fluente — ela quer alguém que "
        "<b>não trave e não se intimide</b> com o inglês técnico. Este kit te deu exatamente isso. "
        "Agora é só usar.",
        st,
    ))
    story.append(Spacer(1, 8 * mm))
    story.append(Paragraph("Boa sorte no seu embarque. Nos vemos no mar. 🌊", st["h3"]))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        "<b>— Equipe Vaga Blindada ROV</b>",
        st["body"],
    ))

    # Build
    doc.build(story, onFirstPage=draw_cover, canvasmaker=BrandedCanvas)
    print(f"✓ PDF gerado com sucesso: {OUTPUT_PATH}")
    print(f"  Tamanho: {os.path.getsize(OUTPUT_PATH) / 1024:.1f} KB")


if __name__ == "__main__":
    build_pdf()
