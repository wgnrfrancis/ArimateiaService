# 🔧 CORREÇÃO CORS - Google Apps Script

## 🚨 PROBLEMA IDENTIFICADO: CORS (Cross-Origin Resource Sharing)

O erro `Failed to fetch` indica que o Google Apps Script não está retornando os headers CORS necessários para permitir requisições do seu site Netlify.

---

## ✅ **SOLUÇÃO COMPLETA - PASSO A PASSO**

### **1. 📋 Abrir Google Apps Script**
- Acesse: https://script.google.com/
- Encontre seu projeto "**Balcão da Cidadania**"
- Abra o arquivo `Code.gs`

### **2. 🔄 SUBSTITUIR TODO O CÓDIGO**
- **Apague** todo o conteúdo atual do `Code.gs`
- **Cole** o código do arquivo `GOOGLE_APPS_SCRIPT_EXEMPLO.js` (que foi atualizado)
- **Salve** o projeto (Ctrl + S)

### **3. ⚡ DIFERENÇAS CRÍTICAS DO NOVO CÓDIGO**

#### **ANTES (sem CORS):**
```javascript
return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
```

#### **DEPOIS (com CORS):**
```javascript
return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
```

### **4. 🔐 VERIFICAR CONFIGURAÇÕES DE ACESSO**
1. No Google Apps Script, clique em "**Implantar**" → "**Gerenciar implantações**"
2. Clique nos **três pontos** (...) da versão ativa
3. Clique em "**Editar**"
4. **CERTIFIQUE-SE** que está configurado:
   - ✅ **Executar como**: Eu (seu email)
   - ✅ **Quem tem acesso**: **Qualquer pessoa (mesmo anônima)**
5. Clique em "**Atualizar**" → "**Concluído**"

### **5. 🧪 TESTAR IMEDIATAMENTE**
```bash
# Teste básico no navegador:
https://script.google.com/macros/s/AKfycbyhWfNDw2fZtIe1rc2DlYZ-6wKK7dQXkY7ZFKC9YrA--b1ynmUosT-QQvLBwisql20/exec?action=test

# Deve retornar (com headers CORS):
{"success":true,"message":"API do Balcão da Cidadania está funcionando!"}
```

---

## 🎯 **NOVO CÓDIGO - PRINCIPAIS FUNÇÕES**

### **✅ Função CORS (Nova)**
```javascript
function createCorsResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")  // ← ESSENCIAL
    .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type, Accept")
    .setHeader("Access-Control-Max-Age", "3600");
}
```

### **✅ doPost Atualizado**
```javascript
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    
    if (action === 'testConnection') {
      return createCorsResponse({  // ← Usa CORS
        success: true,
        message: 'Conexão estabelecida com sucesso!'
      });
    }
    
    if (action === 'validateUser') {
      return validarUsuario(data.email, data.password);  // ← Com CORS
    }
    
    return createCorsResponse({
      success: false,
      error: 'Ação não reconhecida'
    });
    
  } catch (error) {
    return createCorsResponse({  // ← Sempre com CORS
      success: false,
      error: error.toString()
    });
  }
}
```

### **✅ doOptions (Novo - Para Preflight)**
```javascript
function doOptions(e) {
  return createCorsResponse({
    message: 'CORS preflight OK'
  });
}
```

---

## 🔍 **COMO VERIFICAR SE FUNCIONOU**

### **1. No Navegador (F12)**
1. Abra **Developer Tools** (F12)
2. Vá na aba **Network**
3. Tente fazer login no sistema
4. Procure pela requisição para o Google Apps Script
5. Clique na requisição → aba **Headers**
6. **Deve aparecer**:
   ```
   access-control-allow-origin: *
   access-control-allow-methods: GET, POST, OPTIONS
   access-control-allow-headers: Content-Type, Accept
   ```

### **2. Teste Direto**
```bash
# Cole no navegador:
https://script.google.com/macros/s/AKfycbyhWfNDw2fZtIe1rc2DlYZ-6wKK7dQXkY7ZFKC9YrA--b1ynmUosT-QQvLBwisql20/exec?action=test

# Se retornar JSON válido, está funcionando!
```

---

## ❌ **PROBLEMAS COMUNS E SOLUÇÕES**

### **"Failed to fetch" ainda aparece**
1. ✅ Limpe o cache do navegador
2. ✅ Confirme que salvou e atualizou a implantação
3. ✅ Teste a URL diretamente no navegador primeiro

### **"Authorization required"**
1. ✅ Mude "Quem tem acesso" para "Qualquer pessoa (mesmo anônima)"
2. ✅ Reautorize se necessário

### **Headers CORS não aparecem**
1. ✅ Certifique-se de usar `createCorsResponse()` em todas as funções
2. ✅ Verifique se o código foi salvo corretamente

---

## 🎉 **RESULTADO ESPERADO**

Após aplicar essas correções:

1. ✅ **Login via Google Apps Script funciona** (sem erro CORS)
2. ✅ **Fallback para mock continua** (se houver outros problemas)
3. ✅ **Headers CORS corretos** (visíveis no Network tab)
4. ✅ **Sistema totalmente funcional**

---

## 📞 **VERIFICAÇÃO FINAL**

Execute este checklist:

- [ ] Código do `GOOGLE_APPS_SCRIPT_EXEMPLO.js` copiado para Google Apps Script
- [ ] Função `createCorsResponse()` presente em todas as respostas
- [ ] Implantação atualizada com "Qualquer pessoa (mesmo anônima)"
- [ ] Teste de URL direta funcionando: `/exec?action=test`
- [ ] Headers CORS visíveis no Developer Tools
- [ ] Login no sistema funcionando sem erros

**🚀 Se todos os itens estão ✅, o sistema está funcionando perfeitamente!**
