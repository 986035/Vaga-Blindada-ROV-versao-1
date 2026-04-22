# VAGA BLINDADA ROV - Landing Page

## 📋 Resumo do Projeto
Landing page para venda do curso "Vaga Blindada ROV" - curso que prepara técnicos para conquistar vagas de trainee de ROV no mercado offshore.

---

## ✅ O QUE JÁ ESTÁ PRONTO

### Frontend (Landing Page)
- [x] Design completo com tema marítimo/offshore
- [x] Seção Hero com título, subtítulo e vídeo
- [x] **Vídeo do YouTube integrado** (https://youtu.be/t2WO4HhINIE)
- [x] Seção "O que você vai aprender" (benefícios)
- [x] Seção "Para quem é esse curso"
- [x] Seção "O que você recebe" (conteúdo do curso)
- [x] Seção "Bônus exclusivos"
- [x] Seção "Sobre o Instrutor"
- [x] Seção CTA final
- [x] Header com navegação
- [x] Footer
- [x] Design responsivo (mobile/desktop)

### Backend
- [x] API FastAPI funcionando
- [x] Endpoint `/api/course/info` - dados do curso
- [x] Endpoint `/api/leads/capture` - captura de leads
- [x] Endpoint `/api/analytics/event` - rastreamento de eventos
- [x] Conexão com MongoDB configurada

### Deploy (Render)
- [x] Frontend deployed: `vaga-blindada-rov-versao-1-frontend.onrender.com`
- [x] Backend deployed: `vaga-blindada-rov-versao-1-backend.onrender.com`
- [x] requirements.txt corrigido (um pacote por linha)

### Domínio (Registro.br)
- [x] DNS configurado no Registro.br
- [x] `www.vagablindada.com.br` - ✅ Funcionando
- [x] `vagablindada.com.br` - ⚠️ Aguardando certificado SSL (pode levar até 24h)

**Configuração DNS:**
| Tipo | Nome | Valor |
|------|------|-------|
| A | vagablindada.com.br | 216.24.57.1 |
| CNAME | www.vagablindada.com.br | vaga-blindada-rov-versao-1-frontend.onrender.com |

---

## ⏳ O QUE FALTA FAZER

### Próximos Passos (quando as aulas estiverem prontas)
1. **Gravar e subir as aulas** para plataforma (Hotmart, Kiwify, etc.)
2. **Integrar checkout** - conectar botão "Garantir Vaga" ao link de pagamento
3. **Testar fluxo completo** de compra

### Botão "Garantir Vaga"
Atualmente está com checkout simulado (mock). Para ativar:
- Opção 1: Inserir link direto do checkout (Hotmart/Kiwify)
- Opção 2: Integrar API de pagamento (Stripe/Mercado Pago)

---

## 🔗 Links Importantes

| Recurso | URL |
|---------|-----|
| Site (www) | https://www.vagablindada.com.br |
| Site (raiz) | https://vagablindada.com.br |
| Preview Emergent | https://tecnico-rov-sucesso.preview.emergentagent.com |
| Frontend Render | https://vaga-blindada-rov-versao-1-frontend.onrender.com |
| Backend Render | https://vaga-blindada-rov-versao-1-backend.onrender.com |
| Vídeo YouTube | https://youtu.be/t2WO4HhINIE |
| GitHub | https://github.com/986035/Vaga-Blindada-ROV-versao-1 |

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React, Tailwind CSS
- **Backend:** FastAPI, Python
- **Banco de Dados:** MongoDB
- **Hospedagem:** Render
- **Domínio:** Registro.br

---

## 📞 Instrutor
**Leandro Pinheiro** - Técnico mecatrônico com 15+ anos de experiência no setor offshore, especializado em sistemas de ROV.

---

*Última atualização: Julho 2025*
