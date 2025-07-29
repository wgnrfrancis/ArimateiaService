/**
 * 🚀 GOOGLE APPS SCRIPT - TESTE SIMPLES CORS
 * Versão super simplificada para garantir que funciona
 */

/**
 * Função para requisições OPTIONS (CORS preflight)
 */
function doOptions() {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}

/**
 * Função para requisições GET
 */
function doGet(e) {
  const action = e.parameter.action || 'test';
  
  let response = {};
  
  if (action === 'getIgrejasRegioes') {
    response = {
      success: true,
      data: {
        message: "CORS funcionando! Google Apps Script configurado corretamente via GET",
        regioes: ["CATEDRAL", "Presidente Prudente", "Pirapozinho"],
        igrejas: ["Igreja Central", "Igreja Sede", "Igreja Filial"],
        timestamp: new Date().toISOString()
      }
    };
  } else {
    response = {
      success: true,
      data: {
        message: "Google Apps Script funcionando!",
        action: action,
        timestamp: new Date().toISOString()
      }
    };
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}

/**
 * Função para requisições POST
 */
function doPost(e) {
  let data = {};
  
  try {
    data = JSON.parse(e.postData.contents);
  } catch (error) {
    data = e.parameter || {};
  }
  
  const action = data.action || 'test';
  let response = {};
  
  switch(action) {
    case 'getIgrejasRegioes':
      response = {
        success: true,
        data: {
          message: "CORS funcionando! Google Apps Script configurado corretamente via POST",
          regioes: ["CATEDRAL", "Presidente Prudente", "Pirapozinho", "Presidente Venceslau", "Rancharia"],
          igrejas: ["Igreja Central", "Igreja Sede", "Igreja Filial", "Igreja Norte", "Igreja Sul"],
          timestamp: new Date().toISOString()
        }
      };
      break;
      
    case 'newUser':
      response = {
        success: true,
        data: {
          message: "Usuário criado com sucesso! (modo teste)",
          userId: "test_" + new Date().getTime(),
          status: "Ativo",
          nome: data.nomeCompleto || "Teste",
          email: data.email || "teste@teste.com",
          timestamp: new Date().toISOString()
        }
      };
      break;
      
    case 'validateUser':
      response = {
        success: false,
        data: {
          message: "Email disponível para cadastro",
          exists: false,
          email: data.email || "teste@teste.com",
          timestamp: new Date().toISOString()
        }
      };
      break;
      
    default:
      response = {
        success: true,
        data: {
          message: "Google Apps Script funcionando via POST!",
          action: action,
          receivedData: data,
          timestamp: new Date().toISOString()
        }
      };
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}
