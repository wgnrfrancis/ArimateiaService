# 🏗️ Arquitetura do Sistema - Arimateia Service

## 📋 **Visão Geral**

O **Arimateia Service** é um sistema web completo que utiliza **exclusivamente Google Apps Script** como backend, eliminando a necessidade de servidores externos ou Power Automate.

---

## 🔧 **Componentes da Arquitetura**

### **1. Frontend (Aplicação Web)**
- **Tecnologia**: HTML5, CSS3, JavaScript (Vanilla)
- **Localização**: Arquivos estáticos locais
- **Funcionalidades**: Interface do usuário, validações, navegação

### **2. Backend (Google Apps Script)**
- **Tecnologia**: Google Apps Script (JavaScript no Google Cloud)
- **Funcionalidade**: API REST, processamento de dados, validações
- **Deploy**: Web App publicado no Google Apps Script

### **3. Banco de Dados (Google Sheets)**
- **Tecnologia**: Google Sheets como banco de dados
- **Estrutura**: 7 abas organizadas com dados estruturados
- **Vantagens**: Interface visual, backups automáticos, colaboração

---

## 🔄 **Fluxo de Dados**

```
[Interface Web] 
       ↓
[HTTP POST/GET]
       ↓
[Google Apps Script Web App]
       ↓
[Processamento & Validação]
       ↓
[Google Sheets (Database)]
       ↓
[Resposta JSON]
       ↓
[Interface Web Atualizada]
```

---

## 📡 **Comunicação Frontend ↔ Backend**

### **FlowManager (scripts/flow.js)**
Classe responsável por toda comunicação com o Google Apps Script:

```javascript
class FlowManager {
    // Configuração
    baseUrl: CONFIG.googleAppsScript.webAppUrl
    
    // Métodos principais
    - sendToScript()      // Comunicação base
    - createTicket()      // Criar chamados
    - updateTicket()      // Atualizar chamados
    - deleteTicket()      // Excluir chamados
    - createUser()        // Criar usuários
    - validateUser()      // Login/autenticação
    - getTickets()        // Listar chamados
    - getUsers()          // Listar usuários
    - generateReport()    // Gerar relatórios
}
```

### **Endpoints Disponíveis**
Todas as operações são realizadas via HTTP POST para a URL do Web App:

| Action | Função | Descrição |
|--------|--------|-----------|
| `newTicket` | createNewTicket() | Criar novo chamado |
| `updateTicket` | updateTicket() | Atualizar chamado existente |
| `deleteTicket` | deleteTicket() | Exclusão lógica de chamado |
| `newUser` | createNewUser() | Criar novo usuário |
| `validateUser` | validateUser() | Validar login |
| `getTickets` | getTickets() | Listar chamados com filtros |
| `getUsers` | getUsers() | Listar usuários |
| `generateReport` | generateReport() | Gerar relatório mensal |

---

## 🗄️ **Estrutura do Banco de Dados (Google Sheets)**

### **ABA: CHAMADOS** (Tabela Principal)
- **Função**: Armazenar todos os chamados do sistema
- **Colunas**: 20 campos (ID → SATISFACAO_CIDADAO)
- **Chave Primária**: ID (formato: CH + timestamp)

### **ABA: USUARIOS** (Autenticação e Perfis)
- **Função**: Gerenciar usuários e autenticação
- **Colunas**: 16 campos (ID → OBSERVACOES)
- **Autenticação**: Email + Senha (hash simples)

### **ABA: OBSERVACOES_CHAMADOS** (Log de Atividades)
- **Função**: Histórico de alterações em chamados
- **Relacionamento**: 1:N com CHAMADOS (via ID_CHAMADO)

### **ABA: CHAMADOS_EXCLUIDOS** (Exclusão Lógica)
- **Função**: Manter histórico de chamados excluídos
- **Política**: Nenhum dado é perdido definitivamente

### **ABA: CATEGORIAS_SERVICOS** (Configuração)
- **Função**: Tipos de serviços oferecidos
- **Uso**: Dropdown nas interfaces, relatórios

### **ABA: IGREJAS_REGIOES** (Configuração)
- **Função**: Estrutura organizacional
- **Uso**: Filtros regionais, estatísticas

### **ABA: RELATORIOS_MENSAIS** (Analytics)
- **Função**: Dados consolidados mensais
- **Geração**: Automática via Google Apps Script

---

## 🔐 **Sistema de Autenticação**

### **Fluxo de Login**
1. **Frontend**: Captura email/senha do formulário
2. **FlowManager**: Envia dados via POST para `validateUser`
3. **Google Apps Script**: Busca na aba USUARIOS
4. **Validação**: Confere email + senha + status ativo
5. **Resposta**: Retorna dados do usuário ou erro
6. **Frontend**: Armazena sessão local e redireciona

### **Controle de Sessão**
- **Armazenamento**: localStorage do navegador
- **Duração**: 8 horas (configurável)
- **Dados Salvos**: ID, nome, email, cargo, igreja, região

### **Níveis de Acesso**
- **VOLUNTARIO**: Dashboard, criar chamados
- **SECRETARIA**: + visualizar/editar todos os chamados
- **COORDENADOR**: + gerenciar usuários, relatórios, configurações

---

## ⚡ **Vantagens da Arquitetura**

### **✅ Gratuito**
- Google Apps Script: Gratuito até 6 min/execução
- Google Sheets: Gratuito até 100 MB
- Hospedagem: Não necessária (arquivos locais)

### **✅ Escalável**
- Suporta milhares de registros
- Performance adequada para organizações médias
- Backup automático do Google

### **✅ Manutenível**
- Interface visual (Google Sheets)
- Logs automáticos no Google Apps Script
- Código organizado e documentado

### **✅ Seguro**
- Autenticação via Google
- Permissões granulares
- Histórico de todas as operações

---

## 🚀 **Deploy e Configuração**

### **1. Google Sheets**
1. Criar planilha com as 7 abas
2. Definir cabeçalhos conforme documentação
3. Adicionar dados iniciais de teste

### **2. Google Apps Script**
1. Criar novo projeto
2. Colar código do arquivo `GOOGLE_APPS_SCRIPT.js`
3. Configurar SPREADSHEET_ID
4. Publicar como Web App
5. Copiar URL gerada

### **3. Frontend**
1. Atualizar `data/config.js` com a URL do Web App
2. Configurar domínio se necessário
3. Testar integração

---

## 🔧 **Troubleshooting**

### **Erro: "Script function not found"**
- ✅ Verificar se o código foi salvo corretamente
- ✅ Confirmar se a função doPost() existe

### **Erro: "Permission denied"**
- ✅ Executar função manualmente para autorizar
- ✅ Verificar permissões da planilha

### **Erro: "Spreadsheet not found"**
- ✅ Confirmar SPREADSHEET_ID no script
- ✅ Verificar se planilha é acessível

### **Dados não salvam**
- ✅ Verificar logs no Google Apps Script
- ✅ Confirmar estrutura das abas
- ✅ Testar endpoints individualmente

---

## 📈 **Performance e Limites**

### **Google Apps Script**
- **Tempo máximo**: 6 minutos por execução
- **Execuções diárias**: 20.000 (gratuito)
- **Triggers**: 20 por script

### **Google Sheets**
- **Células**: 10 milhões por planilha
- **Linhas**: ~400.000 (recomendado)
- **Colaboradores**: Até 100 simultâneos

### **Recomendações**
- **Chamados**: Até 50.000 registros ativos
- **Usuários**: Até 1.000 usuários
- **Relatórios**: Gerar mensalmente (não em tempo real)

---

## 🏗️ **Arquitetura 100% Google, 0% Dependências Externas**

Esta arquitetura garante que o sistema funcione completamente dentro do ecossistema Google, sem necessidade de:
- ❌ Servidores externos
- ❌ Power Automate
- ❌ Banco de dados tradicional
- ❌ Hospedagem paga
- ❌ Configurações complexas

**Resultado**: Sistema robusto, gratuito e fácil de manter! 🎉
