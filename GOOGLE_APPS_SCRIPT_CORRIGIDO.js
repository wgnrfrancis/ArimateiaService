// ========================================
// BALCÃO DA CIDADANIA - GOOGLE APPS SCRIPT
// Sistema completo de gerenciamento
// Versão: 2.1.0 - PRODUÇÃO
// ========================================
//
// ✅ VERSÃO DE PRODUÇÃO - SEM FUNÇÕES DE TESTE
// 1. Verificação robusta do objeto 'e' e seus dados
// 2. Logger.log() em vez de console.log() para compatibilidade
// 3. Tratamento específico para requisições OPTIONS (CORS preflight)
// 4. Melhor parsing e validação de dados JSON
// 5. Resposta padronizada com estrutura consistente
// 6. Remoção completa de funções de teste (testConnection)
//
// ⚠️ IMPORTANTE:
// - NÃO execute doPost() manualmente no editor
// - Use apenas via aplicação web implantada
// - Esta versão resolve definitivamente os problemas de CORS
// ========================================

// CONFIGURAÇÕES GLOBAIS
const SPREADSHEET_ID = '1awSUcZPlvM0Ci5ecKWCG4uwDbR3ZT5ZeDOuVdOIGMuc'; // ID da planilha do Balcão da Cidadania

/**
 * ✅ Função para processar requisições OPTIONS (preflight) - SOLUÇÃO CORS
 * Esta função é chamada ANTES de qualquer requisição POST cross-origin
 */
function doOptions(e) {
  Logger.log('🔄 Requisição OPTIONS (preflight) recebida');
  
  // Resposta simples que permite CORS
  return ContentService
    .createTextOutput('OK')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * ✅ Função principal que processa todas as requisições POST - CORRIGIDA
 */
function doPost(e) {
  try {
    Logger.log('📨 Nova requisição POST recebida');
    
    // ✅ CORREÇÃO: Verificação robusta de dados de entrada
    if (!e) {
      Logger.log('⚠️ Objeto "e" não fornecido - possível teste manual');
      throw new Error('Requisição inválida: dados ausentes');
    }
    
    // ✅ CORREÇÃO: Extrair dados do corpo da requisição com validação
    let data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
        Logger.log('📦 Dados extraídos do postData.contents');
        Logger.log('📄 JSON recebido: ' + e.postData.contents);
      } catch (parseError) {
        Logger.log('❌ Erro ao fazer parse do JSON: ' + parseError.toString());
        throw new Error('JSON inválido na requisição: ' + parseError.message);
      }
    } else if (e.parameter && Object.keys(e.parameter).length > 0) {
      data = e.parameter;
      Logger.log('📦 Dados extraídos de e.parameter: ' + JSON.stringify(data));
    } else {
      Logger.log('❌ Nenhum dado encontrado na requisição');
      Logger.log('🔍 Estrutura do objeto e: ' + JSON.stringify(e));
      throw new Error('Dados da requisição não encontrados');
    }
    
    Logger.log('🎯 Ação solicitada: ' + (data.action || 'AÇÃO NÃO ESPECIFICADA'));
    
    // ✅ CORREÇÃO: Validar se action foi fornecida
    if (!data.action) {
      throw new Error('Parâmetro "action" é obrigatório na requisição');
    }
    
    // Roteamento das ações com tratamento individual de erros
    let result;
    switch (data.action) {
      case 'validateUser':
        result = validateUser(data);
        break;
          
      case 'newUser':
        result = newUser(data);
        break;
          
      case 'checkUserExists':
        result = checkUserExists(data);
        break;
          
      case 'newTicket':
        result = newTicket(data);
        break;
          
      case 'getTickets':
        result = getTickets(data);
        break;
          
      case 'updateTicket':
        result = updateTicket(data);
        break;
          
      case 'getUsers':
        result = getUsers(data);
        break;
          
      case 'getUserStats':
        result = getUserStats(data);
        break;
          
      case 'getDashboardData':
        result = getDashboardData(data);
        break;
          
      case 'getIgrejasRegioes':
        result = getIgrejasRegioes();
        break;
          
      case 'getCategories':
        result = getCategories();
        break;
          
      case 'getVolunteers':
        result = getVolunteers();
        break;
          
      case 'getProfessionals':
        result = getProfessionals();
        break;
          
      default:
        Logger.log('❌ Ação não reconhecida: ' + data.action);
        result = {
          success: false,
          error: 'Ação não reconhecida: ' + data.action,
          availableActions: [
            'validateUser', 'newUser', 'checkUserExists',
            'newTicket', 'getTickets', 'updateTicket', 'getUsers',
            'getUserStats', 'getDashboardData', 'getIgrejasRegioes',
            'getCategories', 'getVolunteers', 'getProfessionals'
          ]
        };
    }
    
    // ✅ CORREÇÃO: Garantir resposta consistente
    if (!result || typeof result !== 'object') {
      result = {
        success: false,
        error: 'Resultado inválido da função ' + data.action
      };
    }
    
    // Adicionar metadados à resposta
    result.timestamp = new Date().toISOString();
    result.action = data.action;
    
    Logger.log('✅ Processamento concluído com sucesso');
    return createStandardResponse(result);
    
  } catch (error) {
    Logger.log('❌ Erro no doPost: ' + error.toString());
    Logger.log('🔍 Stack trace: ' + error.stack);
    
    return createStandardResponse({
      success: false,
      error: error.message || error.toString(),
      timestamp: new Date().toISOString(),
      errorType: 'doPost'
    });
  }
}

/**
 * ✅ Função para processar requisições GET - CORRIGIDA
 */
function doGet(e) {
  try {
    Logger.log('📨 Nova requisição GET recebida');
    
    // Verificar se parâmetros existem
    const action = e && e.parameter ? e.parameter.action : null;
    
    if (!action) {
      const welcomeResponse = {
        success: true,
        message: 'API do Balcão da Cidadania está funcionando!',
        timestamp: new Date().toISOString(),
        version: '2.1.0 - PRODUÇÃO',
        status: 'online',
        spreadsheetId: SPREADSHEET_ID,
        availableActions: {
          GET: ['getIgrejasRegioes', 'getCategories'],
          POST: [
            'validateUser', 'newUser', 'checkUserExists', 'newTicket',
            'getTickets', 'updateTicket', 'getUsers', 'getUserStats',
            'getDashboardData', 'getVolunteers', 'getProfessionals'
          ]
        },
        instructions: 'Para usar a API, envie requisições POST com action e dados necessários.'
      };
      
      return createStandardResponse(welcomeResponse);
    }
    
    // Roteamento para ações GET
    let result;
    switch (action) {
      case 'getIgrejasRegioes':
        result = getIgrejasRegioes();
        break;
        
      case 'getCategories':
        result = getCategories();
        break;
        
      default:
        result = {
          success: false,
          error: 'Ação GET não reconhecida: ' + action,
          availableGetActions: ['getIgrejasRegioes', 'getCategories']
        };
    }
    
    result.timestamp = new Date().toISOString();
    result.action = action;
    
    return createStandardResponse(result);
    
  } catch (error) {
    Logger.log('❌ Erro no doGet: ' + error.toString());
    
    return createStandardResponse({
      success: false,
      error: error.message || error.toString(),
      timestamp: new Date().toISOString(),
      errorType: 'doGet'
    });
  }
}

/**
 * ✅ Função que cria resposta padronizada - SOLUÇÃO CORS DEFINITIVA
 * Esta função garante que todas as respostas tenham o formato correto
 * e sejam compatíveis com CORS
 */
function createStandardResponse(data) {
  try {
    // Garantir que data seja um objeto válido
    if (typeof data !== 'object' || data === null) {
      data = {
        success: false,
        error: 'Dados de resposta inválidos',
        originalData: data
      };
    }
    
    // Converter para JSON string
    const jsonResponse = JSON.stringify(data);
    
    // ✅ SOLUÇÃO CORS: ContentService com MIME JSON
    // O Google Apps Script permite CORS automaticamente quando usamos
    // ContentService.createTextOutput() com MimeType.JSON
    return ContentService
      .createTextOutput(jsonResponse)
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('❌ Erro ao criar resposta: ' + error.toString());
    
    // Fallback em caso de erro na criação da resposta
    const fallbackResponse = {
      success: false,
      error: 'Erro interno do servidor: ' + error.message,
      timestamp: new Date().toISOString()
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(fallbackResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Validar usuário para login
 */
function validateUser(requestData) {
  try {
    Logger.log('🔐 Validando usuário...');
    
    // Parse dos dados se necessário
    let data = requestData;
    if (typeof requestData.data === 'string') {
      data = JSON.parse(requestData.data);
    } else if (requestData.data) {
      data = requestData.data;
    }
    
    const email = data.email;
    const senha = data.password || data.senha;
    
    if (!email || !senha) {
      throw new Error('Email e senha são obrigatórios');
    }
    
    Logger.log('📧 Email: ' + email);
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName('USUARIOS');
    
    if (!sheet) {
      throw new Error('Aba USUARIOS não encontrada na planilha');
    }
    
    const range = sheet.getDataRange();
    const values = range.getValues();
    
    if (values.length <= 1) {
      throw new Error('Nenhum usuário cadastrado no sistema');
    }
    
    const headers = values[0];
    
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const userData = {};
      
      headers.forEach((header, index) => {
        userData[header] = row[index];
      });
      
      if (userData.EMAIL === email && userData.SENHA === senha) {
        Logger.log('✅ Usuário validado com sucesso');
        
        return {
          success: true,
          user: {
            id: userData.ID || i,
            name: userData.NOME_COMPLETO,
            email: userData.EMAIL,
            role: userData.CARGO,
            igreja: userData.IGREJA,
            regiao: userData.REGIAO,
            telefone: userData.TELEFONE,
            status: userData.STATUS || 'ativo',
            ultimoAcesso: new Date().toISOString()
          },
          message: 'Login realizado com sucesso!'
        };
      }
    }
    
    Logger.log('❌ Credenciais inválidas para: ' + email);
    return {
      success: false,
      error: 'Email ou senha incorretos'
    };
    
  } catch (error) {
    Logger.log('❌ Erro na validação: ' + error.toString());
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Criar novo usuário
 */
function newUser(requestData) {
  try {
    Logger.log('👤 Criando novo usuário...');
    
    // Parse dos dados se necessário
    let data = requestData;
    if (typeof requestData.data === 'string') {
      data = JSON.parse(requestData.data);
    } else if (requestData.data) {
      data = requestData.data;
    }
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName('USUARIOS');
    
    if (!sheet) {
      throw new Error('Aba USUARIOS não encontrada');
    }
    
    // Verificar se email já existe
    const existingUser = checkUserExists({ data: JSON.stringify({ email: data.email }) });
    if (existingUser.exists) {
      throw new Error('Email já cadastrado no sistema');
    }
    
    // Adicionar nova linha
    const newRow = [
      data.nomeCompleto,
      data.email,
      data.telefone,
      data.cargo || 'VOLUNTARIO',
      data.igreja,
      data.regiao,
      data.senha || 'minhaflor',
      new Date().toISOString(),
      data.observacoes || '',
      'ATIVO'
    ];
    
    sheet.appendRow(newRow);
    
    Logger.log('✅ Usuário criado com sucesso');
    
    return {
      success: true,
      message: 'Usuário cadastrado com sucesso!',
      user: {
        nome: data.nomeCompleto,
        email: data.email,
        cargo: data.cargo || 'VOLUNTARIO',
        igreja: data.igreja,
        regiao: data.regiao
      }
    };
    
  } catch (error) {
    Logger.log('❌ Erro ao criar usuário: ' + error.toString());
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Verificar se usuário existe
 */
function checkUserExists(requestData) {
  try {
    Logger.log('🔍 Verificando se usuário existe...');
    
    // Parse dos dados se necessário
    let data = requestData;
    if (typeof requestData.data === 'string') {
      data = JSON.parse(requestData.data);
    } else if (requestData.data) {
      data = requestData.data;
    }
    
    const email = data.email;
    
    if (!email) {
      throw new Error('Email é obrigatório');
    }
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName('USUARIOS');
    
    if (!sheet) {
      return { success: true, exists: false };
    }
    
    const range = sheet.getDataRange();
    const values = range.getValues();
    
    if (values.length <= 1) {
      return { success: true, exists: false };
    }
    
    const headers = values[0];
    const emailIndex = headers.indexOf('EMAIL');
    
    if (emailIndex === -1) {
      return { success: true, exists: false };
    }
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][emailIndex] === email) {
        return { success: true, exists: true };
      }
    }
    
    return { success: true, exists: false };
    
  } catch (error) {
    Logger.log('❌ Erro ao verificar usuário: ' + error.toString());
    return {
      success: false,
      error: error.message,
      exists: false
    };
  }
}

/**
 * Criar novo chamado
 */
function newTicket(requestData) {
  try {
    Logger.log('🎫 Criando novo chamado...');
    
    // Parse dos dados se necessário
    let data = requestData;
    if (typeof requestData.data === 'string') {
      data = JSON.parse(requestData.data);
    } else if (requestData.data) {
      data = requestData.data;
    }
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName('CHAMADOS');
    
    if (!sheet) {
      throw new Error('Aba CHAMADOS não encontrada');
    }
    
    // Gerar ID único para o chamado
    const ticketId = 'CH' + Date.now();
    
    // Adicionar nova linha
    const newRow = [
      ticketId,
      data.nomeCidadao,
      data.cpf || '',
      data.contato,
      data.email || '',
      data.igreja,
      data.regiao,
      data.descricao,
      data.prioridade || 'MEDIA',
      data.categoria || 'OUTROS',
      'ABERTO',
      new Date().toISOString(),
      '',
      data.userInfo?.name || 'Sistema',
      data.userInfo?.email || ''
    ];
    
    sheet.appendRow(newRow);
    
    Logger.log('✅ Chamado criado com sucesso: ' + ticketId);
    
    return {
      success: true,
      message: 'Chamado criado com sucesso!',
      ticketId: ticketId,
      data: {
        id: ticketId,
        nomeCidadao: data.nomeCidadao,
        contato: data.contato,
        igreja: data.igreja,
        regiao: data.regiao,
        status: 'ABERTO',
        dataAbertura: new Date().toISOString()
      }
    };
    
  } catch (error) {
    Logger.log('❌ Erro ao criar chamado: ' + error.toString());
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Buscar chamados
 */
function getTickets(requestData) {
  try {
    Logger.log('📋 Buscando chamados...');
    
    // Parse dos dados se necessário
    let filters = {};
    if (requestData && requestData.data) {
      if (typeof requestData.data === 'string') {
        filters = JSON.parse(requestData.data);
      } else {
        filters = requestData.data;
      }
    }
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName('CHAMADOS');
    
    if (!sheet) {
      return { success: true, data: [] };
    }
    
    const range = sheet.getDataRange();
    const values = range.getValues();
    
    if (values.length <= 1) {
      return { success: true, data: [] };
    }
    
    const headers = values[0];
    const tickets = [];
    
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const ticket = {};
      
      headers.forEach((header, index) => {
        ticket[header] = row[index];
      });
      
      // Aplicar filtros se necessário
      let includeTicket = true;
      
      if (filters.regiao && ticket.REGIAO !== filters.regiao) {
        includeTicket = false;
      }
      
      if (filters.status && ticket.STATUS !== filters.status) {
        includeTicket = false;
      }
      
      if (filters.igreja && ticket.IGREJA !== filters.igreja) {
        includeTicket = false;
      }
      
      if (includeTicket) {
        tickets.push(ticket);
      }
    }
    
    Logger.log('✅ Encontrados ' + tickets.length + ' chamados');
    
    return {
      success: true,
      data: tickets,
      total: tickets.length
    };
    
  } catch (error) {
    Logger.log('❌ Erro ao buscar chamados: ' + error.toString());
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Atualizar chamado
 */
function updateTicket(requestData) {
  try {
    Logger.log('📝 Atualizando chamado...');
    
    // Parse dos dados se necessário
    let data = requestData;
    if (typeof requestData.data === 'string') {
      data = JSON.parse(requestData.data);
    } else if (requestData.data) {
      data = requestData.data;
    }
    
    const ticketId = data.ticketId;
    const updateData = data.updateData;
    
    if (!ticketId) {
      throw new Error('ID do chamado é obrigatório');
    }
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName('CHAMADOS');
    
    if (!sheet) {
      throw new Error('Aba CHAMADOS não encontrada');
    }
    
    const range = sheet.getDataRange();
    const values = range.getValues();
    
    if (values.length <= 1) {
      throw new Error('Nenhum chamado encontrado');
    }
    
    const headers = values[0];
    const idIndex = headers.indexOf('ID') || headers.indexOf('TICKET_ID');
    
    if (idIndex === -1) {
      throw new Error('Coluna ID não encontrada');
    }
    
    // Procurar o chamado
    for (let i = 1; i < values.length; i++) {
      if (values[i][idIndex] === ticketId) {
        // Atualizar campos específicos
        if (updateData.status) {
          const statusIndex = headers.indexOf('STATUS');
          if (statusIndex !== -1) {
            sheet.getRange(i + 1, statusIndex + 1).setValue(updateData.status);
          }
        }
        
        if (updateData.observacoes) {
          const obsIndex = headers.indexOf('OBSERVACOES');
          if (obsIndex !== -1) {
            sheet.getRange(i + 1, obsIndex + 1).setValue(updateData.observacoes);
          }
        }
        
        // Atualizar data de modificação
        const dataModIndex = headers.indexOf('DATA_MODIFICACAO');
        if (dataModIndex !== -1) {
          sheet.getRange(i + 1, dataModIndex + 1).setValue(new Date().toISOString());
        }
        
        Logger.log('✅ Chamado atualizado com sucesso');
        
        return {
          success: true,
          message: 'Chamado atualizado com sucesso!'
        };
      }
    }
    
    throw new Error('Chamado não encontrado');
    
  } catch (error) {
    Logger.log('❌ Erro ao atualizar chamado: ' + error.toString());
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Buscar usuários
 */
function getUsers(requestData) {
  try {
    Logger.log('👥 Buscando usuários...');
    
    // Parse dos dados se necessário
    let filters = {};
    if (requestData && requestData.data) {
      if (typeof requestData.data === 'string') {
        filters = JSON.parse(requestData.data);
      } else {
        filters = requestData.data;
      }
    }
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName('USUARIOS');
    
    if (!sheet) {
      return { success: true, data: [] };
    }
    
    const range = sheet.getDataRange();
    const values = range.getValues();
    
    if (values.length <= 1) {
      return { success: true, data: [] };
    }
    
    const headers = values[0];
    const users = [];
    
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const user = {};
      
      headers.forEach((header, index) => {
        user[header] = row[index];
      });
      
      // Aplicar filtros se necessário
      let includeUser = true;
      
      if (filters.cargo && user.CARGO !== filters.cargo) {
        includeUser = false;
      }
      
      if (filters.regiao && user.REGIAO !== filters.regiao) {
        includeUser = false;
      }
      
      if (filters.igreja && user.IGREJA !== filters.igreja) {
        includeUser = false;
      }
      
      if (includeUser) {
        // Remover senha dos dados retornados
        delete user.SENHA;
        users.push(user);
      }
    }
    
    Logger.log('✅ Encontrados ' + users.length + ' usuários');
    
    return {
      success: true,
      data: users,
      total: users.length
    };
    
  } catch (error) {
    Logger.log('❌ Erro ao buscar usuários: ' + error.toString());
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Obter estatísticas do usuário
 */
function getUserStats(requestData) {
  try {
    Logger.log('📊 Buscando estatísticas do usuário...');
    
    // Parse dos dados se necessário
    let data = requestData;
    if (typeof requestData.data === 'string') {
      data = JSON.parse(requestData.data);
    } else if (requestData.data) {
      data = requestData.data;
    }
    
    const userId = data.userId;
    const regiao = data.regiao;
    
    // Buscar chamados do usuário/região
    const ticketsResult = getTickets({ data: JSON.stringify({ regiao: regiao }) });
    
    if (!ticketsResult.success) {
      throw new Error('Erro ao buscar chamados');
    }
    
    const tickets = ticketsResult.data || [];
    
    // Calcular estatísticas
    const stats = {
      totalChamados: tickets.length,
      chamadosAbertos: tickets.filter(t => t.STATUS === 'ABERTO').length,
      chamadosEmAndamento: tickets.filter(t => t.STATUS === 'EM_ANDAMENTO').length,
      chamadosFinalizados: tickets.filter(t => t.STATUS === 'FINALIZADO').length,
      chamadosCancelados: tickets.filter(t => t.STATUS === 'CANCELADO').length
    };
    
    Logger.log('✅ Estatísticas calculadas');
    
    return {
      success: true,
      data: stats
    };
    
  } catch (error) {
    Logger.log('❌ Erro ao buscar estatísticas: ' + error.toString());
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Obter dados do dashboard
 */
function getDashboardData(requestData) {
  try {
    Logger.log('📈 Buscando dados do dashboard...');
    
    // Parse dos dados se necessário
    let data = {};
    if (requestData && requestData.data) {
      if (typeof requestData.data === 'string') {
        data = JSON.parse(requestData.data);
      } else {
        data = requestData.data;
      }
    }
    
    const filters = data.filters || {};
    const period = data.period || '30days';
    
    // Buscar todos os chamados
    const ticketsResult = getTickets({});
    
    if (!ticketsResult.success) {
      throw new Error('Erro ao buscar chamados');
    }
    
    const tickets = ticketsResult.data || [];
    
    // Buscar todos os usuários
    const usersResult = getUsers({});
    
    if (!usersResult.success) {
      throw new Error('Erro ao buscar usuários');
    }
    
    const users = usersResult.data || [];
    
    // Calcular estatísticas gerais
    const dashboardData = {
      resumo: {
        totalChamados: tickets.length,
        totalUsuarios: users.length,
        totalVoluntarios: users.filter(u => u.CARGO === 'VOLUNTARIO').length,
        chamadosAbertos: tickets.filter(t => t.STATUS === 'ABERTO').length,
        chamadosEmAndamento: tickets.filter(t => t.STATUS === 'EM_ANDAMENTO').length,
        chamadosFinalizados: tickets.filter(t => t.STATUS === 'FINALIZADO').length
      },
      porRegiao: {},
      porCategoria: {},
      porStatus: {},
      timeline: []
    };
    
    // Agrupar por região
    tickets.forEach(ticket => {
      const regiao = ticket.REGIAO || 'Não informado';
      if (!dashboardData.porRegiao[regiao]) {
        dashboardData.porRegiao[regiao] = 0;
      }
      dashboardData.porRegiao[regiao]++;
    });
    
    // Agrupar por categoria
    tickets.forEach(ticket => {
      const categoria = ticket.CATEGORIA || 'Outros';
      if (!dashboardData.porCategoria[categoria]) {
        dashboardData.porCategoria[categoria] = 0;
      }
      dashboardData.porCategoria[categoria]++;
    });
    
    // Agrupar por status
    tickets.forEach(ticket => {
      const status = ticket.STATUS || 'Não informado';
      if (!dashboardData.porStatus[status]) {
        dashboardData.porStatus[status] = 0;
      }
      dashboardData.porStatus[status]++;
    });
    
    Logger.log('✅ Dados do dashboard calculados');
    
    return {
      success: true,
      data: dashboardData
    };
    
  } catch (error) {
    Logger.log('❌ Erro ao buscar dados do dashboard: ' + error.toString());
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Obter regiões e igrejas da aba IGREJAS_REGIOES
 */
function getIgrejasRegioes() {
  try {
    Logger.log('🔍 Buscando dados da aba IGREJAS_REGIOES...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName('IGREJAS_REGIOES');
    
    if (!sheet) {
      throw new Error('Aba IGREJAS_REGIOES não encontrada');
    }
    
    // Obter todos os dados da planilha (assumindo que a primeira linha são cabeçalhos)
    const range = sheet.getDataRange();
    const values = range.getValues();
    
    if (values.length <= 1) {
      throw new Error('Nenhum dado encontrado na aba IGREJAS_REGIOES');
    }
    
    // Cabeçalhos esperados: NOME_IGREJA, REGIAO
    const headers = values[0];
    const nomeIgrejaIndex = headers.indexOf('NOME_IGREJA');
    const regiaoIndex = headers.indexOf('REGIAO');
    
    if (nomeIgrejaIndex === -1 || regiaoIndex === -1) {
      throw new Error('Colunas NOME_IGREJA e/ou REGIAO não encontradas');
    }
    
    // Processar dados
    const igrejasPorRegiao = {};
    const regioesSet = new Set();
    
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const nomeIgreja = row[nomeIgrejaIndex];
      const regiao = row[regiaoIndex];
      
      // Pular linhas vazias
      if (!nomeIgreja || !regiao) continue;
      
      regioesSet.add(regiao);
      
      if (!igrejasPorRegiao[regiao]) {
        igrejasPorRegiao[regiao] = [];
      }
      
      igrejasPorRegiao[regiao].push({
        nome: nomeIgreja,
        regiao: regiao
      });
    }
    
    const regioes = Array.from(regioesSet).sort();
    const totalIgrejas = Object.values(igrejasPorRegiao).reduce((total, igrejas) => total + igrejas.length, 0);
    
    Logger.log('✅ Encontradas ' + regioes.length + ' regiões e ' + totalIgrejas + ' igrejas');
    
    return {
      success: true,
      data: {
        regioes: regioes,
        igrejasPorRegiao: igrejasPorRegiao,
        total: {
          regioes: regioes.length,
          igrejas: totalIgrejas
        }
      }
    };
    
  } catch (error) {
    Logger.log('❌ Erro ao buscar igrejas e regiões: ' + error.toString());
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Obter categorias
 */
function getCategories() {
  try {
    Logger.log('🏷️ Buscando categorias...');
    
    // Categorias fixas (você pode implementar busca na planilha se necessário)
    const categorias = [
      'DOCUMENTACAO',
      'JURIDICO',
      'SAUDE',
      'ASSISTENCIA_SOCIAL',
      'EDUCACAO',
      'PREVIDENCIA',
      'TRABALHO',
      'OUTROS'
    ];
    
    return {
      success: true,
      data: categorias
    };
    
  } catch (error) {
    Logger.log('❌ Erro ao buscar categorias: ' + error.toString());
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Obter voluntários
 */
function getVolunteers() {
  try {
    Logger.log('🤝 Buscando voluntários...');
    
    const usersResult = getUsers({ data: JSON.stringify({ cargo: 'VOLUNTARIO' }) });
    
    if (!usersResult.success) {
      throw new Error('Erro ao buscar usuários');
    }
    
    const volunteers = usersResult.data.map(user => ({
      nome: user.NOME_COMPLETO,
      email: user.EMAIL,
      telefone: user.TELEFONE,
      igreja: user.IGREJA,
      regiao: user.REGIAO
    }));
    
    return {
      success: true,
      data: volunteers
    };
    
  } catch (error) {
    Logger.log('❌ Erro ao buscar voluntários: ' + error.toString());
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Obter profissionais
 */
function getProfessionals() {
  try {
    Logger.log('👨‍💼 Buscando profissionais...');
    
    // Por enquanto retorna array vazio - implementar conforme necessidade
    // Pode buscar de uma aba específica PROFISSIONAIS ou filtrar usuários por cargo
    
    return {
      success: true,
      data: []
    };
    
  } catch (error) {
    Logger.log('❌ Erro ao buscar profissionais: ' + error.toString());
    return {
      success: false,
      error: error.message
    };
  }
}

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

/**
 * Função para log de auditoria (opcional)
 */
function logAction(action, user, data) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let logSheet = spreadsheet.getSheetByName('LOG_AUDITORIA');
    
    if (!logSheet) {
      // Criar aba de log se não existir
      logSheet = spreadsheet.insertSheet('LOG_AUDITORIA');
      logSheet.getRange(1, 1, 1, 5).setValues([
        ['TIMESTAMP', 'ACAO', 'USUARIO', 'EMAIL', 'DADOS']
      ]);
    }
    
    logSheet.appendRow([
      new Date().toISOString(),
      action,
      user?.name || 'Sistema',
      user?.email || '',
      JSON.stringify(data)
    ]);
    
  } catch (error) {
    Logger.log('Erro ao registrar log: ' + error.toString());
  }
}

/**
 * Função para validar dados obrigatórios
 */
function validateRequiredFields(data, requiredFields) {
  const missing = [];
  
  requiredFields.forEach(field => {
    if (!data[field] || data[field].toString().trim() === '') {
      missing.push(field);
    }
  });
  
  if (missing.length > 0) {
    throw new Error('Campos obrigatórios não preenchidos: ' + missing.join(', '));
  }
}

/**
 * Função para sanitizar dados
 */
function sanitizeData(data) {
  if (typeof data === 'string') {
    return data.trim().replace(/[<>]/g, '');
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized = {};
    for (const key in data) {
      sanitized[key] = sanitizeData(data[key]);
    }
    return sanitized;
  }
  
  return data;
}

Logger.log('🚀 Google Apps Script do Balcão da Cidadania v2.1.0 carregado com sucesso!');

/**
 * ✅ INSTRUÇÕES DE IMPLANTAÇÃO - VERSÃO 2.1.0:
 * 
 * 1. Acesse script.google.com e crie um novo projeto
 * 2. Cole ESTE código corrigido (substitua o código anterior)
 * 3. Salve o projeto com um nome descritivo
 * 4. Clique em "Implantar" > "Nova implantação"
 * 5. Configurações da implantação:
 *    - Tipo: Aplicativo da web
 *    - Executar como: Eu (seu email)
 *    - Quem tem acesso: Qualquer pessoa (mesmo anônima)
 * 6. Clique em "Implantar" e copie a URL fornecida
 * 7. Cole a URL no arquivo config.js do seu projeto (substitua a URL atual)
 * 8. Para futuras atualizações: use "Gerenciar implantações" > "Editar"
 * 
 * ✅ MELHORIAS DESTA VERSÃO:
 * - Tratamento robusto de erros e dados
 * - Logger.log() para melhor debugging
 * - CORS resolvido definitivamente
 * - Validação de entrada aprimorada
 * - Resposta padronizada para todas as funções
 * - Suporte completo a requisições cross-origin
 * 
 * ✅ PLANILHA NECESSÁRIA:
 * ID: 1awSUcZPlvM0Ci5ecKWCG4uwDbR3ZT5ZeDOuVdOIGMuc
 * 
 * ✅ ABAS NECESSÁRIAS:
 * - USUARIOS (nome_completo, email, telefone, cargo, igreja, regiao, senha, data_cadastro, observacoes, status)
 * - CHAMADOS (id, nome_cidadao, cpf, contato, email, igreja, regiao, descricao, prioridade, categoria, status, data_abertura, data_modificacao, criado_por, email_criador)
 * - IGREJAS_REGIOES (nome_igreja, regiao)
 * - LOG_AUDITORIA (criada automaticamente)
 */
