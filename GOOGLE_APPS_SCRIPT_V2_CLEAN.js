/**
 * 🚀 ARIMATEIA SERVICE - GOOGLE APPS SCRIPT
 * Sistema de Gestão do Balcão da Cidadania
 * Versão 2.0 - Otimizada com CORS
 * 
 * INSTRUÇÕES DE INSTALAÇÃO:
 * 1. Acesse script.google.com
 * 2. Crie novo projeto: "Arimateia Service v2"
 * 3. Cole este código completo
 * 4. Configure a planilha ID abaixo
 * 5. Implante como Web App com acesso "Qualquer pessoa"
 */

// ========== CONFIGURAÇÕES ==========
const SPREADSHEET_ID = '1awSUcZPlvM0Ci5ecKWCG4uwDbR3ZT5ZeDOuVdOIGMuc';

const SHEETS = {
  CHAMADOS: 'CHAMADOS',
  USUARIOS: 'USUARIOS',
  OBSERVACOES_CHAMADOS: 'OBSERVACOES_CHAMADOS',
  CHAMADOS_EXCLUIDOS: 'CHAMADOS_EXCLUIDOS'
};

// ========== FUNÇÕES CORS ==========

/**
 * Processa requisições OPTIONS para CORS preflight
 */
function doOptions() {
  return createCorsResponse('');
}

/**
 * Processa requisições GET
 */
function doGet(e) {
  const action = e.parameter.action || 'test';
  
  try {
    let result = {};
    
    switch(action) {
      case 'getIgrejasRegioes':
        result = getIgrejasRegioes();
        break;
      case 'test':
        result = { message: 'Google Apps Script funcionando!', timestamp: new Date().toISOString() };
        break;
      default:
        result = { error: 'Ação não reconhecida: ' + action };
    }
    
    return createCorsResponse(result);
    
  } catch (error) {
    console.error('Erro no doGet:', error);
    return createCorsResponse({ error: error.toString() }, false);
  }
}

/**
 * Processa requisições POST - Função principal
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    console.log(`🎯 Ação recebida: ${action}`, data);
    
    let result = {};
    
    switch(action) {
      // 👤 Usuários
      case 'newUser':
        result = createNewUser(data);
        break;
      case 'validateUser':
        result = validateUser(data);
        break;
      case 'getUsers':
        result = getUsers(data);
        break;
        
      // 📋 Chamados
      case 'newTicket':
        result = createNewTicket(data);
        break;
      case 'getTickets':
        result = getTickets(data);
        break;
      case 'updateTicket':
        result = updateTicket(data);
        break;
      case 'deleteTicket':
        result = deleteTicket(data);
        break;
        
      // 🏛️ Dados gerais
      case 'getIgrejasRegioes':
        result = getIgrejasRegioes();
        break;
        
      default:
        result = { error: 'Ação não reconhecida: ' + action };
    }
    
    return createCorsResponse(result);
    
  } catch (error) {
    console.error('Erro no doPost:', error);
    return createCorsResponse({ error: error.toString() }, false);
  }
}

/**
 * Cria resposta com headers CORS configurados
 */
function createCorsResponse(data, success = true) {
  const response = success ? 
    { success: true, data: data } : 
    { success: false, error: data };
  
  const output = ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
  
  // Headers CORS para permitir requisições de qualquer origem
  output.setHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400' // Cache preflight por 24h
  });
  
  return output;
}

// ========== FUNÇÕES DE USUÁRIOS ==========

/**
 * 👤 Criar novo usuário
 */
function createNewUser(data) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.USUARIOS);
    
    // Verificar se email já existe
    const existingUsers = sheet.getDataRange().getValues();
    const emailExists = existingUsers.some(row => row[2] && row[2].toLowerCase() === data.email.toLowerCase());
    
    if (emailExists) {
      return { error: 'Email já cadastrado no sistema' };
    }
    
    // Gerar ID único
    const userId = 'USR_' + new Date().getTime();
    
    // Preparar dados do usuário
    const userData = [
      userId,                           // A: ID
      data.nomeCompleto || '',          // B: NOME_COMPLETO
      data.email || '',                 // C: EMAIL
      data.senha || 'Arimateia1',       // D: SENHA
      data.telefone || '',              // E: TELEFONE
      data.cargo || 'VOLUNTARIO',       // F: CARGO
      data.igreja || '',                // G: IGREJA
      data.regiao || '',                // H: REGIAO
      new Date().toISOString(),         // I: DATA_CADASTRO
      'Ativo',                          // J: STATUS
      '',                               // K: ULTIMO_ACESSO
      0,                                // L: TOTAL_CHAMADOS
      0,                                // M: CHAMADOS_RESOLVIDOS
      0,                                // N: TAXA_RESOLUCAO
      data.userInfo?.name || 'Sistema', // O: CRIADO_POR
      ''                                // P: OBSERVACOES
    ];
    
    // Adicionar na planilha
    sheet.appendRow(userData);
    
    return {
      message: 'Usuário criado com sucesso!',
      userId: userId,
      nome: data.nomeCompleto,
      email: data.email,
      status: 'Ativo',
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
}

/**
 * 🔐 Validar usuário (login)
 */
function validateUser(data) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.USUARIOS);
    const users = sheet.getDataRange().getValues();
    
    // Procurar usuário por email e senha
    for (let i = 1; i < users.length; i++) {
      const row = users[i];
      const email = row[2];     // C: EMAIL
      const senha = row[3];     // D: SENHA
      const status = row[9];    // J: STATUS
      
      if (email && email.toLowerCase() === data.email.toLowerCase()) {
        if (senha === data.password && status === 'Ativo') {
          return {
            message: 'Login realizado com sucesso',
            user: {
              id: row[0],       // A: ID
              nome: row[1],     // B: NOME_COMPLETO
              email: row[2],    // C: EMAIL
              cargo: row[5],    // F: CARGO
              igreja: row[6],   // G: IGREJA
              regiao: row[7]    // H: REGIAO
            }
          };
        } else if (status !== 'Ativo') {
          return { error: 'Usuário inativo. Contate o administrador.' };
        } else {
          return { error: 'Senha incorreta' };
        }
      }
    }
    
    // Se chegou aqui, email não foi encontrado
    return { error: 'Email não encontrado' };
    
  } catch (error) {
    console.error('Erro ao validar usuário:', error);
    throw error;
  }
}

/**
 * 👥 Buscar usuários
 */
function getUsers(data) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.USUARIOS);
    const users = sheet.getDataRange().getValues();
    
    const userList = [];
    
    for (let i = 1; i < users.length; i++) {
      const row = users[i];
      if (row[0]) { // Se tem ID
        userList.push({
          id: row[0],           // A: ID
          nome: row[1],         // B: NOME_COMPLETO
          email: row[2],        // C: EMAIL
          telefone: row[4],     // E: TELEFONE
          cargo: row[5],        // F: CARGO
          igreja: row[6],       // G: IGREJA
          regiao: row[7],       // H: REGIAO
          status: row[9],       // J: STATUS
          dataCriacao: row[8]   // I: DATA_CADASTRO
        });
      }
    }
    
    return {
      usuarios: userList,
      total: userList.length
    };
    
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
}

// ========== FUNÇÕES DE CHAMADOS ==========

/**
 * 📋 Criar novo chamado
 */
function createNewTicket(data) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.CHAMADOS);
    
    // Gerar ID único
    const ticketId = 'CHM_' + new Date().getTime();
    
    // Preparar dados do chamado
    const ticketData = [
      ticketId,                           // A: ID
      data.nomeCidadao || '',             // B: Nome do Cidadão
      data.contato || '',                 // C: Contato
      data.email || '',                   // D: Email
      data.descricao || '',               // E: Descrição
      data.prioridade || 'Media',         // F: Prioridade
      data.categoria || '',               // G: Categoria
      data.demanda || '',                 // H: Demanda
      'aberto',                           // I: Status
      new Date().toISOString(),           // J: Data Criação
      data.userInfo?.name || 'Sistema',   // K: Criado Por
      '',                                 // L: Data Resolução
      ''                                  // M: Observações
    ];
    
    // Adicionar na planilha
    sheet.appendRow(ticketData);
    
    return {
      message: 'Chamado criado com sucesso!',
      ticketId: ticketId,
      nomeCidadao: data.nomeCidadao,
      status: 'aberto',
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Erro ao criar chamado:', error);
    throw error;
  }
}

/**
 * 📋 Buscar chamados
 */
function getTickets(data) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.CHAMADOS);
    const tickets = sheet.getDataRange().getValues();
    
    const ticketList = [];
    
    for (let i = 1; i < tickets.length; i++) {
      const row = tickets[i];
      if (row[0]) { // Se tem ID
        ticketList.push({
          id: row[0],
          nomeCidadao: row[1],
          contato: row[2],
          email: row[3],
          descricao: row[4],
          prioridade: row[5],
          categoria: row[6],
          demanda: row[7],
          status: row[8],
          dataCriacao: row[9],
          criadoPor: row[10],
          dataResolucao: row[11],
          observacoes: row[12]
        });
      }
    }
    
    return {
      chamados: ticketList,
      total: ticketList.length
    };
    
  } catch (error) {
    console.error('Erro ao buscar chamados:', error);
    throw error;
  }
}

/**
 * ✏️ Atualizar chamado
 */
function updateTicket(data) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.CHAMADOS);
    const tickets = sheet.getDataRange().getValues();
    
    // Encontrar o chamado
    for (let i = 1; i < tickets.length; i++) {
      if (tickets[i][0] === data.ticketId) {
        // Atualizar dados
        sheet.getRange(i + 1, 9).setValue(data.novoStatus || tickets[i][8]); // Status
        if (data.novoStatus === 'resolvido') {
          sheet.getRange(i + 1, 12).setValue(new Date().toISOString()); // Data resolução
        }
        sheet.getRange(i + 1, 13).setValue(data.observacoes || tickets[i][12]); // Observações
        
        return {
          message: 'Chamado atualizado com sucesso!',
          ticketId: data.ticketId,
          novoStatus: data.novoStatus
        };
      }
    }
    
    return { error: 'Chamado não encontrado' };
    
  } catch (error) {
    console.error('Erro ao atualizar chamado:', error);
    throw error;
  }
}

/**
 * 🗑️ Excluir chamado
 */
function deleteTicket(data) {
  try {
    // Implementar lógica de exclusão (mover para aba de excluídos)
    return {
      message: 'Chamado excluído com sucesso!',
      ticketId: data.ticketId
    };
    
  } catch (error) {
    console.error('Erro ao excluir chamado:', error);
    throw error;
  }
}

// ========== FUNÇÕES DE DADOS ==========

/**
 * 🏛️ Buscar igrejas e regiões
 */
function getIgrejasRegioes() {
  try {
    return {
      message: 'Igrejas e regiões carregadas com sucesso',
      regioes: [
        "CATEDRAL",
        "Presidente Prudente", 
        "Pirapozinho",
        "Presidente Venceslau",
        "Rancharia",
        "Andradina",
        "Tupã",
        "Assis", 
        "Dracena"
      ],
      igrejasPorRegiao: {
        "CATEDRAL": ["CATEDRAL DA FÉ"],
        "Presidente Prudente": ["Cecap", "Humberto Salvador", "Santo Expedito", "Montalvão"],
        "Pirapozinho": ["Pirapozinho", "Anhumas", "Tarabai", "Teodoro Sampaio"],
        "Presidente Venceslau": ["Presidente Venceslau", "Presidente Epitácio", "Santo Anastácio"],
        "Rancharia": ["RANCHARIA", "Martinopólis", "Quatá", "Iepe"],
        "Andradina": ["ANDRADINA", "Mirandopolis", "Castilho", "Guaracaí"],
        "Tupã": ["TUPÃ", "Bastos", "Quintana", "Osvaldo Cruz"],
        "Assis": ["ASSIS", "Tarumã", "Echaporã", "Candido Mota"],
        "Dracena": ["DRACENA", "Junqueiropolis", "Panorama", "Adamantina"]
      },
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Erro ao buscar igrejas e regiões:', error);
    throw error;
  }
}
