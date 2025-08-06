/**
 * Exemplo de código para Google Apps Script (Code.gs)
 * Este arquivo deve ser copiado para o Google Apps Script
 * URL: https://script.google.com/
 */

function doPost(e) {
  console.log('📨 Requisição recebida:', e);
  
  try {
    // Ler dados JSON do corpo da requisição
    var data = JSON.parse(e.postData.contents);
    console.log('📦 Dados recebidos:', data);
    
    var action = data.action;
    var email = data.email;
    var password = data.password;
    
    console.log('🔍 Ação:', action, 'Email:', email);
    
    if (action === 'validateUser') {
      return validarUsuario(email, password);
    }
    
    if (action === 'test') {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'API do Balcão da Cidadania está funcionando!',
        timestamp: new Date().toISOString(),
        version: '2.0.0'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Ação não reconhecida: ' + action
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('❌ Erro no doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Erro no servidor: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  console.log('📨 Requisição GET recebida:', e);
  
  try {
    var action = e.parameter.action;
    
    if (action === 'test') {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'API do Balcão da Cidadania está funcionando!',
        timestamp: new Date().toISOString(),
        version: '2.0.0'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Ação GET não reconhecida: ' + action
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('❌ Erro no doGet:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Erro no servidor: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
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
      }
    ];
    
    // Buscar usuário
    var usuario = usuariosMock.find(function(u) {
      return u.email.toLowerCase() === email.toLowerCase() && u.status === 'ativo';
    });
    
    if (usuario && usuario.password === senha) {
      console.log('✅ Usuário encontrado:', usuario.name);
      
      return ContentService.createTextOutput(JSON.stringify({
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
      })).setMimeType(ContentService.MimeType.JSON);
    } else {
      console.log('❌ Credenciais inválidas para:', email);
      
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Email ou senha incorretos'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    console.error('❌ Erro na validação:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Erro na validação: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
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
