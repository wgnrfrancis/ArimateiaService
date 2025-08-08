# ⚡ Configuração Rápida - Power Automate

## 🔧 Passos Essenciais para Funcionamento

### 1. **Configurar URLs no config.js**
Edite o arquivo `data/config.js` e substitua as URLs pelos seus Power Automate Flows:

```javascript
POWER_AUTOMATE: {
    ENDPOINTS: {
        VALIDAR_LOGIN: 'SUA_URL_AQUI',
        CRIAR_CHAMADO: 'SUA_URL_AQUI',
        LISTAR_CHAMADOS: 'SUA_URL_AQUI', 
        ATUALIZAR_CHAMADO: 'SUA_URL_AQUI',
        CRIAR_USUARIO: 'SUA_URL_AQUI',
        OBTER_IGREJAS: 'SUA_URL_AQUI'
    }
}
```

### 2. **Planilha OneDrive Configurada**
- **URL Atual**: https://igrejauniversaldorei-my.sharepoint.com/:x:/g/personal/wagduarte_universal_org/EWjS3RVFYzZMiwuVhdxYoeYBOKTYSFe3P7a29TS9zn5qgw
- **Aba IGREJAS_REGIOES** deve ter colunas:
  - `ID` (número)
  - `NOME_IGREJA` (texto)
  - `REGIAO` (texto)

### 3. **Funcionalidades Habilitadas**
✅ **Sistema de Login** - Autenticação via Power Automate
✅ **Cadastro de Voluntários** - Busca igrejas por região do OneDrive
✅ **Gestão de Chamados** - CRUD completo via Power Automate  
✅ **Dashboard Dinâmico** - Baseado no cargo do usuário
✅ **Interface Responsiva** - Mobile/Desktop/Tablet

### 4. **Arquivos Removidos (Limpeza)**
🗑️ Removidos arquivos obsoletos:
- `# Code Citations.md`
- `MODELO_PLANILHAS_GOOGLE_SHEETS.md`
- `performance-demo.html`
- `PERFORMANCE_PROFILING.md`
- `scripts/performance-integration.js`
- `scripts/performance-profiler.js`
- `scripts/flow-power-automate-clean.js`

### 5. **Próximos Passos**
1. **Criar os Power Automate Flows** (use `CONFIGURACAO_URLS_POWER_AUTOMATE.md`)
2. **Testar o sistema** acessando `http://localhost:8000`
3. **Configurar autenticação Microsoft** (opcional)
4. **Validar integração** com planilha OneDrive

## 📊 Status do Projeto
- 🟢 **Frontend**: 100% Pronto
- 🟢 **Integração Power Automate**: Configurado
- 🟡 **Flows Power Automate**: Aguardando criação
- 🟡 **Planilha OneDrive**: Estrutura pronta, dados pendentes

## 🚀 Testando
```bash
python -m http.server 8000
# Acesse: http://localhost:8000
```

Credenciais de teste (enquanto os flows não estão ativos):
- **Email**: `teste@arimateia.org.br`
- **Senha**: `123456`
