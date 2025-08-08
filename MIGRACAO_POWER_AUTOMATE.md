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

### 2. **Configurar Power Automate Flows**

#### Flow 1: **Criar Chamado**
```
Trigger: HTTP Request (Manual)
Actions:
1. Parse JSON (dados do chamado)
2. Add row to table (aba CHAMADOS)
3. Add row to table (aba OBSERVACOES_CHAMADOS)
4. Respond to PowerApp or flow
```

#### Flow 2: **Atualizar Chamado**
```
Trigger: HTTP Request (Manual)
Actions:
1. Parse JSON (ID do chamado + novos dados)
2. List rows present in a table (filtrar por ID)
3. Update a row (aba CHAMADOS)
4. Add row to table (aba OBSERVACOES_CHAMADOS)
5. Respond to PowerApp or flow
```

#### Flow 3: **Listar Chamados**
```
Trigger: HTTP Request (Manual)
Actions:
1. Parse JSON (filtros opcionais)
2. List rows present in a table (aba CHAMADOS)
3. Apply to each (filtrar dados se necessário)
4. Respond to PowerApp or flow (retornar JSON)
```

#### Flow 4: **Validar Login**
```
Trigger: HTTP Request (Manual)
Actions:
1. Parse JSON (email + senha)
2. List rows present in a table (aba USUARIOS)
3. Filter array (email matching)
4. Condition (verificar senha hash)
5. Respond to PowerApp or flow (user data ou erro)
```

#### Flow 5: **Criar Usuário**
```
Trigger: HTTP Request (Manual)
Actions:
1. Parse JSON (dados do usuário)
2. List rows present in a table (verificar email único)
3. Condition (email já existe?)
4. Add row to table (aba USUARIOS)
5. Respond to PowerApp or flow
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
