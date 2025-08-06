// ========================================
// BALCÃO DA CIDADANIA - GOOGLE APPS SCRIPT
// Sistema completo de gerenciamento
// Versão: 2.0.1 - CORRIGIDA PARA CORS
// ========================================
//
// ✅ CORREÇÕES APLICADAS:
// 1. Removido .setHeader() que causa erro no Google Apps Script
// 2. Adicionada verificação de 'e' undefined para testes manuais
// 3. doOptions() simplificado para compatibilidade
// 4. Melhor tratamento de erros
//
// ⚠️ IMPORTANTE:
// - NÃO execute doPost() manualmente no editor (causa erro)
// - Use testConnection via GET ou via aplicação web
// - CORS é resolvido nativamente pelo Google Apps Script
// ========================================

// CONFIGURAÇÕES GLOBAIS
const SPREADSHEET_ID = '1awSUcZPlvM0Ci5ecKWCG4uwDbR3ZT5ZeDOuVdOIGMuc'; // ID da planilha do Balcão da Cidadania

/**
 * Função principal que processa todas as requisições POST
 */
function doPost(e) {
  try {
    console.log('📨 Nova requisição recebida');
    
    // Parse dos dados recebidos
    let data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }
    
    console.log('� Dados recebidos:', data);
    console.log('🎯 Ação solicitada:', data.action);
    
    // Roteamento das ações
    let response;
    switch (data.action) {
      case 'validateUser':
        response = createCorsResponse(validateUser(data));
        break;
          
      case 'newUser':
        response = createCorsResponse(newUser(data));
        break;
          
      case 'checkUserExists':
        response = createCorsResponse(checkUserExists(data));
        break;
          
      case 'newTicket':
        response = createCorsResponse(newTicket(data));
        break;
          
      case 'getTickets':
        response = createCorsResponse(getTickets(data));
        break;
          
      case 'updateTicket':
        response = createCorsResponse(updateTicket(data));
        break;
          
      case 'getUsers':
        response = createCorsResponse(getUsers(data));
        break;
          
      case 'getUserStats':
        response = createCorsResponse(getUserStats(data));
        break;
          
      case 'getDashboardData':
        response = createCorsResponse(getDashboardData(data));
        break;
          
      case 'getIgrejasRegioes':
        response = createCorsResponse(getIgrejasRegioes());
        break;
          
      case 'getCategories':
        response = createCorsResponse(getCategories());
        break;
          
      case 'getVolunteers':
        response = createCorsResponse(getVolunteers());
        break;
          
      case 'getProfessionals':
        response = createCorsResponse(getProfessionals());
        break;
          
      case 'testConnection':
        response = createCorsResponse(testConnection());
        break;
          
      default:
        console.error('❌ Ação não reconhecida:', data.action);
        response = createCorsResponse({
          success: false,
          error: 'Ação não reconhecida: ' + data.action
        });
    }
    
    return response;
  } catch (error) {
    console.error('❌ Erro no doPost:', error);
    return createCorsResponse({
      success: false,
      error: error.message
    });
  }
}

/**
 * Função para processar requisições GET
 */
function doGet(e) {
  try {
    console.log('📨 Nova requisição GET recebida');
    
    // ✅ CORREÇÃO: Verificar se parâmetro existe
    const action = e && e.parameter ? e.parameter.action : null;
    
    if (!action) {
      return createCorsResponse({
        success: true,
        message: 'API do Balcão da Cidadania está funcionando!',
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        availableActions: ['testConnection', 'getIgrejasRegioes', 'getCategories']
      });
    }
    
    // Roteamento para ações GET
    let result;
    switch (action) {
      case 'testConnection':
        result = testConnection();
        break;
        
      case 'getIgrejasRegioes':
        result = getIgrejasRegioes();
        break;
        
      case 'getCategories':
        result = getCategories();
        break;
        
      default:
        result = {
          success: false,
          error: 'Ação GET não reconhecida: ' + action
        };
    }
    
    return createCorsResponse(result);
    
  } catch (error) {
    console.error('❌ Erro no doGet:', error);
    return createCorsResponse({
      success: false,
      error: error.message || error.toString()
    });
  }
}

/**
 * ✅ Função que retorna resposta com headers CORS corretos (CORRIGIDA)
 * PROBLEMA RESOLVIDO: Google Apps Script não suporta setHeader em TextOutput
 */
function createCorsResponse(obj) {
  // ✅ CORREÇÃO: Usar apenas ContentService sem setHeader
  // Os headers CORS são tratados pelo Google Apps Script automaticamente
  // quando configuramos doOptions() corretamente
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * ✅ Função para lidar com requisições OPTIONS (preflight) - CORRIGIDA
 * Esta é a função que realmente resolve o CORS
 */
function doOptions(e) {
  // ✅ CORREÇÃO: Retornar resposta vazia com headers CORS básicos
  // O Google Apps Script permite CORS nativamente se retornarmos texto simples
  return ContentService
    .createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Teste de conexão
 */
function testConnection() {
  try {
    console.log('� Testando conexão...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheets = spreadsheet.getSheets();
    
    return {
      success: true,
      message: 'Conexão estabelecida com sucesso!',
      timestamp: new Date().toISOString(),
      spreadsheetId: SPREADSHEET_ID,
      sheetsCount: sheets.length,
      sheetsNames: sheets.map(sheet => sheet.getName())
    };
    
  } catch (error) {
    console.error('❌ Erro no teste de conexão:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Validar usuário para login
 */
function validateUser(requestData) {
  try {
    console.log('🔐 Validando usuário...');
    
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
    
    console.log('📧 Email:', email);
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName('USUARIOS');
    
    if (!sheet) {
      throw new Error('Aba USUARIOS não encontrada');
    }
    
    const range = sheet.getDataRange();
    const values = range.getValues();
    
    if (values.length <= 1) {
      throw new Error('Nenhum usuário cadastrado');
    }
    
    const headers = values[0];
    
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const userData = {};
      
      headers.forEach((header, index) => {
        userData[header] = row[index];
      });
      
      if (userData.EMAIL === email && userData.SENHA === senha) {
        console.log('✅ Usuário validado com sucesso');
        
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
    
    console.log('❌ Credenciais inválidas');
    return {
      success: false,
      error: 'Email ou senha incorretos'
    };
    
  } catch (error) {
    console.error('❌ Erro na validação:', error);
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
    console.log('👤 Criando novo usuário...');
    
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
    
    console.log('✅ Usuário criado com sucesso');
    
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
    console.error('❌ Erro ao criar usuário:', error);
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
    console.log('🔍 Verificando se usuário existe...');
    
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
    console.error('❌ Erro ao verificar usuário:', error);
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
    console.log('🎫 Criando novo chamado...');
    
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
    
    console.log('✅ Chamado criado com sucesso:', ticketId);
    
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
    console.error('❌ Erro ao criar chamado:', error);
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
    console.log('📋 Buscando chamados...');
    
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
    
    console.log(`✅ Encontrados ${tickets.length} chamados`);
    
    return {
      success: true,
      data: tickets,
      total: tickets.length
    };
    
  } catch (error) {
    console.error('❌ Erro ao buscar chamados:', error);
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
    console.log('📝 Atualizando chamado...');
    
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
        
        console.log('✅ Chamado atualizado com sucesso');
        
        return {
          success: true,
          message: 'Chamado atualizado com sucesso!'
        };
      }
    }
    
    throw new Error('Chamado não encontrado');
    
  } catch (error) {
    console.error('❌ Erro ao atualizar chamado:', error);
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
    console.log('👥 Buscando usuários...');
    
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
    
    console.log(`✅ Encontrados ${users.length} usuários`);
    
    return {
      success: true,
      data: users,
      total: users.length
    };
    
  } catch (error) {
    console.error('❌ Erro ao buscar usuários:', error);
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
    console.log('📊 Buscando estatísticas do usuário...');
    
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
    
    console.log('✅ Estatísticas calculadas');
    
    return {
      success: true,
      data: stats
    };
    
  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error);
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
    console.log('📈 Buscando dados do dashboard...');
    
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
    
    console.log('✅ Dados do dashboard calculados');
    
    return {
      success: true,
      data: dashboardData
    };
    
  } catch (error) {
    console.error('❌ Erro ao buscar dados do dashboard:', error);
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
    console.log('🔍 Buscando dados da aba IGREJAS_REGIOES...');
    
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
    
    console.log(`✅ Encontradas ${regioes.length} regiões e ${totalIgrejas} igrejas`);
    
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
    console.error('❌ Erro ao buscar igrejas e regiões:', error);
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
    console.log('🏷️ Buscando categorias...');
    
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
    console.error('❌ Erro ao buscar categorias:', error);
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
    console.log('🤝 Buscando voluntários...');
    
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
    console.error('❌ Erro ao buscar voluntários:', error);
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
    console.log('👨‍💼 Buscando profissionais...');
    
    // Por enquanto retorna array vazio - implementar conforme necessidade
    // Pode buscar de uma aba específica PROFISSIONAIS ou filtrar usuários por cargo
    
    return {
      success: true,
      data: []
    };
    
  } catch (error) {
    console.error('❌ Erro ao buscar profissionais:', error);
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
    console.error('Erro ao registrar log:', error);
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
    throw new Error(`Campos obrigatórios não preenchidos: ${missing.join(', ')}`);
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

console.log('🚀 Google Apps Script do Balcão da Cidadania carregado com sucesso!');

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
 * 
 * PLANILHA NECESSÁRIA:
 * ID: 1awSUcZPlvM0Ci5ecKWCG4uwDbR3ZT5ZeDOuVdOIGMuc
 * 
 * ABAS NECESSÁRIAS:
 * - USUARIOS (nome, email, telefone, cargo, igreja, regiao, senha, data_cadastro, observacoes, status)
 * - CHAMADOS (id, nome_cidadao, cpf, contato, email, igreja, regiao, descricao, prioridade, categoria, status, data_abertura, data_modificacao, criado_por, email_criador)
 * - IGREJAS_REGIOES (nome_igreja, regiao)
 * - LOG_AUDITORIA (timestamp, acao, usuario, email, dados) [criada automaticamente]
 */
