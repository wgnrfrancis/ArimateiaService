/**
 * 🚀 GOOGLE APPS SCRIPT - ARIMATEIA SERVICE
 * 
 * Backend completo do sistema Balcão da Cidadania.
 * Funciona como API REST conectando diretamente com Google Sheets.
 * 
 * ARQUITETURA: Interface Web ↔ Google Apps Script ↔ Google Sheets
 * SEM Power Automate, SEM servidores externos, SEM dependências!
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
    const action = data.action || e.parameter.action;
    
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
      case 'getCategorias':
        return createResponse(getCategorias());
      case 'adicionarVoluntario':
        return createResponse(adicionarVoluntario(data));
      case 'buscarUsuarios':
        return createResponse(buscarUsuarios(data));
      case 'atualizarStatusUsuario':
        return createResponse(atualizarStatusUsuario(data));
      case 'atualizarTotaisIgrejas':
        return createResponse(atualizarTotaisIgrejas());
      case 'generateReport':
        return createResponse(generateReport(data));
      default:
        return createResponse({ error: 'Ação não reconhecida: ' + action }, false);
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
  
  // Buscar dados do usuário para auto-preenchimento
  const userInfo = data.userInfo;
  
  const rowData = [
    ticketId,                           // A - ID
    now,                               // B - DATA_ABERTURA
    data.nomeCidadao,                  // C - NOME_CIDADAO
    data.contato,                      // D - CONTATO (removido CPF)
    data.email || '',                  // E - EMAIL
    userInfo.igreja || '',             // F - IGREJA (do usuário logado)
    userInfo.regiao || '',             // G - REGIAO (do usuário logado)
    data.descricao,                    // H - DESCRICAO_DEMANDA
    'Aberto',                          // I - STATUS (sempre Aberto)
    data.prioridade || 'Média',        // J - PRIORIDADE
    data.categoria || 'Geral',         // K - CATEGORIA (selecionada)
    data.demanda || '',                // L - DEMANDA_ESPECIFICA (nova coluna)
    userInfo.name,                     // M - CRIADO_POR (usuário logado)
    userInfo.email,                    // N - CRIADO_POR_EMAIL (usuário logado)
    userInfo.name,                     // O - RESPONSAVEL_ATUAL (usuário logado)
    now,                               // P - DATA_ULTIMA_ATUALIZACAO
    '',                                // Q - OBSERVACOES (vazio inicialmente)
    '',                                // R - ANEXOS (vazio inicialmente)
    '',                                // S - TEMPO_RESOLUCAO (vazio inicialmente)
    ''                                 // T - SATISFACAO_CIDADAO (vazio inicialmente)
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
  
  const oldStatus = values[rowIndex - 1][8]; // Status anterior (coluna I)
  const now = new Date();
  
  // Atualizar campos modificados (ajustados para nova estrutura sem CPF + demanda específica)
  if (data.status) sheet.getRange(rowIndex, 9).setValue(data.status);        // I - STATUS
  if (data.prioridade) sheet.getRange(rowIndex, 10).setValue(data.prioridade); // J - PRIORIDADE
  if (data.categoria) sheet.getRange(rowIndex, 11).setValue(data.categoria);   // K - CATEGORIA
  if (data.demanda) sheet.getRange(rowIndex, 12).setValue(data.demanda);       // L - DEMANDA_ESPECIFICA
  if (data.responsavel) sheet.getRange(rowIndex, 15).setValue(data.responsavel); // O - RESPONSAVEL_ATUAL
  
  // Sempre atualizar data de última atualização
  sheet.getRange(rowIndex, 16).setValue(now); // P - DATA_ULTIMA_ATUALIZACAO
  
  // Adicionar observação se houver mudança de status
  if (data.status && data.status !== oldStatus) {
    addObservation(
      data.ticketId, 
      data.userInfo, 
      'Status Alterado', 
      oldStatus, 
      data.status, 
      data.observacao || `Status alterado de ${oldStatus} para ${data.status}`
    );
  }
  
  return { 
    success: true, 
    message: 'Chamado atualizado com sucesso!' 
  };
}

/**
 * 🗑️ EXCLUIR CHAMADO (Mover para aba de excluídos)
 */
function deleteTicket(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.CHAMADOS);
  const excludedSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.CHAMADOS_EXCLUIDOS);
  const dataRange = sheet.getDataRange();
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
  
  // Adicionar dados da exclusão
  const deleteInfo = [
    ...rowData,
    new Date(),           // Data exclusão
    data.userInfo.name,   // Excluído por
    data.motivo || 'Não informado' // Motivo
  ];
  
  // Mover para aba de excluídos
  excludedSheet.appendRow(deleteInfo);
  
  // Remover da aba principal
  sheet.deleteRow(rowIndex);
  
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
  
  // Verificar se email já existe
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][1] === data.email) { // Coluna B - EMAIL
      return { error: 'Email já cadastrado' };
    }
  }
  
  const userId = generateId('USR');
  const now = new Date();
  
  const rowData = [
    userId,           // A - ID
    data.email,       // B - EMAIL
    data.nome,        // C - NOME
    data.telefone,    // D - TELEFONE
    data.cargo,       // E - CARGO
    data.status || 'Ativo', // F - STATUS
    data.igreja,      // G - IGREJA
    data.regiao,      // H - REGIAO
    now,              // I - DATA_CADASTRO
    data.senha,       // J - SENHA (em produção usar hash)
    '',               // K - DISPONIBILIDADE
    '',               // L - EXPERIENCIA
    '',               // M - ULTIMO_LOGIN
    '',               // N - SESSIONS_ATIVAS
    '',               // O - DATA_ULTIMA_ATUALIZACAO
    ''                // P - OBSERVACOES
  ];
  
  sheet.appendRow(rowData);
  
  return { 
    success: true, 
    userId: userId,
    message: 'Usuário criado com sucesso!' 
  };
}

/**
 * 🔐 VALIDAR USUÁRIO (Login)
 */
function validateUser(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.USUARIOS);
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (row[1] === data.email && row[9] === data.senha) { // EMAIL e SENHA
      
      // Verificar se usuário está ativo
      if (row[5] !== 'Ativo') { // STATUS
        return { 
          error: 'Usuário inativo. Entre em contato com o coordenador.',
          status: row[5]
        };
      }
      
      // Atualizar último login
      const now = new Date();
      sheet.getRange(i + 1, 13).setValue(now); // ULTIMO_LOGIN
      
      return {
        success: true,
        user: {
          id: row[0],      // ID
          email: row[1],   // EMAIL
          name: row[2],    // NOME
          phone: row[3],   // TELEFONE
          role: row[4],    // CARGO
          status: row[5],  // STATUS
          igreja: row[6],  // IGREJA
          regiao: row[7]   // REGIAO
        }
      };
    }
  }
  
  return { error: 'Email ou senha incorretos' };
}

/**
 * 📋 BUSCAR CHAMADOS
 */
function getTickets(data = {}) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.CHAMADOS);
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  const headers = values[0];
  
  let tickets = [];
  
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const ticket = {};
    
    // Mapear colunas para objeto
    headers.forEach((header, index) => {
      ticket[header] = row[index];
    });
    
    // Aplicar filtros se fornecidos
    if (data.status && ticket.STATUS !== data.status) continue;
    if (data.igreja && ticket.IGREJA !== data.igreja) continue;
    if (data.regiao && ticket.REGIAO !== data.regiao) continue;
    if (data.usuario && ticket.CRIADO_POR !== data.usuario) continue;
    
    tickets.push(ticket);
  }
  
  // Ordenar por data de abertura (mais recentes primeiro)
  tickets.sort((a, b) => new Date(b.DATA_ABERTURA) - new Date(a.DATA_ABERTURA));
  
  return { 
    success: true, 
    tickets: tickets,
    total: tickets.length 
  };
}

/**
 * 👥 BUSCAR USUÁRIOS
 */
function getUsers(data = {}) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.USUARIOS);
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  const headers = values[0];
  
  let users = [];
  
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const user = {};
    
    // Mapear colunas para objeto (excluir senha)
    headers.forEach((header, index) => {
      if (header !== 'SENHA') {
        user[header] = row[index];
      }
    });
    
    // Aplicar filtros se fornecidos
    if (data.cargo && user.CARGO !== data.cargo) continue;
    if (data.status && user.STATUS !== data.status) continue;
    if (data.igreja && user.IGREJA !== data.igreja) continue;
    if (data.regiao && user.REGIAO !== data.regiao) continue;
    
    users.push(user);
  }
  
  return { 
    success: true, 
    users: users,
    total: users.length 
  };
}

/**
 * 📝 ADICIONAR OBSERVAÇÃO
 */
function addObservation(ticketId, userInfo, tipo, statusAnterior, statusNovo, observacao) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.OBSERVACOES_CHAMADOS);
  
  const obsId = generateId('OBS');
  const now = new Date();
  
  const rowData = [
    obsId,                    // A - ID
    ticketId,                 // B - CHAMADO_ID
    now,                      // C - DATA_OBSERVACAO
    userInfo.name,            // D - USUARIO
    userInfo.email,           // E - USUARIO_EMAIL
    tipo,                     // F - TIPO
    statusAnterior,           // G - STATUS_ANTERIOR
    statusNovo,               // H - STATUS_NOVO
    observacao                // I - OBSERVACAO
  ];
  
  sheet.appendRow(rowData);
  
  return obsId;
}

/**
 * 🎯 GERAR ID ÚNICO
 */
function generateId(prefix = 'ID') {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefix}_${timestamp}_${random}`.toUpperCase();
}

/**
 * 📊 GERAR RELATÓRIO
 */
function generateReport(data) {
  const chamadosSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.CHAMADOS);
  const usuariosSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.USUARIOS);
  const relatoriosSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.RELATORIOS_MENSAIS);
  
  const now = new Date();
  const periodo = data.periodo || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  // Buscar chamados do período
  const chamadosData = chamadosSheet.getDataRange().getValues();
  const usuariosData = usuariosSheet.getDataRange().getValues();
  
  let estatisticas = {
    periodo: periodo,
    totalChamados: 0,
    chamadosAbertos: 0,
    chamadosResolvidos: 0,
    chamadosFechados: 0,
    totalUsuarios: usuariosData.length - 1, // -1 para remover header
    usuariosAtivos: 0,
    usuariosPendentes: 0,
    tempoMedioResolucao: 0,
    igrejasMaisAtivas: {},
    categoriasMaisUsadas: {}
  };
  
  // Processar chamados
  for (let i = 1; i < chamadosData.length; i++) {
    const row = chamadosData[i];
    const dataAbertura = new Date(row[1]); // DATA_ABERTURA
    const status = row[8]; // STATUS
    const igreja = row[5]; // IGREJA
    const categoria = row[10]; // CATEGORIA
    
    // Filtrar por período se especificado
    if (data.periodo) {
      const chamadoPeriodo = `${dataAbertura.getFullYear()}-${String(dataAbertura.getMonth() + 1).padStart(2, '0')}`;
      if (chamadoPeriodo !== data.periodo) continue;
    }
    
    estatisticas.totalChamados++;
    
    // Contar por status
    if (status === 'Aberto') estatisticas.chamadosAbertos++;
    else if (status === 'Resolvido') estatisticas.chamadosResolvidos++;
    else if (status === 'Fechado') estatisticas.chamadosFechados++;
    
    // Contar por igreja
    if (igreja) {
      estatisticas.igrejasMaisAtivas[igreja] = (estatisticas.igrejasMaisAtivas[igreja] || 0) + 1;
    }
    
    // Contar por categoria
    if (categoria) {
      estatisticas.categoriasMaisUsadas[categoria] = (estatisticas.categoriasMaisUsadas[categoria] || 0) + 1;
    }
  }
  
  // Processar usuários
  for (let i = 1; i < usuariosData.length; i++) {
    const status = usuariosData[i][5]; // STATUS
    if (status === 'Ativo') estatisticas.usuariosAtivos++;
    else if (status === 'Pendente') estatisticas.usuariosPendentes++;
  }
  
  // Salvar relatório
  const reportId = generateId('REL');
  const reportRow = [
    reportId,
    now,
    periodo,
    JSON.stringify(estatisticas),
    data.userInfo?.name || 'Sistema',
    'Automático'
  ];
  
  relatoriosSheet.appendRow(reportRow);
  
  return {
    success: true,
    reportId: reportId,
    estatisticas: estatisticas
  };
}

/**
 * 📊 BUSCAR CATEGORIAS E DEMANDAS
 */
function getCategorias() {
  return {
    success: true,
    categorias: {
      "Documentação": [
        "Carteira de Identidade (RG)",
        "Certidão de Nascimento",
        "Certidão de Casamento",
        "Certidão de Óbito",
        "Título de Eleitor"
      ],
      "Previdência Social": [
        "Aposentadoria",
        "Auxílio-doença",
        "Benefício de Prestação Continuada (BPC)",
        "Pensão por morte",
        "Salário-maternidade"
      ],
      "Assistência Social": [
        "Cadastro Único (CadÚnico)",
        "Bolsa Família",
        "Auxílio Brasil",
        "Tarifa Social de Energia",
        "Benefícios eventuais"
      ],
      "Direitos do Trabalhador": [
        "Carteira de Trabalho Digital",
        "Seguro-desemprego",
        "FGTS",
        "PIS/PASEP"
      ],
      "Outros Serviços": [
        "Orientação jurídica",
        "Informações sobre direitos",
        "Encaminhamentos",
        "Outros"
      ]
    }
  };
}

/**
 * 👥 BUSCAR USUÁRIOS PARA COORDENADOR
 */
function buscarUsuarios(data = {}) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.USUARIOS);
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  const usuarios = [];
  
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    
    // Aplicar filtros
    if (data.filtros) {
      if (data.filtros.cargo && row[4] !== data.filtros.cargo) continue;
      if (data.filtros.status && row[5] !== data.filtros.status) continue;
      if (data.filtros.igreja && row[6] !== data.filtros.igreja) continue;
      if (data.filtros.regiao && row[7] !== data.filtros.regiao) continue;
    }
    
    usuarios.push({
      id: row[0],
      email: row[1],
      nome: row[2],
      telefone: row[3],
      cargo: row[4],
      status: row[5],
      igreja: row[6],
      regiao: row[7],
      dataCadastro: row[8],
      ultimoLogin: row[12],
      observacoes: row[15]
    });
  }
  
  return {
    success: true,
    usuarios: usuarios,
    total: usuarios.length
  };
}

/**
 * ✏️ ATUALIZAR STATUS DE USUÁRIO
 */
function atualizarStatusUsuario(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.USUARIOS);
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === data.userId) { // Coluna A - ID
      // Atualizar status (coluna F - índice 5)
      sheet.getRange(i + 1, 6).setValue(data.novoStatus);
      
      // Atualizar data de última atualização (coluna O - índice 14)
      sheet.getRange(i + 1, 15).setValue(new Date());
      
      // Se está alterando cargo, atualizar também (coluna E - índice 4)
      if (data.novoCargo) {
        sheet.getRange(i + 1, 5).setValue(data.novoCargo);
      }
      
      // Atualizar observações se fornecidas (coluna P - índice 15)
      if (data.observacoes) {
        const observacaoAtual = values[i][15] || '';
        const novaObservacao = `${observacaoAtual}\n[${new Date().toLocaleDateString()}] Status alterado para ${data.novoStatus} por ${data.userInfo.name}`;
        sheet.getRange(i + 1, 16).setValue(novaObservacao);
      }
      
      return { 
        success: true, 
        message: `Status do usuário alterado para ${data.novoStatus} com sucesso!` 
      };
    }
  }
  
  return { 
    success: false, 
    error: 'Usuário não encontrado' 
  };
}

/**
 * 👤 ADICIONAR NOVO VOLUNTÁRIO
 */
function adicionarVoluntario(data) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.USUARIOS);
    
    // Verificar se email já existe
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][1] === data.dados.email) { // Coluna B - EMAIL
        return { 
          success: false, 
          error: 'Este email já está cadastrado no sistema' 
        };
      }
    }
    
    const userId = generateId('USR');
    const now = new Date();
    
    // Estrutura da linha conforme USUARIOS aba
    const rowData = [
      userId,                         // A - ID
      data.dados.email,              // B - EMAIL
      data.dados.nome,               // C - NOME
      data.dados.telefone || '',     // D - TELEFONE
      'VOLUNTARIO',                  // E - CARGO (sempre voluntário para cadastro público)
      data.dados.status || 'Pendente', // F - STATUS (Pendente aguardando aprovação)
      data.dados.igreja,             // G - IGREJA
      data.dados.regiao,             // H - REGIAO
      now,                           // I - DATA_CADASTRO
      data.dados.senha,              // J - SENHA (hash básico - em produção usar bcrypt)
      data.dados.disponibilidade || '', // K - DISPONIBILIDADE
      data.dados.experiencia || '',     // L - EXPERIENCIA
      '',                            // M - ULTIMO_LOGIN (vazio)
      '',                            // N - SESSIONS_ATIVAS (vazio)
      '',                            // O - DATA_ULTIMA_ATUALIZACAO (vazio)
      ''                             // P - OBSERVACOES (vazio)
    ];
    
    sheet.appendRow(rowData);
    
    // Atualizar totais das igrejas após adicionar voluntário
    atualizarTotaisIgrejas();
    
    return { 
      success: true, 
      message: 'Voluntário cadastrado com sucesso! Aguarde aprovação do coordenador.',
      data: {
        userId: userId,
        status: data.dados.status || 'Pendente'
      }
    };
    
  } catch (error) {
    console.error('Erro ao adicionar voluntário:', error);
    return { 
      success: false, 
      error: 'Erro interno: ' + error.toString() 
    };
  }
}

/**
 * 🏛️ ATUALIZAR TOTAIS DAS IGREJAS
 */
function atualizarTotaisIgrejas() {
  try {
    const usuariosSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.USUARIOS);
    const igrejasSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.IGREJAS_REGIOES);
    const chamadosSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.CHAMADOS);
    
    // Obter dados dos usuários
    const usuariosData = usuariosSheet.getDataRange().getValues();
    const igrejasData = igrejasSheet.getDataRange().getValues();
    const chamadosData = chamadosSheet.getDataRange().getValues();
    
    // Contar voluntários e atendimentos por igreja
    const totaisPorIgreja = {};
    
    // Contar voluntários (usuários ativos)
    for (let i = 1; i < usuariosData.length; i++) {
      const igreja = usuariosData[i][6]; // Coluna G - IGREJA
      const status = usuariosData[i][5]; // Coluna F - STATUS
      
      if (igreja && status === 'Ativo') {
        if (!totaisPorIgreja[igreja]) {
          totaisPorIgreja[igreja] = { voluntarios: 0, atendimentos: 0 };
        }
        totaisPorIgreja[igreja].voluntarios++;
      }
    }
    
    // Contar atendimentos (chamados resolvidos)
    for (let i = 1; i < chamadosData.length; i++) {
      const igreja = chamadosData[i][5]; // Coluna F - IGREJA
      const status = chamadosData[i][8]; // Coluna I - STATUS
      
      if (igreja && (status === 'Resolvido' || status === 'Fechado')) {
        if (!totaisPorIgreja[igreja]) {
          totaisPorIgreja[igreja] = { voluntarios: 0, atendimentos: 0 };
        }
        totaisPorIgreja[igreja].atendimentos++;
      }
    }
    
    // Atualizar planilha IGREJAS_REGIOES
    for (let i = 1; i < igrejasData.length; i++) {
      const nomeIgreja = igrejasData[i][1]; // Coluna B - NOME_IGREJA
      
      if (nomeIgreja && totaisPorIgreja[nomeIgreja]) {
        // Atualizar TOTAL_VOLUNTARIOS (coluna I)
        igrejasSheet.getRange(i + 1, 9).setValue(totaisPorIgreja[nomeIgreja].voluntarios);
        
        // Atualizar TOTAL_ATENDIMENTOS (coluna J)
        igrejasSheet.getRange(i + 1, 10).setValue(totaisPorIgreja[nomeIgreja].atendimentos);
        
        // Atualizar DATA_ULTIMA_ATUALIZACAO (coluna K)
        igrejasSheet.getRange(i + 1, 11).setValue(new Date());
      }
    }
    
    return { success: true, message: 'Totais das igrejas atualizados com sucesso!' };
    
  } catch (error) {
    console.error('Erro ao atualizar totais das igrejas:', error);
    return { success: false, error: 'Erro ao atualizar totais: ' + error.toString() };
  }
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
