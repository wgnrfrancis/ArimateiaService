/**
 * 🚀 GOOGLE APPS SCRIPT - TESTE CORS SIMPLES
 */

// FUNÇÃO OBRIGATÓRIA para lidar com requisições OPTIONS (CORS)
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

// FUNÇÃO OBRIGATÓRIA para lidar com requisições GET
function doGet(e) {
  const action = e.parameter.action || 'test';
  
  let data = {
    message: 'GET funcionando!',
    action: action,
    timestamp: new Date().toISOString()
  };
  
  if (action === 'getIgrejasRegioes') {
    data = {
      message: 'Igrejas e regiões carregadas com sucesso!',
      regioes: ['CATEDRAL', 'Presidente Prudente', 'Pirapozinho'],
      igrejas: ['Igreja Central', 'Igreja Sede', 'Igreja Filial'],
      timestamp: new Date().toISOString()
    };
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, data: data }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}

// FUNÇÃO OBRIGATÓRIA para lidar com requisições POST
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action || 'test';
    
    let responseData = {
      message: 'POST funcionando!',
      action: action,
      receivedData: data,
      timestamp: new Date().toISOString()
    };
    
    if (action === 'getIgrejasRegioes') {
      responseData = {
        message: 'Igrejas e regiões carregadas com sucesso!',
        regioes: ['CATEDRAL', 'Presidente Prudente', 'Pirapozinho'],
        igrejas: ['Igreja Central', 'Igreja Sede', 'Igreja Filial'],
        timestamp: new Date().toISOString()
      };
    }
    
    if (action === 'newUser') {
      responseData = {
        message: 'Usuário criado com sucesso! (modo teste)',
        userId: 'test_' + new Date().getTime(),
        status: 'Ativo',
        timestamp: new Date().toISOString()
      };
    }
    
    if (action === 'validateUser') {
      responseData = {
        message: 'Email disponível para cadastro',
        exists: false,
        timestamp: new Date().toISOString()
      };
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, data: responseData }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
  }
}
