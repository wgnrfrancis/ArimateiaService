# 🚀 Guia de Configuração - Google Apps Script

## 📋 Passo a Passo para Configurar a Integração

### 1️⃣ **Criar a Planilha no Google Sheets**

1. Acesse [sheets.google.com](https://sheets.google.com)
2. Crie uma nova planilha
3. Renomeie para **"Arimateia Service - Central de Dados"**
4. Crie as seguintes abas com os nomes EXATOS:

#### 📋 **ABA: CHAMADOS**
Colunas (A até T):
```
ID | DATA_ABERTURA | NOME_CIDADAO | CPF | CONTATO | EMAIL | IGREJA | REGIAO | DESCRICAO_DEMANDA | STATUS | PRIORIDADE | CATEGORIA | CRIADO_POR | CRIADO_POR_EMAIL | RESPONSAVEL_ATUAL | DATA_ULTIMA_ATUALIZACAO | OBSERVACOES | ANEXOS | TEMPO_RESOLUCAO | SATISFACAO_CIDADAO
```

#### 👥 **ABA: USUARIOS**
Colunas (A até O):
```
ID | NOME_COMPLETO | EMAIL | TELEFONE | CARGO | IGREJA | REGIAO | DATA_CADASTRO | STATUS | ULTIMO_ACESSO | TOTAL_CHAMADOS | CHAMADOS_RESOLVIDOS | TAXA_RESOLUCAO | CRIADO_POR | OBSERVACOES
```

#### 📝 **ABA: OBSERVACOES_CHAMADOS**
Colunas (A até J):
```
ID_OBSERVACAO | ID_CHAMADO | DATA_HORA | USUARIO | USUARIO_EMAIL | TIPO_ACAO | STATUS_ANTERIOR | STATUS_NOVO | OBSERVACAO | ANEXOS
```

#### 🗑️ **ABA: CHAMADOS_EXCLUIDOS**
Colunas (A até F):
```
ID_ORIGINAL | DATA_EXCLUSAO | EXCLUIDO_POR | EXCLUIDO_POR_EMAIL | MOTIVO_EXCLUSAO | DADOS_ORIGINAIS
```

#### 🏛️ **ABA: IGREJAS_REGIOES**
Colunas (A até J):
```
ID | NOME_IGREJA | REGIAO | ENDERECO | TELEFONE | PASTOR_RESPONSAVEL | COORDENADOR_LOCAL | STATUS | TOTAL_VOLUNTARIOS | TOTAL_ATENDIMENTOS
```

#### 📊 **ABA: CATEGORIAS_SERVICOS**
Colunas (A até G):
```
ID | NOME_CATEGORIA | DESCRICAO | COR_IDENTIFICACAO | ICONE | ATIVA | ORDEM_EXIBICAO
```

#### 📈 **ABA: RELATORIOS_MENSAIS**
Colunas (A até I):
```
ANO_MES | TOTAL_CHAMADOS | CHAMADOS_RESOLVIDOS | TAXA_RESOLUCAO | TEMPO_MEDIO_RESOLUCAO | TOTAL_VOLUNTARIOS_ATIVOS | IGREJA_MAIS_ATIVA | CATEGORIA_MAIS_DEMANDADA | SATISFACAO_MEDIA
```

---

### 2️⃣ **Configurar o Google Apps Script**

1. **Acesse**: [script.google.com](https://script.google.com)
2. **Clique em**: "Novo projeto"
3. **Renomeie** para: "Arimateia Service API"
4. **Apague** todo o código padrão
5. **Cole** o conteúdo do arquivo `GOOGLE_APPS_SCRIPT.js`
6. **Substitua** a linha 15:
   ```javascript
   const SPREADSHEET_ID = 'SEU_ID_DA_PLANILHA_AQUI';
   ```
   Pelo ID real da sua planilha (encontrado na URL do Google Sheets)

---

### 3️⃣ **Implantar como Web App**

1. **Clique em**: "Implantar" → "Nova implantação"
2. **Tipo**: Selecione "Aplicativo da Web"
3. **Descrição**: "API Arimateia Service"
4. **Executar como**: "Eu (seu email)"
5. **Quem tem acesso**: "Qualquer pessoa"
6. **Clique em**: "Implantar"
7. **Copie a URL** gerada (algo como: `https://script.google.com/macros/s/ABC123.../exec`)

---

### 4️⃣ **Configurar a Aplicação Web**

1. **Abra** o arquivo `data/config.js`
2. **Substitua** as configurações:
   ```javascript
   googleAppsScript: {
       webAppUrl: "SUA_URL_AQUI", // Cole a URL do passo anterior
       spreadsheetId: "SEU_ID_DA_PLANILHA", // ID da planilha
       endpoints: {
           // ... (já configurado)
       }
   }
   ```

---

### 5️⃣ **Testar a Integração**

1. **Execute** a aplicação: `npm start`
2. **Acesse**: http://localhost:8080
3. **Faça login** com qualquer email
4. **Crie um chamado** de teste
5. **Verifique** se apareceu na planilha

---

### 6️⃣ **Dados Iniciais Recomendados**

#### **ABA: USUARIOS** (adicione manualmente)
```
USR001 | Admin Sistema | admin@arimateia.org | (11) 99999-9999 | COORDENADOR | Igreja Central | Norte | 2024-01-01 | Ativo | | 0 | 0 | 0% | Sistema | Usuário administrador
```

#### **ABA: IGREJAS_REGIOES**
```
IGR001 | Igreja Central | Norte | Rua Principal, 123 | (11) 3333-4444 | Pastor João | Maria Silva | Ativa | 5 | 0
IGR002 | Igreja do Bairro Alto | Sul | Av. das Flores, 456 | (11) 5555-6666 | Pastor Pedro | Ana Costa | Ativa | 3 | 0
```

#### **ABA: CATEGORIAS_SERVICOS**
```
CAT001 | Documentação | Auxílio com documentos pessoais | #00c6ff | 📄 | TRUE | 1
CAT002 | Benefícios Sociais | Orientação sobre benefícios | #00bfff | 💰 | TRUE | 2
CAT003 | Jurídico | Orientação jurídica básica | #0099cc | ⚖️ | TRUE | 3
CAT004 | Saúde | Orientação sobre saúde | #ff6b6b | 🏥 | TRUE | 4
```

---

## 🔧 **Troubleshooting**

### ❌ **Erro: "Script function not found"**
- Verifique se o código foi colado corretamente
- Certifique-se de que salvou o projeto

### ❌ **Erro: "Permission denied"**
- Verifique as permissões do Google Apps Script
- Execute uma vez manualmente no editor para autorizar

### ❌ **Erro: "Spreadsheet not found"**
- Verifique se o ID da planilha está correto
- Certifique-se de que a planilha é acessível

### ❌ **Dados não aparecem na planilha**
- Verifique se os nomes das abas estão corretos
- Confira se as colunas estão na ordem certa

---

## 🎯 **Endpoints Disponíveis**

- `?action=newTicket` - Criar novo chamado
- `?action=updateTicket` - Atualizar chamado
- `?action=deleteTicket` - Excluir chamado (lógico)
- `?action=newUser` - Criar novo usuário
- `?action=validateUser` - Validar login
- `?action=getTickets` - Listar chamados
- `?action=getUsers` - Listar usuários
- `?action=generateReport` - Gerar relatório mensal

---

## 🚀 **Pronto!**

Após seguir todos os passos, sua aplicação estará integrada com Google Sheets de forma **100% gratuita** e funcional!

Para dúvidas ou problemas, verifique os logs no Google Apps Script em "Execuções".
