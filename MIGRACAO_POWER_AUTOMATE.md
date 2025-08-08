# 🔄 Migração para Power Automate - Guia de Implementação

## 📋 Resumo da Migração

Este projeto foi migrado do Google Apps Script para **Microsoft Power Automate** com integração ao **OneDrive/SharePoint**, mantendo todas as funcionalidades e melhorando a integração com o ecossistema Microsoft.

---

## 🔧 **Configurações Necessárias**

### 1. **Criar Planilha no OneDrive**

1. Acesse seu **OneDrive** ou **SharePoint**
2. Crie uma nova planilha Excel chamada `BalcaoCidadania.xlsx`
3. Crie as **12 abas** conforme estrutura no arquivo `MODELO_PLANILHAS_POWER_AUTOMATE.md`:
   - CHAMADOS
   - OBSERVACOES_CHAMADOS
   - CHAMADOS_EXCLUIDOS
   - USUARIOS
   - CATEGORIAS_SERVICOS
   - IGREJAS_REGIOES
   - RELATORIOS_MENSAIS
   - PROFISSIONAIS_LIBERAIS
   - ACESSORES
   - ELEICOES_DEPUTADOS
   - ELEICOES_VEREADORES
   - ELEICOES_CONSELHO

### 2. **Configurar Power Automate Flows - PASSO A PASSO COMPLETO**

## 🔧 **CONFIGURAÇÃO DETALHADA DOS FLOWS**

### **📋 Pré-requisitos:**
1. Conta Microsoft 365 Business ou superior
2. Acesso ao Power Automate Premium
3. Planilha Excel criada no OneDrive/SharePoint
4. Permissões de administrador no tenant

---

### **🏗️ PASSO 1: Preparar a Planilha Excel**

#### 1.1 Criar Planilha Base
```
1. Vá para OneDrive Business ou SharePoint
2. Clique em "Novo" > "Pasta de trabalho do Excel"
3. Nomeie como "BalcaoCidadania.xlsx"
4. Crie uma nova aba chamada "CHAMADOS"
5. Adicione os cabeçalhos na linha 1:
```

**Cabeçalhos da aba CHAMADOS (linha 1):**
```
A1: ID
B1: DATA_ABERTURA  
C1: NOME_CIDADAO
D1: CONTATO
E1: EMAIL
F1: IGREJA
G1: REGIAO
H1: DESCRICAO_DEMANDA
I1: STATUS
J1: PRIORIDADE
K1: CATEGORIA
L1: CRIADO_POR
M1: CRIADO_POR_EMAIL
N1: RESPONSAVEL_ATUAL
O1: DATA_ULTIMA_ATUALIZACAO
P1: OBSERVACOES
Q1: ANEXOS
R1: TEMPO_RESOLUCAO
S1: SATISFACAO_CIDADAO
```

#### 1.2 Converter em Tabela
```
1. Selecione toda a linha 1 (A1:S1)
2. Vá em "Inserir" > "Tabela"
3. Marque "Minha tabela tem cabeçalhos"
4. Nomeie a tabela como "TabelaChamados"
```

#### 1.3 Repetir para Outras Abas Essenciais

**Aba USUARIOS:**
```
A1: ID
B1: NOME_COMPLETO
C1: EMAIL
D1: SENHA
E1: TELEFONE
F1: CARGO
G1: IGREJA
H1: REGIAO
I1: DATA_CADASTRO
J1: STATUS
K1: ULTIMO_ACESSO
L1: TOTAL_CHAMADOS
M1: CHAMADOS_RESOLVIDOS
N1: TAXA_RESOLUCAO
O1: CRIADO_POR
P1: OBSERVACOES
```

---

### **🚀 PASSO 2: Criar Flow "Validar Login"**

#### 2.1 Criar Novo Flow
```
1. Acesse flow.microsoft.com
2. Clique em "Criar" > "Flow de nuvem instantâneo"
3. Nome: "BalcaoCidadania - Validar Login"
4. Trigger: "Quando uma solicitação HTTP é recebida"
```

#### 2.2 Configurar Trigger HTTP

**Esquema JSON do Request:**
```json
{
    "type": "object",
    "properties": {
        "action": {
            "type": "string"
        },
        "email": {
            "type": "string"
        },
        "senha": {
            "type": "string"
        }
    },
    "required": [
        "action",
        "email", 
        "senha"
    ]
}
```

#### 2.3 Adicionar Ações

**Ação 1: Listar Linhas da Tabela**
```
Conector: Excel Online (Business)
Ação: List rows present in a table
Localização: OneDrive for Business
Biblioteca de Documentos: OneDrive
Arquivo: BalcaoCidadania.xlsx
Tabela: TabelaUsuarios
```

**Ação 2: Filtrar Array**
```
Conector: Controle de Dados
Ação: Filter array
De: value (do passo anterior)
Condição avançada:
item()?['EMAIL'] is equal to triggerBody()?['email']
```

**Ação 3: Condição - Verificar se usuário existe**
```
Conector: Controle
Ação: Condition
Expressão: empty(body('Filter_array'))
Se for igual a: false
```

**Ação 4: (SE SIM) Verificar Senha**
```
Conector: Controle de Dados  
Ação: Compose
Entradas: 
first(body('Filter_array'))?['SENHA']
```

**Ação 5: (SE SIM) Condição da Senha**
```
Conector: Controle
Ação: Condition
Esquerda: outputs('Compose')
é igual a: triggerBody()?['senha']
```

**Ação 6: (SE LOGIN VÁLIDO) Responder Sucesso**
```
Conector: Solicitação
Ação: Response
Código de Status: 200
Cabeçalhos: 
{
  "Content-Type": "application/json"
}
Corpo:
{
  "success": true,
  "message": "Login realizado com sucesso",
  "user": {
    "id": "@{first(body('Filter_array'))?['ID']}",
    "nome": "@{first(body('Filter_array'))?['NOME_COMPLETO']}",
    "email": "@{first(body('Filter_array'))?['EMAIL']}",
    "cargo": "@{first(body('Filter_array'))?['CARGO']}",
    "igreja": "@{first(body('Filter_array'))?['IGREJA']}",
    "regiao": "@{first(body('Filter_array'))?['REGIAO']}"
  }
}
```

**Ação 7: (SE SENHA INVÁLIDA) Responder Erro**
```
Conector: Solicitação
Ação: Response  
Código de Status: 401
Corpo:
{
  "success": false,
  "message": "Senha incorreta"
}
```

**Ação 8: (SE USUÁRIO NÃO EXISTE) Responder Erro**
```
Conector: Solicitação
Ação: Response
Código de Status: 404  
Corpo:
{
  "success": false,
  "message": "Usuário não encontrado"
}
```

---

### **📝 PASSO 3: Criar Flow "Criar Chamado"**

#### 3.1 Criar Novo Flow
```
Nome: "BalcaoCidadania - Criar Chamado"
Trigger: "Quando uma solicitação HTTP é recebida"
```

#### 3.2 Esquema JSON do Request
```json
{
    "type": "object",
    "properties": {
        "action": {
            "type": "string"
        },
        "chamado": {
            "type": "object",
            "properties": {
                "nome_cidadao": {"type": "string"},
                "contato": {"type": "string"},
                "email": {"type": "string"},
                "igreja": {"type": "string"},
                "regiao": {"type": "string"},
                "descricao_demanda": {"type": "string"},
                "categoria": {"type": "string"},
                "prioridade": {"type": "string"},
                "criado_por": {"type": "string"},
                "criado_por_email": {"type": "string"}
            }
        }
    }
}
```

#### 3.3 Ações do Flow

**Ação 1: Gerar ID Único**
```
Conector: Controle de Dados
Ação: Compose
Entradas: 
concat('CH', formatDateTime(utcnow(), 'yyyyMMddHHmmss'))
```

**Ação 2: Adicionar Linha na Tabela CHAMADOS**
```
Conector: Excel Online (Business)
Ação: Add a row into a table
Arquivo: BalcaoCidadania.xlsx
Tabela: TabelaChamados

Valores:
ID: @{outputs('Compose')}
DATA_ABERTURA: @{formatDateTime(utcnow(), 'dd/MM/yyyy HH:mm')}
NOME_CIDADAO: @{triggerBody()?['chamado']?['nome_cidadao']}
CONTATO: @{triggerBody()?['chamado']?['contato']}
EMAIL: @{triggerBody()?['chamado']?['email']}
IGREJA: @{triggerBody()?['chamado']?['igreja']}
REGIAO: @{triggerBody()?['chamado']?['regiao']}
DESCRICAO_DEMANDA: @{triggerBody()?['chamado']?['descricao_demanda']}
STATUS: Aberto
PRIORIDADE: @{triggerBody()?['chamado']?['prioridade']}
CATEGORIA: @{triggerBody()?['chamado']?['categoria']}
CRIADO_POR: @{triggerBody()?['chamado']?['criado_por']}
CRIADO_POR_EMAIL: @{triggerBody()?['chamado']?['criado_por_email']}
RESPONSAVEL_ATUAL: @{triggerBody()?['chamado']?['criado_por']}
DATA_ULTIMA_ATUALIZACAO: @{formatDateTime(utcnow(), 'dd/MM/yyyy HH:mm')}
OBSERVACOES: Chamado criado pelo sistema
ANEXOS: 
TEMPO_RESOLUCAO: 
SATISFACAO_CIDADAO: 
```

**Ação 3: Responder Sucesso**
```
Conector: Solicitação
Ação: Response
Código de Status: 201
Corpo:
{
  "success": true,
  "message": "Chamado criado com sucesso",
  "chamado_id": "@{outputs('Compose')}",
  "data_criacao": "@{formatDateTime(utcnow(), 'dd/MM/yyyy HH:mm')}"
}
```

---

### **📋 PASSO 4: Criar Flow "Listar Chamados"**

#### 4.1 Esquema JSON do Request
```json
{
    "type": "object",
    "properties": {
        "action": {"type": "string"},
        "filtros": {
            "type": "object",
            "properties": {
                "status": {"type": "string"},
                "regiao": {"type": "string"},
                "igreja": {"type": "string"},
                "categoria": {"type": "string"},
                "criado_por_email": {"type": "string"},
                "data_inicio": {"type": "string"},
                "data_fim": {"type": "string"}
            }
        }
    }
}
```

#### 4.2 Ações do Flow

**Ação 1: Listar Todas as Linhas**
```
Conector: Excel Online (Business)
Ação: List rows present in a table
Arquivo: BalcaoCidadania.xlsx
Tabela: TabelaChamados
```

**Ação 2: Aplicar Filtros (Se Necessário)**
```
Conector: Controle de Dados
Ação: Filter array
De: value (do passo anterior)
Condição: 
if(empty(triggerBody()?['filtros']?['status']), true, equals(item()?['STATUS'], triggerBody()?['filtros']?['status']))
```

**Ação 3: Responder com Dados**
```
Conector: Solicitação  
Ação: Response
Código de Status: 200
Corpo:
{
  "success": true,
  "chamados": "@{body('Filter_array')}",
  "total": "@{length(body('Filter_array'))}"
}
```

---

### **⚙️ PASSO 5: Configurar URLs no Sistema**

#### 5.1 Obter URLs dos Flows
```
1. Em cada flow criado, vá em "Quando uma solicitação HTTP é recebida"
2. Copie a "URL de POST HTTP"
3. A URL será algo como:
https://prod-XX.westus.logic.azure.com/workflows/abc123.../triggers/manual/paths/invoke?api-version=2016-06-01&sp=...
```

#### 5.2 Atualizar config.js
```javascript
// Substituir no arquivo data/config.js
POWER_AUTOMATE: {
    BASE_URL: 'https://prod-XX.westus.logic.azure.com/workflows/',
    ENDPOINTS: {
        VALIDAR_LOGIN: 'https://prod-XX.westus.logic.azure.com/workflows/ID_FLOW_LOGIN/triggers/manual/paths/invoke?api-version=2016-06-01&sp=...',
        CRIAR_CHAMADO: 'https://prod-XX.westus.logic.azure.com/workflows/ID_FLOW_CHAMADO/triggers/manual/paths/invoke?api-version=2016-06-01&sp=...',
        LISTAR_CHAMADOS: 'https://prod-XX.westus.logic.azure.com/workflows/ID_FLOW_LISTAR/triggers/manual/paths/invoke?api-version=2016-06-01&sp=...'
    }
}
```

### 3. **Atualizar Configurações do Sistema**

No arquivo `data/config.js`, atualize as URLs:

```javascript
POWER_AUTOMATE: {
    BASE_URL: 'https://prod-XX.westus.logic.azure.com/workflows/',
    SHAREPOINT_URL: 'https://seudominio.sharepoint.com/sites/BalcaoCidadania',
    ONEDRIVE_URL: 'https://seudominio-my.sharepoint.com/personal/usuario_dominio_com/_layouts/15/Doc.aspx?sourcedoc={PLANILHA_ID}',
    ENDPOINTS: {
        CRIAR_CHAMADO: 'WORKFLOW_ID_1/triggers/manual/paths/invoke',
        ATUALIZAR_CHAMADO: 'WORKFLOW_ID_2/triggers/manual/paths/invoke',
        LISTAR_CHAMADOS: 'WORKFLOW_ID_3/triggers/manual/paths/invoke',
        VALIDAR_LOGIN: 'WORKFLOW_ID_4/triggers/manual/paths/invoke',
        CRIAR_USUARIO: 'WORKFLOW_ID_5/triggers/manual/paths/invoke',
        // ... outros endpoints
    }
}
```

---

## 🔐 **Autenticação e Segurança**

### 1. **Configurar Autenticação**
- Configure **Azure AD** para autenticação
- Use **Microsoft Graph API** para acessar dados
- Implemente **OAuth 2.0** para login seguro

### 2. **Permissões Necessárias**
```
Microsoft Graph:
- Files.ReadWrite.All (OneDrive/SharePoint)
- Sites.ReadWrite.All (SharePoint)
- User.Read (informações do usuário)

Power Automate:
- Acesso de administrador para criar flows
- Permissões de execução para usuários
```

### 3. **URLs Atualizadas nos CSPs**
Todos os Content Security Policies foram atualizados para:
```
https://login.microsoftonline.com
https://graph.microsoft.com
https://prod-xx.westus.logic.azure.com
https://seudominio.sharepoint.com
```

---

## 📊 **Estrutura de Dados Atualizada**

### Principais Mudanças:
1. **12 abas** ao invés de 7 (adicionadas eleições e profissionais)
2. **Campos específicos** para dados eleitorais
3. **Integração nativa** com Microsoft 365
4. **Backup automático** via OneDrive
5. **Colaboração em tempo real** via Excel Online

### Novas Funcionalidades:
- **Dashboards** integrados ao Power BI
- **Notificações** via Microsoft Teams
- **Relatórios automáticos** por email
- **Sincronização** entre dispositivos
- **Controle de versão** automático

---

## 🚀 **Passos para Deploy**

### 1. **Preparação**
```bash
# Clonar o repositório
git clone [repositorio]
cd BalcaoCidadania

# Verificar arquivos atualizados
ls -la MODELO_PLANILHAS_POWER_AUTOMATE.md
```

### 2. **Configurar SharePoint/OneDrive**
1. Criar site do SharePoint ou usar OneDrive pessoal
2. Upload da planilha estruturada
3. Configurar permissões de acesso
4. Obter IDs da planilha e site

### 3. **Criar Power Automate Flows**
1. Acessar [flow.microsoft.com](https://flow.microsoft.com)
2. Criar cada flow conforme templates acima
3. Testar endpoints individualmente
4. Configurar tratamento de erros

### 4. **Atualizar Sistema**
1. Editar `data/config.js` com URLs reais
2. Testar login e criação de chamados
3. Verificar relatórios e dashboards
4. Configurar backup e monitoramento

### 5. **Treinamento de Usuários**
1. Migrar dados existentes (se houver)
2. Treinar equipe nas novas funcionalidades
3. Configurar notificações no Teams
4. Estabelecer rotinas de backup

---

## 🔍 **Troubleshooting**

### Problemas Comuns:

#### **Erro de CORS**
```
Solução: Verificar configurações de CORS no Power Automate
Adicionar origem do site nas configurações do flow
```

#### **Falha na Autenticação**
```
Solução: Verificar permissões do Azure AD
Renovar tokens de acesso se necessário
```

#### **Dados não Sincronizam**
```
Solução: Verificar conectores do Power Automate
Testar conexão com SharePoint/OneDrive
```

#### **Performance Lenta**
```
Solução: Otimizar consultas nos flows
Implementar cache local quando possível
```

---

## 📈 **Próximos Passos**

### Melhorias Planejadas:
1. **Integração com Power BI** para dashboards avançados
2. **App móvel** com PowerApps
3. **Chatbot** para atendimento via Teams
4. **Automação** de relatórios mensais
5. **AI Builder** para análise de sentimento
6. **Integração** com WhatsApp Business API

### Monitoramento:
- **Analytics** via Application Insights
- **Logs** centralizados no Azure
- **Alertas** automáticos por email/Teams
- **Backup** diário automático

---

## 📝 **Changelog**

### Versão 2.1.0 - Migração Power Automate
- ✅ Migrado de Google Apps Script para Power Automate
- ✅ Atualizada estrutura de dados (12 abas)
- ✅ Implementadas novas funcionalidades eleitorais
- ✅ Configurados CSPs para Microsoft
- ✅ Criada documentação de migração
- ✅ Atualizados todos os endpoints e URLs

### Arquivos Principais Alterados:
- `MODELO_PLANILHAS_POWER_AUTOMATE.md` (novo)
- `data/config.js` (Power Automate config)
- `*.html` (CSPs atualizados)
- `scripts/dashboard.js` (referências atualizadas)
- `scripts/cadastro.js` (mensagens de erro)
- `README.md` (documentação)

### Arquivos Removidos (Limpeza):
- ❌ `MODELO_PLANILHAS_GOOGLE_SHEETS.md` - Modelo obsoleto do Google Sheets
- ❌ `sistema-pronto.html` - Página de demonstração não referenciada
- ✅ Corrigidas referências ao `drive.google.com` → `onedrive.live.com`

---

## 🤝 **Suporte**

Para dúvidas sobre a migração:
1. **Documentação**: Consultar este arquivo e o modelo de planilhas
2. **Testes**: Usar dados mock para validar funcionalidades
3. **Logs**: Verificar console do navegador e logs do Power Automate
4. **Comunidade**: Microsoft Power Platform Community

---

**🎯 Objetivo:** Manter todas as funcionalidades existentes enquanto aproveita as vantagens do ecossistema Microsoft 365 para colaboração, segurança e escalabilidade.

**📅 Timeline:** A migração é progressiva - o sistema continua funcionando offline até a implementação completa dos flows do Power Automate.
