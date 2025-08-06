/**
 * Exemplo de código para Google Apps Script (Code.gs)
 * Este arquivo deve ser copiado para o Google Apps Script
 * URL: https://script.google.com/
 * 
 * IMPORTANTE: Configure o Google Apps Script para:
 * 1. Acesso: "Qualquer pessoa (mesmo anônima)"
 * 2. Executar como: "Eu (seu email)"
 */

function doPost(e) {
  console.log('📨 Requisição POST recebida:', e);
  
  try {
    // Ler dados JSON do corpo da requisição
    var data = JSON.parse(e.postData.contents);
    console.log('📦 Dados recebidos:', data);
    
    var action = data.action;
    var email = data.email;
    var password = data.password;
    
    console.log('🔍 Ação:', action, 'Email:', email);
    
    // Teste de conexão simples
    if (action === 'testConnection') {
      return createCorsResponse({
        success: true,
        message: 'Conexão estabelecida com sucesso!',
        timestamp: new Date().toISOString(),
        version: '2.0.0'
      });
    }
    
    // Validação de usuário
    if (action === 'validateUser') {
      return validarUsuario(email, password);
    }
    
    // Teste básico da API
    if (action === 'test') {
      return createCorsResponse({
        success: true,
        message: 'API do Balcão da Cidadania está funcionando!',
        timestamp: new Date().toISOString(),
        version: '2.0.0'
      });
    }
    
    return createCorsResponse({
      success: false,
      error: 'Ação não reconhecida: ' + action
    });
    
  } catch (error) {
    console.error('❌ Erro no doPost:', error);
    return createCorsResponse({
      success: false,
      error: 'Erro no servidor: ' + error.toString()
    });
  }
}

function doGet(e) {
  console.log('📨 Requisição GET recebida:', e);
  
  try {
    var action = e.parameter.action;
    
    if (action === 'test') {
      return createCorsResponse({
        success: true,
        message: 'API do Balcão da Cidadania está funcionando!',
        timestamp: new Date().toISOString(),
        version: '2.0.0'
      });
    }
    
    return createCorsResponse({
      success: false,
      error: 'Ação GET não reconhecida: ' + action
    });
    
  } catch (error) {
    console.error('❌ Erro no doGet:', error);
    return createCorsResponse({
      success: false,
      error: 'Erro no servidor: ' + error.toString()
    });
  }
}

/**
 * ✅ Função que retorna resposta com headers CORS corretos
 * Esta função é ESSENCIAL para resolver problemas de CORS
 */
function createCorsResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")  // Permite qualquer origem
    .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type, Accept")
    .setHeader("Access-Control-Max-Age", "3600");
}

/**
 * Função para lidar com requisições OPTIONS (preflight)
 * Necessária para requisições CORS complexas
 */
function doOptions(e) {
  return createCorsResponse({
    message: 'CORS preflight OK'
  });
}

function validarUsuario(email, senha) {
  console.log('🔐 Validando usuário:', email);
  
  try {
    // Aqui você conectaria com sua planilha do Google Sheets
    // Por exemplo: var sheet = SpreadsheetApp.openById('SEU_ID_DA_PLANILHA').getSheetByName('usuarios');
    
    // Por enquanto, vamos usar dados mock para teste
    var usuariosMock = [
      {
        id: 1,
        name: 'Wagner Duarte',
        email: 'wagduarte@universal.org',
        password: '123456',
        role: 'COORDENADOR_GERAL',
        igreja: 'Igreja Universal - Sede',
        regiao: 'Centro',
        status: 'ativo'
      },
      {
        id: 2,
        name: 'Coordenador Geral',
        email: 'coordenador@arimateia.org.br',
        password: '123456',
        role: 'COORDENADOR_GERAL',
        igreja: 'Igreja Central - Sede',
        regiao: 'Centro',
        status: 'ativo'
      },
      {
        id: 3,
        name: 'Maria Silva',
        email: 'secretaria@arimateia.org.br',
        password: '123456',
        role: 'SECRETARIA',
        igreja: 'Igreja Central - Sede',
        regiao: 'Centro',
        status: 'ativo'
      }
    ];
    
    // Buscar usuário
    var usuario = usuariosMock.find(function(u) {
      return u.email.toLowerCase() === email.toLowerCase() && u.status === 'ativo';
    });
    
    if (usuario && usuario.password === senha) {
      console.log('✅ Usuário encontrado:', usuario.name);
      
      return createCorsResponse({
        success: true,
        user: {
          id: usuario.id,
          name: usuario.name,
          email: usuario.email,
          role: usuario.role,
          igreja: usuario.igreja,
          regiao: usuario.regiao,
          status: usuario.status,
          ultimoAcesso: new Date().toISOString()
        },
        message: 'Login realizado com sucesso!'
      });
    } else {
      console.log('❌ Credenciais inválidas para:', email);
      
      return createCorsResponse({
        success: false,
        error: 'Email ou senha incorretos'
      });
    }
    
  } catch (error) {
    console.error('❌ Erro na validação:', error);
    return createCorsResponse({
      success: false,
      error: 'Erro na validação: ' + error.toString()
    });
  }
}

// Função para conectar com Google Sheets (exemplo)
function conectarPlanilha() {
  // Substitua pelo ID da sua planilha
  var PLANILHA_ID = 'SEU_ID_DA_PLANILHA_AQUI';
  
  try {
    var planilha = SpreadsheetApp.openById(PLANILHA_ID);
    var aba = planilha.getSheetByName('usuarios');
    
    // Exemplo de leitura de dados
    var dados = aba.getDataRange().getValues();
    
    // Primeira linha são os cabeçalhos
    var cabecalhos = dados[0];
    var usuarios = [];
    
    for (var i = 1; i < dados.length; i++) {
      var linha = dados[i];
      var usuario = {};
      
      for (var j = 0; j < cabecalhos.length; j++) {
        usuario[cabecalhos[j]] = linha[j];
      }
      
      usuarios.push(usuario);
    }
    
    return usuarios;
    
  } catch (error) {
    console.error('❌ Erro ao conectar planilha:', error);
    throw error;
  }
}

/**
 * INSTRUÇÕES DE CONFIGURAÇÃO:
 * 
 * 1. Cole este código no Google Apps Script (script.google.com)
 * 
 * 2. Clique em "Implantar" > "Nova implantação"
 * 
 * 3. Configurações da implantação:
 *    - Tipo: Aplicativo da web
 *    - Executar como: Eu (seu email)
 *    - Quem tem acesso: Qualquer pessoa (mesmo anônima)
 * 
 * 4. Clique em "Implantar" e copie a URL fornecida
 * 
 * 5. Cole a URL no arquivo config.js do seu projeto
 * 
 * 6. Para atualizar: vá em "Implantar" > "Gerenciar implantações" 
 *    e clique em "Editar" na versão ativa
 */
