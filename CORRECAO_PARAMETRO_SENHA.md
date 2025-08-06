# 🔧 CORREÇÃO CRÍTICA - PARÂMETRO DE AUTENTICAÇÃO

## Data: 06/08/2025

### 🎯 **PROBLEMA IDENTIFICADO E RESOLVIDO**

### ❌ **Problema:**
O frontend estava enviando o parâmetro `password` para a API, mas o Google Apps Script esperava `senha`.

### ✅ **Solução Aplicada:**

**Arquivo:** `scripts/flow.js`
**Linha:** ~195

**Antes (INCORRETO):**
```javascript
const data = await this.sendToScript({
    action: 'validateUser',
    email: email,
    password: password  // ❌ ERRO: API esperava "senha"
});
```

**Depois (CORRIGIDO):**
```javascript
const data = await this.sendToScript({
    action: 'validateUser',
    email: email,
    senha: password     // ✅ CORRETO: Agora usa "senha"
});
```

---

### 📊 **VALIDAÇÃO DA API**

A resposta da API confirma que está funcionando:

```json
{
  "success": true,
  "message": "API do Balcão da Cidadania está funcionando!",
  "version": "2.1.0 - PRODUÇÃO",
  "status": "online",
  "availableActions": {
    "POST": ["validateUser", "newUser", ...]
  }
}
```

---

### 🔄 **FLUXO DE AUTENTICAÇÃO CORRIGIDO**

1. **Frontend** → `auth.js` → `login()` 
2. **FlowManager** → `flow.js` → `validateUser(email, password)`
3. **API Request** → Google Apps Script com `{action: "validateUser", email, senha}`
4. **Google Apps Script** → Validação na planilha
5. **Response** → Retorna dados do usuário autenticado

---

### ⚠️ **IMPORTANTE**

- Esta correção resolve o problema de autenticação
- A API estava funcionando corretamente o tempo todo
- O erro estava apenas no nome do parâmetro enviado pelo frontend
- Agora o sistema deve permitir login normalmente

---

### 🧪 **TESTE RECOMENDADO**

1. Acesse a página de login
2. Digite credenciais válidas de um usuário da planilha
3. Clique em "Entrar"
4. O sistema deve agora autenticar corretamente

**Credenciais de teste sugeridas:**
- Email: [conforme cadastrado na planilha]
- Senha: [conforme cadastrado na planilha]
