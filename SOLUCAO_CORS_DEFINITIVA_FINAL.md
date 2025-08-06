# 🔧 CORREÇÃO CORS - GOOGLE APPS SCRIPT

## Data: 06/08/2025

### 🚨 **PROBLEMA IDENTIFICADO:**
```
❌ Erro no login: Error: Erro de conexão: Failed to fetch
```

**Causa:** Política CORS (Cross-Origin Resource Sharing) bloqueando requisições do Netlify para Google Apps Script.

---

## ✅ **SOLUÇÃO OBRIGATÓRIA - GOOGLE APPS SCRIPT**

### 1. **Abra seu Google Apps Script:**
- Acesse: https://script.google.com
- Abra o projeto do Balcão da Cidadania
- Localize a função `doPost(e)` ou `doGet(e)`

### 2. **Adicione os headers CORS corretamente:**

**ANTES (INCORRETO):**
```javascript
function doPost(e) {
  // ... lógica da função ...
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}
```

**DEPOIS (CORRETO):**
```javascript
function doPost(e) {
  // ... lógica da função ...
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}
```

### 3. **Adicione também uma função doOptions():**
```javascript
function doOptions(e) {
  return ContentService
    .createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}
```

### 4. **Republique o Web App:**
1. Clique em **"Deploy"** → **"Manage Deployments"**
2. Clique no ícone de **"Edit"** (lápis) na versão ativa
3. Confirme:
   - **Execute as:** Me (seu email)
   - **Who has access:** Anyone
4. Clique em **"Deploy"**
5. Copie a nova URL se necessário

---

## 🔧 **CORREÇÃO FRONTEND APLICADA:**

**Arquivo:** `scripts/auth.js` - Linha ~115

**PROBLEMA:** Estrutura de resposta incorreta
- ❌ **Antes:** `result.data` 
- ✅ **Depois:** `result.user`

A API retorna `{success: true, user: {...}}`, mas o código procurava por `data`.

---

## 🧪 **TESTE APÓS CORREÇÃO:**

1. **Configure CORS no Google Apps Script** (passos 1-4 acima)
2. **Recarregue a página** do sistema
3. **Tente fazer login** com credenciais válidas
4. **Verifique o console** - não deve mais aparecer "Failed to fetch"

---

## ⚠️ **IMPORTANTE:**

### Credenciais de teste:
- Use email/senha de um usuário **cadastrado na planilha Google Sheets**
- Planilha ID: `1awSUcZPlvM0Ci5ecKWCG4uwDbR3ZT5ZeDOuVdOIGMuc`
- Aba: `USUARIOS`

### Estrutura esperada na planilha:
| Email | Senha | Nome | Cargo | Igreja | Regiao | Status |
|-------|-------|------|--------|---------|--------|---------|
| usuario@email.com | senha123 | Nome do Usuário | COORDENADOR | Igreja X | Norte | ATIVO |

---

## 🎯 **RESULTADO ESPERADO:**

Após aplicar o CORS no Google Apps Script:
- ✅ Requisições não serão mais bloqueadas
- ✅ Login funcionará normalmente  
- ✅ Usuario será autenticado e redirecionado
- ✅ Dashboard carregará dados reais

**O problema é 100% CORS - a API funciona, mas o navegador bloqueia por segurança!**
