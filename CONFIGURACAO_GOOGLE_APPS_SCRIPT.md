# Configuração Google Apps Script - Balcão da Cidadania

## 📋 Visão Geral

Este documento contém as instruções para configurar o sistema Balcão da Cidadania usando Google Apps Script e Google Sheets como backend.

## 🔧 Pré-requisitos

- Conta Google
- Acesso ao Google Drive
- Acesso ao Google Apps Script
- Conhecimento básico de JavaScript

## 📊 Estrutura das Planilhas

### Planilha Principal: "BalcaoCidadania_DB"

Crie uma planilha no Google Sheets com as seguintes abas:

#### 1. **USUARIOS** (Aba para usuários)
```
A: ID | B: Nome | C: Email | D: Senha | E: Tipo | F: Igreja | G: Regiao | H: Status | I: DataCriacao | J: UltimoLogin
```

#### 2. **CHAMADOS** (Aba para tickets/chamados)
```
A: ID | B: Titulo | C: Descricao | D: Categoria | E: Status | F: Prioridade | G: UsuarioID | H: AssignadoPara | I: DataCriacao | J: DataAtualizacao
```

#### 3. **IGREJAS** (Aba para igrejas)
```
A: ID | B: Nome | C: Regiao | D: Endereco | E: Telefone | F: Pastor | G: Status | H: DataCriacao
```

#### 4. **REGIOES** (Aba para regiões)
```
A: ID | B: Nome | C: Descricao | D: Coordenador | E: Status | F: DataCriacao
```

#### 5. **ATIVIDADES** (Aba para log de atividades)
```
A: ID | B: UsuarioID | C: Acao | D: Modulo | E: Detalhes | F: IP | G: DataHora
```

## 🚀 Configuração do Google Apps Script

### Passo 1: Criar o Projeto

1. Acesse [script.google.com](https://script.google.com)
2. Clique em "Novo projeto"
3. Renomeie para "BalcaoCidadania_API"

### Passo 2: Configurar o Código Principal

Cole o seguinte código no arquivo `Code.gs`:

```javascript
/**
 * Balcão da Cidadania - Google Apps Script API
 * Sistema de gerenciamento de voluntários e tickets
 */

// Configurações da planilha
const SPREADSHEET_ID = 'SEU_SPREADSHEET_ID_AQUI'; // Substitua pelo ID da sua planilha

// Constantes das abas
const ABAS = {
  USUARIOS: 'USUARIOS',
  CHAMADOS: 'CHAMADOS', 
  IGREJAS: 'IGREJAS',
  REGIOES: 'REGIOES',
  ATIVIDADES: 'ATIVIDADES'
};

/**
 * Função principal que processa todas as requisições
 */
function doPost(e) {
  try {
    const dados = JSON.parse(e.postData.contents);
    const acao = dados.action;
    
    console.log('Ação recebida:', acao, dados);
    
    switch (acao) {
      case 'validarUsuario':
        return validarUsuario(dados.email, dados.senha);
        
      case 'criarUsuario':
        return criarUsuario(dados);
        
      case 'getIgrejasRegioes':
        return getIgrejasRegioes();
        
      case 'criarChamado':
        return criarChamado(dados);
        
      case 'getChamados':
        return getChamados(dados.filtros || {});
        
      case 'getUsuarios':
        return getUsuarios();
        
      default:
        return criarResposta(false, 'Ação não reconhecida: ' + acao);
    }
    
  } catch (error) {
    console.error('Erro no doPost:', error);
    return criarResposta(false, 'Erro interno do servidor: ' + error.message);
  }
}

/**
 * Função para GET requests
 */
function doGet(e) {
  return ContentService
    .createTextOutput('API Balcão da Cidadania - Sistema funcionando!')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Valida credenciais do usuário
 */
function validarUsuario(email, senha) {
  try {
    const planilha = SpreadsheetApp.openById(SPREADSHEET_ID);
    const aba = planilha.getSheetByName(ABAS.USUARIOS);
    const dados = aba.getDataRange().getValues();
    
    // Procura o usuário
    for (let i = 1; i < dados.length; i++) {
      const linha = dados[i];
      if (linha[2] === email && linha[3] === senha && linha[7] === 'ATIVO') {
        // Atualiza último login
        aba.getRange(i + 1, 10).setValue(new Date());
        
        const usuario = {
          id: linha[0],
          nome: linha[1],
          email: linha[2],
          tipo: linha[4],
          igreja: linha[5],
          regiao: linha[6]
        };
        
        return criarResposta(true, 'Login realizado com sucesso', usuario);
      }
    }
    
    return criarResposta(false, 'Email ou senha incorretos');
    
  } catch (error) {
    console.error('Erro na validação:', error);
    return criarResposta(false, 'Erro ao validar usuário');
  }
}

/**
 * Cria novo usuário
 */
function criarUsuario(dados) {
  try {
    const planilha = SpreadsheetApp.openById(SPREADSHEET_ID);
    const aba = planilha.getSheetByName(ABAS.USUARIOS);
    
    // Gera novo ID
    const ultimaLinha = aba.getLastRow();
    const novoId = ultimaLinha === 1 ? 1 : aba.getRange(ultimaLinha, 1).getValue() + 1;
    
    // Verifica se email já existe
    const dadosExistentes = aba.getDataRange().getValues();
    for (let i = 1; i < dadosExistentes.length; i++) {
      if (dadosExistentes[i][2] === dados.email) {
        return criarResposta(false, 'Email já cadastrado');
      }
    }
    
    // Adiciona novo usuário
    aba.appendRow([
      novoId,
      dados.nomeCompleto,
      dados.email,
      dados.senha,
      dados.tipo || 'VOLUNTARIO',
      dados.igreja,
      dados.regiao,
      'ATIVO',
      new Date(),
      null
    ]);
    
    return criarResposta(true, 'Usuário criado com sucesso', { id: novoId });
    
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return criarResposta(false, 'Erro ao criar usuário');
  }
}

/**
 * Busca igrejas e regiões
 */
function getIgrejasRegioes() {
  try {
    const planilha = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Busca regiões
    const abaRegioes = planilha.getSheetByName(ABAS.REGIOES);
    const dadosRegioes = abaRegioes.getDataRange().getValues();
    const regioes = [];
    
    for (let i = 1; i < dadosRegioes.length; i++) {
      const linha = dadosRegioes[i];
      if (linha[4] === 'ATIVO') {
        regioes.push({
          id: linha[0],
          nome: linha[1],
          descricao: linha[2]
        });
      }
    }
    
    // Busca igrejas
    const abaIgrejas = planilha.getSheetByName(ABAS.IGREJAS);
    const dadosIgrejas = abaIgrejas.getDataRange().getValues();
    const igrejas = [];
    
    for (let i = 1; i < dadosIgrejas.length; i++) {
      const linha = dadosIgrejas[i];
      if (linha[6] === 'ATIVO') {
        igrejas.push({
          id: linha[0],
          nome: linha[1],
          regiao: linha[2],
          endereco: linha[3],
          pastor: linha[5]
        });
      }
    }
    
    return criarResposta(true, 'Dados carregados', { regioes, igrejas });
    
  } catch (error) {
    console.error('Erro ao buscar igrejas/regiões:', error);
    return criarResposta(false, 'Erro ao carregar dados');
  }
}

/**
 * Cria um novo chamado
 */
function criarChamado(dados) {
  try {
    const planilha = SpreadsheetApp.openById(SPREADSHEET_ID);
    const aba = planilha.getSheetByName(ABAS.CHAMADOS);
    
    // Gera novo ID
    const ultimaLinha = aba.getLastRow();
    const novoId = ultimaLinha === 1 ? 1 : aba.getRange(ultimaLinha, 1).getValue() + 1;
    
    // Adiciona novo chamado
    aba.appendRow([
      novoId,
      dados.titulo,
      dados.descricao,
      dados.categoria,
      'ABERTO',
      dados.prioridade || 'MEDIA',
      dados.usuarioId,
      null, // Assignado para
      new Date(),
      new Date()
    ]);
    
    return criarResposta(true, 'Chamado criado com sucesso', { id: novoId });
    
  } catch (error) {
    console.error('Erro ao criar chamado:', error);
    return criarResposta(false, 'Erro ao criar chamado');
  }
}

/**
 * Busca chamados com filtros
 */
function getChamados(filtros = {}) {
  try {
    const planilha = SpreadsheetApp.openById(SPREADSHEET_ID);
    const aba = planilha.getSheetByName(ABAS.CHAMADOS);
    const dados = aba.getDataRange().getValues();
    
    const chamados = [];
    
    for (let i = 1; i < dados.length; i++) {
      const linha = dados[i];
      
      // Aplica filtros se especificados
      if (filtros.status && linha[4] !== filtros.status) continue;
      if (filtros.categoria && linha[3] !== filtros.categoria) continue;
      if (filtros.usuarioId && linha[6] !== filtros.usuarioId) continue;
      
      chamados.push({
        id: linha[0],
        titulo: linha[1],
        descricao: linha[2],
        categoria: linha[3],
        status: linha[4],
        prioridade: linha[5],
        usuarioId: linha[6],
        assignadoPara: linha[7],
        dataCriacao: linha[8],
        dataAtualizacao: linha[9]
      });
    }
    
    return criarResposta(true, 'Chamados carregados', chamados);
    
  } catch (error) {
    console.error('Erro ao buscar chamados:', error);
    return criarResposta(false, 'Erro ao carregar chamados');
  }
}

/**
 * Busca todos os usuários
 */
function getUsuarios() {
  try {
    const planilha = SpreadsheetApp.openById(SPREADSHEET_ID);
    const aba = planilha.getSheetByName(ABAS.USUARIOS);
    const dados = aba.getDataRange().getValues();
    
    const usuarios = [];
    
    for (let i = 1; i < dados.length; i++) {
      const linha = dados[i];
      if (linha[7] === 'ATIVO') {
        usuarios.push({
          id: linha[0],
          nome: linha[1],
          email: linha[2],
          tipo: linha[4],
          igreja: linha[5],
          regiao: linha[6],
          dataCriacao: linha[8],
          ultimoLogin: linha[9]
        });
      }
    }
    
    return criarResposta(true, 'Usuários carregados', usuarios);
    
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return criarResposta(false, 'Erro ao carregar usuários');
  }
}

/**
 * Função auxiliar para criar resposta padronizada
 */
function criarResposta(sucesso, mensagem, dados = null) {
  const resposta = {
    success: sucesso,
    message: mensagem,
    data: dados,
    timestamp: new Date().toISOString()
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(resposta))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### Passo 3: Configurar a Web App

1. No editor do Apps Script, clique em "Implementar" > "Nova implementação"
2. Escolha tipo: "Aplicativo da Web"
3. Descrição: "API Balcão da Cidadania"
4. Executar como: "Eu (seu email)"
5. Quem tem acesso: "Qualquer pessoa"
6. Clique em "Implementar"
7. Copie a URL da Web App

### Passo 4: Configurar no Sistema

No arquivo `data/config.js`, configure:

```javascript
GOOGLE_APPS_SCRIPT: {
    WEB_APP_URL: 'SUA_URL_DA_WEB_APP_AQUI',
    SPREADSHEET_ID: 'SEU_SPREADSHEET_ID_AQUI',
    // ... resto da configuração
}
```

## 🔐 Segurança

- As credenciais são armazenadas na planilha (considere usar hash de senha em produção)
- O Google Apps Script fornece HTTPS automaticamente
- Apenas usuários com acesso à planilha podem modificar dados diretamente

## 📋 Dados de Exemplo

### Região de Exemplo
```
ID: 1 | Nome: Norte | Descrição: Região Norte da Cidade | Coordenador: João Silva | Status: ATIVO
```

### Igreja de Exemplo  
```
ID: 1 | Nome: Igreja Central | Regiao: Norte | Endereco: Rua Principal, 123 | Telefone: (11) 99999-9999 | Pastor: Pastor João | Status: ATIVO
```

### Usuário Admin de Exemplo
```
ID: 1 | Nome: Admin Sistema | Email: admin@arimateia.com | Senha: admin123 | Tipo: ADMIN | Igreja: Igreja Central | Regiao: Norte | Status: ATIVO
```

## 🚀 Próximos Passos

1. Configure as planilhas com a estrutura descrita
2. Implemente o código do Google Apps Script
3. Configure as URLs no sistema
4. Teste as funcionalidades
5. Adicione dados iniciais nas planilhas

## 📞 Suporte

Para dúvidas sobre a configuração, consulte a documentação do Google Apps Script ou entre em contato com o suporte técnico.
