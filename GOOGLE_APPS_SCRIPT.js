/**
 * 🚀 GOOGLE APPS SCRIPT - ARIMATEIA SERVICE
 * 
 * Este script deve ser copiado para o Google Apps Script (script.google.com)
 * e configurado como Web App para integrar com a aplicação Balcão da Cidadania.
 * 
 * INSTRUÇÕES DE CONFIGURAÇÃO:
 * 1. Acesse script.google.com
 * 2. Crie um novo projeto
 * 3. Cole este código no editor
 * 4. Salve o projeto com nome "Arimateia Service API"
 * 5. Clique em "Implantar" > "Nova implantação"
 * 6. Tipo: "Aplicativo da Web"
 * 7. Executar como: "Eu"
 * 8. Quem tem acesso: "Qualquer pessoa"
 * 9. Copie a URL gerada e cole no config.js
 */

// ID da planilha (extraído da URL fornecida)
const SPREADSHEET_ID = '1awSUcZPlvM0Ci5ecKWCG4uwDbR3ZT5ZeDOuVdOIGMuc';

// Nomes das abas conforme modelo
const SHEETS = {
  CHAMADOS: 'CHAMADOS',
  USUARIOS: 'USUARIOS', 
  OBSERVACOES_CHAMADOS: 'OBSERVACOES_CHAMADOS',
  CHAMADOS_EXCLUIDOS: 'CHAMADOS_EXCLUIDOS',
  IGREJAS_REGIOES: 'IGREJAS_REGIOES',
  CATEGORIAS_SERVICOS: 'CATEGORIAS_SERVICOS',
  RELATORIOS_MENSAIS: 'RELATORIOS_MENSAIS'
};

/**
 * 🎯 FUNÇÃO PRINCIPAL - Processa todas as requisições
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = e.parameter.action;
    
    console.log(`Ação recebida: ${action}`, data);
    
    switch (action) {
      case 'newTicket':
        return createResponse(createNewTicket(data));
      case 'updateTicket':
        return createResponse(updateTicket(data));
      case 'deleteTicket':
        return createResponse(deleteTicket(data));
      case 'newUser':
        return createResponse(createNewUser(data));
      case 'validateUser':
        return createResponse(validateUser(data));
      case 'getTickets':
        return createResponse(getTickets(data));
      case 'getUsers':
        return createResponse(getUsers(data));
      case 'generateReport':
        return createResponse(generateReport(data));
      default:
        return createResponse({ error: 'Ação não reconhecida' }, false);
    }
  } catch (error) {
    console.error('Erro no doPost:', error);
    return createResponse({ error: error.toString() }, false);
  }
}

/**
 * 📋 CRIAR NOVO CHAMADO
 */
function createNewTicket(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.CHAMADOS);
  
  const ticketId = generateId('CH');
  const now = new Date();
  
  const rowData = [
    ticketId,                           // A - ID
    now,                               // B - DATA_ABERTURA
    data.nomeCidadao,                  // C - NOME_CIDADAO
    data.cpf,                          // D - CPF
    data.contato,                      // E - CONTATO
    data.email || '',                  // F - EMAIL
    data.igreja,                       // G - IGREJA
    data.regiao,                       // H - REGIAO
    data.descricao,                    // I - DESCRICAO_DEMANDA
    'Aberto',                          // J - STATUS
    data.prioridade || 'Média',        // K - PRIORIDADE
    data.categoria || 'Geral',         // L - CATEGORIA
    data.userInfo.name,                // M - CRIADO_POR
    data.userInfo.email,               // N - CRIADO_POR_EMAIL
    data.userInfo.name,                // O - RESPONSAVEL_ATUAL
    now,                               // P - DATA_ULTIMA_ATUALIZACAO
    '',                                // Q - OBSERVACOES
    '',                                // R - ANEXOS
    '',                                // S - TEMPO_RESOLUCAO
    ''                                 // T - SATISFACAO_CIDADAO
  ];
  
  sheet.appendRow(rowData);
  
  // Adicionar observação inicial
  addObservation(ticketId, data.userInfo, 'Chamado Criado', '', 'Aberto', 'Chamado criado no sistema');
  
  return { 
    success: true, 
    ticketId: ticketId,
    message: 'Chamado criado com sucesso!'
  };
}

/**
 * ✏️ ATUALIZAR CHAMADO
 */
function updateTicket(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.CHAMADOS);
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  // Encontrar linha do chamado
  let rowIndex = -1;
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === data.ticketId) {
      rowIndex = i + 1;
      break;
    }
  }
  
  if (rowIndex === -1) {
    return { error: 'Chamado não encontrado' };
  }
  
  const oldStatus = values[rowIndex - 1][9]; // Status anterior
  const now = new Date();
  
  // Atualizar campos modificados
  if (data.status) sheet.getRange(rowIndex, 10).setValue(data.status);
  if (data.prioridade) sheet.getRange(rowIndex, 11).setValue(data.prioridade);
  if (data.responsavel) sheet.getRange(rowIndex, 15).setValue(data.responsavel);
  if (data.observacoes) sheet.getRange(rowIndex, 17).setValue(data.observacoes);
  
  // Sempre atualizar data de última atualização
  sheet.getRange(rowIndex, 16).setValue(now);
  
  // Se status mudou, calcular tempo de resolução
  if (data.status === 'Resolvido' && oldStatus !== 'Resolvido') {
    const dataAbertura = values[rowIndex - 1][1];
    const tempoResolucao = Math.ceil((now - dataAbertura) / (1000 * 60 * 60 * 24));
    sheet.getRange(rowIndex, 19).setValue(tempoResolucao);
  }
  
  // Adicionar observação
  addObservation(
    data.ticketId, 
    data.userInfo, 
    'Status Alterado', 
    oldStatus, 
    data.status || oldStatus, 
    data.observacao || 'Chamado atualizado'
  );
  
  return { 
    success: true, 
    message: 'Chamado atualizado com sucesso!'
  };
}

/**
 * 🗑️ EXCLUIR CHAMADO (LÓGICO)
 */
function deleteTicket(data) {
  const chamadosSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.CHAMADOS);
  const excluidosSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.CHAMADOS_EXCLUIDOS);
  
  const dataRange = chamadosSheet.getDataRange();
  const values = dataRange.getValues();
  
  // Encontrar linha do chamado
  let rowIndex = -1;
  let rowData = null;
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === data.ticketId) {
      rowIndex = i + 1;
      rowData = values[i];
      break;
    }
  }
  
  if (rowIndex === -1) {
    return { error: 'Chamado não encontrado' };
  }
  
  // Mover para aba de excluídos
  const excludedRowData = [
    data.ticketId,                     // A - ID_ORIGINAL
    new Date(),                        // B - DATA_EXCLUSAO
    data.userInfo.name,                // C - EXCLUIDO_POR
    data.userInfo.email,               // D - EXCLUIDO_POR_EMAIL
    data.motivo || 'Não informado',    // E - MOTIVO_EXCLUSAO
    JSON.stringify(rowData)            // F - DADOS_ORIGINAIS
  ];
  
  excluidosSheet.appendRow(excludedRowData);
  
  // Remover da aba principal
  chamadosSheet.deleteRow(rowIndex);
  
  return { 
    success: true, 
    message: 'Chamado excluído com sucesso!'
  };
}

/**
 * 👤 CRIAR NOVO USUÁRIO
 */
function createNewUser(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.USUARIOS);
  
  const userId = generateId('USR');
  const now = new Date();
  
  const rowData = [
    userId,                            // A - ID
    data.nomeCompleto,                 // B - NOME_COMPLETO
    data.email,                        // C - EMAIL
    data.telefone,                     // D - TELEFONE
    data.cargo,                        // E - CARGO
    data.igreja,                       // F - IGREJA
    data.regiao,                       // G - REGIAO
    now,                               // H - DATA_CADASTRO
    'Ativo',                           // I - STATUS
    '',                                // J - ULTIMO_ACESSO
    0,                                 // K - TOTAL_CHAMADOS
    0,                                 // L - CHAMADOS_RESOLVIDOS
    '0%',                              // M - TAXA_RESOLUCAO
    data.userInfo.name,                // N - CRIADO_POR
    data.observacoes || ''             // O - OBSERVACOES
  ];
  
  sheet.appendRow(rowData);
  
  return { 
    success: true, 
    userId: userId,
    message: 'Usuário criado com sucesso!'
  };
}

/**
 * 🔐 VALIDAR USUÁRIO (LOGIN)
 */
function validateUser(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.USUARIOS);
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  // Procurar usuário por email
  for (let i = 1; i < values.length; i++) {
    if (values[i][2] === data.email && values[i][8] === 'Ativo') {
      // Atualizar último acesso
      sheet.getRange(i + 1, 10).setValue(new Date());
      
      return {
        success: true,
        user: {
          id: values[i][0],
          name: values[i][1],
          email: values[i][2],
          role: values[i][4],
          igreja: values[i][5],
          regiao: values[i][6]
        }
      };
    }
  }
  
  return { 
    success: false, 
    message: 'Usuário não encontrado ou inativo'
  };
}

/**
 * 📋 LISTAR CHAMADOS
 */
function getTickets(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.CHAMADOS);
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  const tickets = [];
  
  for (let i = 1; i < values.length; i++) {
    const ticket = {
      id: values[i][0],
      dataAbertura: values[i][1],
      nomeCidadao: values[i][2],
      cpf: values[i][3],
      contato: values[i][4],
      email: values[i][5],
      igreja: values[i][6],
      regiao: values[i][7],
      descricao: values[i][8],
      status: values[i][9],
      prioridade: values[i][10],
      categoria: values[i][11],
      criadoPor: values[i][12],
      responsavel: values[i][14],
      dataAtualizacao: values[i][15],
      observacoes: values[i][16]
    };
    
    // Aplicar filtros se fornecidos
    if (data.filters) {
      if (data.filters.regiao && ticket.regiao !== data.filters.regiao) continue;
      if (data.filters.igreja && ticket.igreja !== data.filters.igreja) continue;
      if (data.filters.status && ticket.status !== data.filters.status) continue;
    }
    
    tickets.push(ticket);
  }
  
  return { 
    success: true, 
    tickets: tickets 
  };
}

/**
 * 👥 LISTAR USUÁRIOS
 */
function getUsers(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.USUARIOS);
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  const users = [];
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][8] === 'Ativo') { // Apenas usuários ativos
      users.push({
        id: values[i][0],
        nome: values[i][1],
        email: values[i][2],
        telefone: values[i][3],
        cargo: values[i][4],
        igreja: values[i][5],
        regiao: values[i][6],
        totalChamados: values[i][10],
        chamadosResolvidos: values[i][11],
        taxaResolucao: values[i][12]
      });
    }
  }
  
  return { 
    success: true, 
    users: users 
  };
}

/**
 * 📊 GERAR RELATÓRIO MENSAL
 */
function generateReport(data) {
  const chamadosSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.CHAMADOS);
  const relatoriosSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.RELATORIOS_MENSAIS);
  
  const month = data.month || new Date().getMonth() + 1;
  const year = data.year || new Date().getFullYear();
  const anoMes = `${year}-${month.toString().padStart(2, '0')}`;
  
  // Buscar dados do mês
  const dataRange = chamadosSheet.getDataRange();
  const values = dataRange.getValues();
  
  let totalChamados = 0;
  let chamadosResolvidos = 0;
  let tempoTotal = 0;
  let tempoCount = 0;
  const igrejas = {};
  const categorias = {};
  
  for (let i = 1; i < values.length; i++) {
    const dataAbertura = new Date(values[i][1]);
    if (dataAbertura.getFullYear() === year && dataAbertura.getMonth() + 1 === month) {
      totalChamados++;
      
      if (values[i][9] === 'Resolvido') {
        chamadosResolvidos++;
        if (values[i][18]) {
          tempoTotal += values[i][18];
          tempoCount++;
        }
      }
      
      // Contar por igreja
      const igreja = values[i][6];
      igrejas[igreja] = (igrejas[igreja] || 0) + 1;
      
      // Contar por categoria
      const categoria = values[i][11];
      categorias[categoria] = (categorias[categoria] || 0) + 1;
    }
  }
  
  const taxaResolucao = totalChamados > 0 ? (chamadosResolvidos / totalChamados * 100).toFixed(1) + '%' : '0%';
  const tempoMedio = tempoCount > 0 ? (tempoTotal / tempoCount).toFixed(1) : 0;
  
  // Igreja mais ativa
  let igrejaMaisAtiva = '';
  let maxAtendimentos = 0;
  for (const igreja in igrejas) {
    if (igrejas[igreja] > maxAtendimentos) {
      maxAtendimentos = igrejas[igreja];
      igrejaMaisAtiva = igreja;
    }
  }
  
  // Categoria mais demandada
  let categoriaMaisDemandada = '';
  let maxDemanda = 0;
  for (const categoria in categorias) {
    if (categorias[categoria] > maxDemanda) {
      maxDemanda = categorias[categoria];
      categoriaMaisDemandada = categoria;
    }
  }
  
  const reportData = [
    anoMes,                           // A - ANO_MES
    totalChamados,                    // B - TOTAL_CHAMADOS
    chamadosResolvidos,               // C - CHAMADOS_RESOLVIDOS
    taxaResolucao,                    // D - TAXA_RESOLUCAO
    tempoMedio,                       // E - TEMPO_MEDIO_RESOLUCAO
    0,                                // F - TOTAL_VOLUNTARIOS_ATIVOS (calcular separadamente)
    igrejaMaisAtiva,                  // G - IGREJA_MAIS_ATIVA
    categoriaMaisDemandada,           // H - CATEGORIA_MAIS_DEMANDADA
    4.0                               // I - SATISFACAO_MEDIA (mock)
  ];
  
  relatoriosSheet.appendRow(reportData);
  
  return { 
    success: true, 
    report: {
      periodo: anoMes,
      totalChamados,
      chamadosResolvidos,
      taxaResolucao,
      tempoMedio,
      igrejaMaisAtiva,
      categoriaMaisDemandada
    }
  };
}

/**
 * 📝 ADICIONAR OBSERVAÇÃO
 */
function addObservation(ticketId, userInfo, tipoAcao, statusAnterior, statusNovo, observacao) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.OBSERVACOES_CHAMADOS);
  
  const obsId = generateId('OBS');
  const now = new Date();
  
  const rowData = [
    obsId,                            // A - ID_OBSERVACAO
    ticketId,                         // B - ID_CHAMADO
    now,                              // C - DATA_HORA
    userInfo.name,                    // D - USUARIO
    userInfo.email,                   // E - USUARIO_EMAIL
    tipoAcao,                         // F - TIPO_ACAO
    statusAnterior,                   // G - STATUS_ANTERIOR
    statusNovo,                       // H - STATUS_NOVO
    observacao,                       // I - OBSERVACAO
    ''                                // J - ANEXOS
  ];
  
  sheet.appendRow(rowData);
}

/**
 * 🆔 GERAR ID ÚNICO
 */
function generateId(prefix) {
  const timestamp = new Date().getTime().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
}

/**
 * 📤 CRIAR RESPOSTA PADRONIZADA
 */
function createResponse(data, success = true) {
  const response = {
    success: success,
    timestamp: new Date().toISOString(),
    ...data
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 🧪 FUNÇÃO DE TESTE (opcional)
 */
function testAPI() {
  const testData = {
    nomeCidadao: 'João Teste',
    cpf: '123.456.789-00',
    contato: '(11) 99999-9999',
    igreja: 'Igreja Teste',
    regiao: 'Norte',
    descricao: 'Teste de integração',
    userInfo: {
      name: 'Admin Teste',
      email: 'admin@teste.com'
    }
  };
  
  const result = createNewTicket(testData);
  console.log('Resultado do teste:', result);
}
