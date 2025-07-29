/**
 * 🔧 ADICIONE ESTAS FUNÇÕES AO SEU GOOGLE APPS SCRIPT EXISTENTE
 * Cole estas funções no INÍCIO do seu script atual
 */

/**
 * 🎯 FUNÇÃO PARA LIDAR COM REQUISIÇÕES OPTIONS (CORS PREFLIGHT)
 */
function doOptions() {
  const output = ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
  
  output.setHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  
  return output;
}

/**
 * 🔧 SUBSTITUA SUA FUNÇÃO createResponse POR ESTA:
 */
function createResponse(data, success = true) {
  const response = success ? { success: true, data: data } : { success: false, error: data };
  
  const output = ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
  
  // Adicionar cabeçalhos CORS para permitir requisições de qualquer origem
  output.setHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  
  return output;
}
