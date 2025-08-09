# Balcão da Cidadania - Sistema de Atendimento

Sistema de gestão para atendimento ao cidadão desenvolvido para a Igreja Evangélica Pentecostal Arimateia, **100% integrado com Google Apps Script e Google Sheets**.

## 🚀 Como Executar

### Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional, mas recomendado)
- **Google Apps Script configurado**
- **Planilha OneDrive/SharePoint com estrutura específica**

### Execução Local

1. **Método Simples:**
   - Abra o arquivo `index.html` diretamente no navegador

2. **Método Recomendado (com servidor local):**
   ```bash
   # Com Python
   python -m http.server 8000
   
   # Com Node.js
   npx serve .
   
   # Com PHP
   php -S localhost:8000
   ```
   Depois acesse: `http://localhost:8000`

## 🔗 Configuração Google Apps Script

### URLs Configuradas:
O sistema já está configurado com as seguintes URLs no arquivo `data/config.js`:

```javascript
GOOGLE_APPS_SCRIPT: {
    WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbxsTSKVi7fdARhyGDWrIdKbpe2K-56OLa0g2LCpaiYd4m1V3ChDYl68J_s3V2eN-u82/exec',
    SPREADSHEET_ID: '1awSUcZPlvM0Ci5ecKWCG4uwDbR3ZT5ZeDOuVdOIGMuc',
    SPREADSHEET_URL: 'https://docs.google.com/spreadsheets/d/1awSUcZPlvM0Ci5ecKWCG4uwDbR3ZT5ZeDOuVdOIGMuc/edit'
}
```

### Google Sheets:
- **URL da Planilha**: https://docs.google.com/spreadsheets/d/1awSUcZPlvM0Ci5ecKWCG4uwDbR3ZT5ZeDOuVdOIGMuc/edit
- **Abas Necessárias**: `USUARIOS`, `CHAMADOS`, `IGREJAS`, `REGIOES`, `ATIVIDADES`

Ver documentação completa: `CONFIGURACAO_GOOGLE_APPS_SCRIPT.md`

## 🔐 Credenciais de Acesso

### Usuários Disponíveis:

- **Secretaria**: `secretaria@arimateia.org.br` / `123456`
- **Coordenador**: `coordenador@arimateia.org.br` / `123456`
- **Voluntário**: `voluntario@arimateia.org.br` / `123456`

## 📋 Funcionalidades

### ✅ Sistema de Autenticação
- Login/logout seguro
- Controle de permissões por cargo
- Sessões persistentes

### ✅ Gestão de Chamados
- Criação e edição de chamados
- Sistema de categorias e demandas
- Controle de status e prioridades
- Filtros avançados

### ✅ Interface da Secretaria
- Visão completa de todos os chamados
- 3 modos de visualização (cards, tabela, kanban)
- Atribuição de profissionais
- Exportação para CSV
- KPIs em tempo real

### ✅ Balcão de Atendimento
- Interface otimizada para atendimento
- Registro rápido de chamados
- Busca em tempo real
- Paginação inteligente

### ✅ Dashboard
- Estatísticas por cargo
- Navegação baseada em permissões
- Cards dinâmicos
- Sistema de notificações

### ✅ Design Responsivo
- Mobile-first
- Adaptação para tablet e desktop
- Interface acessível (WCAG)
- Temas consistentes

## 🛠️ Estrutura do Projeto

```
BalcaoCidadania/
├── index.html              # Página de login
├── dashboard.html          # Dashboard principal
├── secretaria.html         # Interface da secretaria
├── balcao.html            # Interface do balcão
├── cadastro.html          # Cadastro de voluntários
├── data/
│   └── config.js          # Configurações do sistema
├── scripts/
│   ├── auth.js           # Sistema de autenticação
│   ├── helpers.js        # Funções utilitárias
│   ├── flow.js          # Integração com APIs
│   ├── login.js         # Gerenciamento de login
│   ├── secretaria.js    # Interface da secretaria
│   └── balcao.js        # Interface do balcão
├── assets/
│   ├── style.css        # CSS principal
│   └── favicon.ico      # Ícone do sistema
└── templates/           # Templates HTML
```

## 🔧 Configuração

### Estrutura de Dados - Google Apps Script

O sistema utiliza uma planilha no Google Sheets com abas específicas para integração via Google Apps Script:

1. **USUARIOS** - Gerenciamento de voluntários e administradores
2. **CHAMADOS** - Armazena todos os atendimentos
3. **IGREJAS** - Dados das igrejas cadastradas
4. **REGIOES** - Regiões disponíveis
5. **ATIVIDADES** - Log de atividades do sistema

Ver arquivo `CONFIGURACAO_GOOGLE_APPS_SCRIPT.md` para estrutura detalhada.

### Configuração em Produção:

1. **Crie a planilha** no Google Sheets com a estrutura definida
2. **Configure Google Apps Script** com o código fornecido
3. **Implemente a Web App** e obtenha a URL
4. **Atualize URLs** no arquivo `data/config.js` (já configurado)
5. **Teste as funcionalidades** do sistema
6. **Configure permissões** adequadas na planilha

## 📊 Dados Mock

O sistema inclui:
- 9 regiões atendidas
- 15 igrejas cadastradas
- 7 categorias de atendimento
- 70+ demandas específicas
- 50 chamados de exemplo
- 4 usuários de teste

## 🎯 Navegação do Sistema

1. **Faça login** com uma das credenciais
2. **Acesse o dashboard** baseado no seu cargo
3. **Use a secretaria** para gestão completa (secretaria/coordenador)
4. **Use o balcão** para atendimento rápido
5. **Cadastre voluntários** via formulário próprio

## 📱 Compatibilidade

- **Navegadores**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Dispositivos**: Desktop, Tablet, Mobile
- **Acessibilidade**: Padrões WCAG 2.1

## 📄 Licença

Desenvolvido para Igreja Evangélica Pentecostal Arimateia
Versão 2.0.0 - 2025
