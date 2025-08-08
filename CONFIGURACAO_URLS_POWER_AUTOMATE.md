# 🔧 Configuração Final - URLs dos Power Automate Flows

## 📋 **LISTA DE FLOWS NECESSÁRIOS**

Você precisa criar os seguintes 8 flows no Power Automate e copiar suas URLs:

### **1. Flow: Validar Login**
- **Nome**: `BalcaoCidadania - Validar Login`
- **Trigger**: HTTP Request Manual
- **URL gerada**: `https://prod-XX.westus.logic.azure.com/workflows/ID1/triggers/manual/paths/invoke?api-version=2016-06-01&sp=...`

### **2. Flow: Criar Chamado**
- **Nome**: `BalcaoCidadania - Criar Chamado`
- **Trigger**: HTTP Request Manual
- **URL gerada**: `https://prod-XX.westus.logic.azure.com/workflows/ID2/triggers/manual/paths/invoke?api-version=2016-06-01&sp=...`

### **3. Flow: Listar Chamados**
- **Nome**: `BalcaoCidadania - Listar Chamados`
- **Trigger**: HTTP Request Manual
- **URL gerada**: `https://prod-XX.westus.logic.azure.com/workflows/ID3/triggers/manual/paths/invoke?api-version=2016-06-01&sp=...`

### **4. Flow: Atualizar Chamado**
- **Nome**: `BalcaoCidadania - Atualizar Chamado`
- **Trigger**: HTTP Request Manual
- **URL gerada**: `https://prod-XX.westus.logic.azure.com/workflows/ID4/triggers/manual/paths/invoke?api-version=2016-06-01&sp=...`

### **5. Flow: Criar Usuário**
- **Nome**: `BalcaoCidadania - Criar Usuario`
- **Trigger**: HTTP Request Manual
- **URL gerada**: `https://prod-XX.westus.logic.azure.com/workflows/ID5/triggers/manual/paths/invoke?api-version=2016-06-01&sp=...`

### **6. Flow: Obter Configurações**
- **Nome**: `BalcaoCidadania - Obter Configuracoes`
- **Trigger**: HTTP Request Manual
- **URL gerada**: `https://prod-XX.westus.logic.azure.com/workflows/ID6/triggers/manual/paths/invoke?api-version=2016-06-01&sp=...`

---

## ⚙️ **ATUALIZAR CONFIG.JS**

Após criar todos os flows, substitua as URLs no arquivo `data/config.js`:

```javascript
POWER_AUTOMATE: {
    BASE_URL: 'https://prod-XX.westus.logic.azure.com/workflows/',
    SHAREPOINT_URL: 'https://seudominio.sharepoint.com/sites/BalcaoCidadania',
    ONEDRIVE_URL: 'https://seudominio-my.sharepoint.com/personal/usuario_dominio_com/_layouts/15/Doc.aspx?sourcedoc={PLANILHA_ID}',
    
    ENDPOINTS: {
        // COLE AS URLS REAIS DOS SEUS FLOWS AQUI:
        VALIDAR_LOGIN: 'COLE_URL_FLOW_1_AQUI',
        CRIAR_CHAMADO: 'COLE_URL_FLOW_2_AQUI',
        LISTAR_CHAMADOS: 'COLE_URL_FLOW_3_AQUI',
        ATUALIZAR_CHAMADO: 'COLE_URL_FLOW_4_AQUI',
        CRIAR_USUARIO: 'COLE_URL_FLOW_5_AQUI',
        OBTER_CONFIGURACOES: 'COLE_URL_FLOW_6_AQUI'
    }
}
```

---

## 🏗️ **EXEMPLO PRÁTICO DE CONFIGURAÇÃO**

### **Passo 1: Criar Flow "Validar Login"**

1. Acesse [flow.microsoft.com](https://flow.microsoft.com)
2. Clique em **"Criar"** > **"Flow de nuvem instantâneo"**
3. Nome: `BalcaoCidadania - Validar Login`
4. Trigger: **"Quando uma solicitação HTTP é recebida"**
5. Clique em **"Criar"**

### **Passo 2: Configurar o Trigger**

1. Clique no trigger **"Quando uma solicitação HTTP é recebida"**
2. Cole este JSON no campo **"Esquema JSON do corpo da solicitação"**:

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
        },
        "timestamp": {
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

### **Passo 3: Adicionar Ação "Listar Linhas"**

1. Clique em **"+ Nova etapa"**
2. Pesquise por **"Excel Online"**
3. Selecione **"Listar linhas presentes em uma tabela"**
4. Configure:
   - **Localização**: OneDrive for Business
   - **Biblioteca de Documentos**: OneDrive
   - **Arquivo**: BalcaoCidadania.xlsx
   - **Tabela**: TabelaUsuarios

### **Passo 4: Adicionar Ação "Filtrar Array"**

1. Clique em **"+ Nova etapa"**
2. Pesquise por **"Controle de dados"**
3. Selecione **"Filtrar array"**
4. Configure:
   - **De**: value (do passo anterior)
   - **Condição**: Modo avançado
   - **Expressão**: `equals(item()?['EMAIL'], triggerBody()?['email'])`

### **Passo 5: Adicionar Condição**

1. Clique em **"+ Nova etapa"**
2. Pesquise por **"Controle"**
3. Selecione **"Condição"**
4. Configure:
   - **Esquerda**: `empty(body('Filtrar_array'))`
   - **Operador**: é igual a
   - **Direita**: `false`

### **Passo 6: Configurar Respostas**

**No ramo "Sim" (usuário encontrado):**

1. Adicione nova ação **"Condição"** para verificar senha:
   - **Esquerda**: `first(body('Filtrar_array'))?['SENHA']`
   - **Operador**: é igual a
   - **Direita**: `triggerBody()?['senha']`

2. **Se senha correta**, adicione ação **"Resposta"**:
   - **Código de status**: 200
   - **Cabeçalhos**: `{"Content-Type": "application/json"}`
   - **Corpo**:
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "user": {
    "id": "@{first(body('Filtrar_array'))?['ID']}",
    "nome": "@{first(body('Filtrar_array'))?['NOME_COMPLETO']}",
    "email": "@{first(body('Filtrar_array'))?['EMAIL']}",
    "cargo": "@{first(body('Filtrar_array'))?['CARGO']}",
    "igreja": "@{first(body('Filtrar_array'))?['IGREJA']}",
    "regiao": "@{first(body('Filtrar_array'))?['REGIAO']}"
  }
}
```

3. **Se senha incorreta**, adicione ação **"Resposta"**:
   - **Código de status**: 401
   - **Corpo**: `{"success": false, "message": "Senha incorreta"}`

**No ramo "Não" (usuário não encontrado):**

1. Adicione ação **"Resposta"**:
   - **Código de status**: 404
   - **Corpo**: `{"success": false, "message": "Usuário não encontrado"}`

### **Passo 7: Salvar e Testar**

1. Clique em **"Salvar"**
2. Volte para o trigger **"Quando uma solicitação HTTP é recebida"**
3. **COPIE A URL** que apareceu (esta é a URL que você vai colar no config.js)
4. Teste o flow enviando uma requisição POST

---

## 🧪 **TESTE DO SISTEMA**

Após configurar todos os flows, você pode testar usando os dados mock:

### **Usuário de Teste:**
- **Email**: `secretaria@arimateia.org.br`
- **Senha**: `123456`

### **Teste via Console do Navegador:**
```javascript
// Testar login
window.flowManager.validarLogin('secretaria@arimateia.org.br', '123456')
  .then(result => console.log('Resultado:', result))
  .catch(error => console.error('Erro:', error));
```

---

## 📊 **DADOS INICIAIS PARA PLANILHA**

### **Tabela USUARIOS (adicionar estas linhas):**

| ID | NOME_COMPLETO | EMAIL | SENHA | TELEFONE | CARGO | IGREJA | REGIAO | DATA_CADASTRO | STATUS |
|---|---|---|---|---|---|---|---|---|---|
| USR001 | Sistema Secretaria | secretaria@arimateia.org.br | 123456 | (18) 99999-0001 | SECRETARIA | CATEDRAL DA FÉ | CATEDRAL | 01/01/2024 | Ativo |
| USR002 | Sistema Coordenador | coordenador@arimateia.org.br | 123456 | (18) 99999-0002 | COORDENADOR | CATEDRAL DA FÉ | CATEDRAL | 01/01/2024 | Ativo |
| USR003 | Sistema Voluntário | voluntario@arimateia.org.br | 123456 | (18) 99999-0003 | VOLUNTARIO | Igreja Norte | Norte | 01/01/2024 | Ativo |

---

## ✅ **CHECKLIST FINAL**

- [ ] **Planilha Excel criada no OneDrive/SharePoint**
- [ ] **Tabelas criadas com cabeçalhos corretos**
- [ ] **3 usuários iniciais adicionados na tabela USUARIOS**
- [ ] **6 Flows Power Automate criados e testados**
- [ ] **URLs dos flows copiadas para data/config.js**
- [ ] **Sistema testado com login de usuário**
- [ ] **Criação de chamado testada**
- [ ] **Listagem de chamados funcionando**

**🎯 Resultado:** Sistema 100% funcional com Microsoft Power Automate!
