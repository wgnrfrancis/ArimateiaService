# ⚡ Configuração Rápida - Google Apps Script

## 🔧 Passos Essenciais para Funcionamento

### 1. **Configurar URLs no config.js**
Edite o arquivo `data/config.js` e configure o Google Apps Script:

```javascript
GOOGLE_APPS_SCRIPT: {
    WEB_APP_URL: 'SUA_URL_DO_GOOGLE_APPS_SCRIPT_AQUI',
    SPREADSHEET_ID: 'SEU_ID_DA_PLANILHA_GOOGLE_SHEETS_AQUI',
    ACTIONS: {
        VALIDAR_USUARIO: 'validarUsuario',
        CRIAR_USUARIO: 'criarUsuario',
        GET_IGREJAS_REGIOES: 'getIgrejasRegioes',
        CRIAR_CHAMADO: 'criarChamado',
        GET_CHAMADOS: 'getChamados',
        GET_USUARIOS: 'getUsuarios'
    }
}
```

### 2. **Google Sheets Configurado**
- **Planilha Principal**: BalcaoCidadania_DB
- **Abas Necessárias**:
  - `USUARIOS` - Dados dos usuários
  - `CHAMADOS` - Tickets/chamados
  - `IGREJAS` - Lista de igrejas
  - `REGIOES` - Regiões disponíveis
  - `ATIVIDADES` - Log de atividades

### 3. **Funcionalidades Habilitadas**
✅ **Sistema de Login** - Autenticação via Google Apps Script
✅ **Cadastro de Voluntários** - Busca igrejas por região do Google Sheets
✅ **Gestão de Chamados** - CRUD completo via Google Apps Script  
✅ **Dashboard Dinâmico** - Baseado no cargo do usuário
✅ **Interface Responsiva** - Mobile/Desktop/Tablet

### 4. **Arquivos Removidos (Limpeza)**
🗑️ Removidos arquivos Power Automate obsoletos:
- `POWER_AUTOMATE_CODIGOS_COMPLETOS.md`
- `MODELO_PLANILHAS_POWER_AUTOMATE.md` 
- `MIGRACAO_POWER_AUTOMATE.md`
- `CONFIGURACAO_URLS_POWER_AUTOMATE.md`
- `performance-demo.html`
- `PERFORMANCE_PROFILING.md`
- `scripts/performance-integration.js`
- `scripts/performance-profiler.js`
- `scripts/flow-power-automate-clean.js`

### 5. **Próximos Passos**
1. **Configurar Google Apps Script** (use `CONFIGURACAO_GOOGLE_APPS_SCRIPT.md`)
2. **Criar planilha Google Sheets** com a estrutura necessária
3. **Testar o sistema** acessando `http://localhost:8000`
4. **Inserir dados iniciais** nas planilhas
5. **Validar integração** com Google Apps Script

## 📊 Status do Projeto
- 🟢 **Frontend**: 100% Pronto
- 🟢 **Integração Google Apps Script**: Configurado
- 🟡 **Google Apps Script**: Aguardando implantação
- 🟡 **Google Sheets**: Estrutura documentada, aguardando criação

## 🚀 Testando
```bash
python -m http.server 8000
# Acesse: http://localhost:8000
```

Credenciais de teste (enquanto os flows não estão ativos):
- **Email**: `teste@arimateia.org.br`
- **Senha**: `123456`
