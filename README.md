# Balcão da Cidadania - Sistema de Atendimento

Sistema de gestão para atendimento ao cidadão desenvolvido para a Igreja Evangélica Pentecostal Arimateia, integrado com Power Automate e OneDrive.

## 🚀 Como Executar

### Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional, mas recomendado)

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

### Estrutura de Dados - Power Automate

O sistema utiliza uma planilha no OneDrive com 12 abas específicas para integração via Power Automate:

1. **CHAMADOS** - Armazena todos os atendimentos
2. **OBSERVACOES_CHAMADOS** - Histórico detalhado de cada chamado
3. **CHAMADOS_EXCLUIDOS** - Exclusão lógica de registros
4. **USUARIOS** - Gerenciamento de voluntários e administradores
5. **CATEGORIAS_SERVICOS** - Categorias de atendimento
6. **IGREJAS_REGIOES** - Dados das 56 igrejas e regiões
7. **RELATORIOS_MENSAIS** - Consolidação mensal automática
8. **PROFISSIONAIS_LIBERAIS** - Profissionais voluntários
9. **ACESSORES** - Assessores parlamentares
10. **ELEICOES_DEPUTADOS** - Dados eleitorais para deputados
11. **ELEICOES_VEREADORES** - Dados eleitorais para vereadores
12. **ELEICOES_CONSELHO** - Dados para conselho regional

Ver arquivo `MODELO_PLANILHAS_POWER_AUTOMATE.md` para estrutura detalhada.

### Configuração em Produção:

1. **Crie a planilha** no OneDrive/SharePoint com a estrutura definida
2. **Configure Power Automate Flows** para cada endpoint de API
3. **Atualize URLs** no arquivo `data/config.js`
4. **Implemente autenticação** OAuth2 com Microsoft Graph
5. **Configure notificações** via Teams/Email
6. **Ative backup automático** dos dados

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
