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
  RELATORIOS_MENSAIS: 'RELATORIOS_MENSAIS',
  PROFISSIONAIS_LIBERAIS: 'PROFISSIONAIS_LIBERAIS',
  ASSESSORES: 'ASSESSORES',
  ELEICOES_DEPUTADOS: 'ELEICOES_DEPUTADOS',
  ELEICOES_VEREADORES: 'ELEICOES_VEREADORES',
  ELEICOES_CONSELHO: 'ELEICOES_CONSELHO'
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
      case 'generateAdvancedReport':
        return createResponse(generateAdvancedReport(data));
      case 'adicionarProfissional':
        return createResponse(adicionarProfissional(data));
      case 'buscarProfissionais':
        return createResponse(buscarProfissionais(data));
      case 'atualizarProfissional':
        return createResponse(atualizarProfissional(data));
      case 'removerProfissional':
        return createResponse(removerProfissional(data));
      case 'getProfissoes':
        return createResponse(getProfissoes());
      case 'adicionarAssessor':
        return createResponse(adicionarAssessor(data));
      case 'buscarAssessores':
        return createResponse(buscarAssessores(data));
      case 'atualizarAssessor':
        return createResponse(atualizarAssessor(data));
      case 'removerAssessor':
        return createResponse(removerAssessor(data));
      case 'adicionarMunicipio':
        return createResponse(adicionarMunicipio(data));
      case 'buscarMunicipios':
        return createResponse(buscarMunicipios(data));
      case 'atualizarMunicipio':
        return createResponse(atualizarMunicipio(data));
      case 'removerMunicipio':
        return createResponse(removerMunicipio(data));
      case 'generateElectoralReport':
        return createResponse(generateElectoralReport(data));
      case 'getElectoralData':
        return createResponse(getElectoralData(data));
      
      // 🗳️ Vereadores
      case 'adicionarVereador':
        return createResponse(adicionarVereador(data));
      case 'buscarVereadores':
        return createResponse(buscarVereadores(data));
      case 'atualizarVereador':
        return createResponse(atualizarVereador(data));
      case 'removerVereador':
        return createResponse(removerVereador(data));
      case 'generateVereadorReport':
        return createResponse(generateVereadorReport(data));
      case 'getVereadorData':
        return createResponse(getVereadorData(data));
        
      // 🏛️ Conselho
      case 'adicionarConselheiro':
        return createResponse(adicionarConselheiro(data));
      case 'buscarConselheiros':
        return createResponse(buscarConselheiros(data));
      case 'atualizarConselheiro':
        return createResponse(atualizarConselheiro(data));
      case 'removerConselheiro':
        return createResponse(removerConselheiro(data));
      case 'generateConselhoReport':
        return createResponse(generateConselhoReport(data));
      case 'getConselhoData':
        return createResponse(getConselhoData(data));

      // 📊 Dashboard Analytics
      case 'getDashboardAnalytics':
        return createResponse(getDashboardAnalytics(data));
      case 'getChamadosAnalytics':
        return createResponse(getChamadosAnalytics(data));
      case 'getRegionalAnalytics':
        return createResponse(getRegionalAnalytics(data));
      case 'getProgressAnalytics':
        return createResponse(getProgressAnalytics(data));
        
      case 'gerarRelatorioGeral':
        return createResponse(gerarRelatorioGeral(data));
        
      case 'gerarRelatorioPorRegiao':
        return createResponse(gerarRelatorioPorRegiao(data));
        
      case 'gerarRelatorioPorIgreja':
        return createResponse(gerarRelatorioPorIgreja(data));
        
      // 📁 Mídias Arimateia
      case 'getMidiasArimateia':
        return createResponse(getMidiasArimateia(data));
      case 'getMidiasSubfolder':
        return createResponse(getMidiasSubfolder(data.folderId));
      case 'downloadMidia':
        return createResponse(downloadMidia(data));
      case 'getMidiaPreview':
        return createResponse(getMidiaPreview(data));
        
      // 🏛️ Igrejas e Regiões
      case 'getIgrejasRegioes':
        return createResponse(getIgrejasRegioes());
        
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
 * 📈 GERAR RELATÓRIO AVANÇADO COM ANÁLISE DE METAS
 */
function generateAdvancedReport(data) {
  try {
    const chamadosSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.CHAMADOS);
    const usuariosSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.USUARIOS);
    const igrejasSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.IGREJAS_REGIOES);
    const relatoriosSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.RELATORIOS_MENSAIS);
    
    const now = new Date();
    const tipoRelatorio = data.tipo || 'GERAL'; // GERAL, REGIAO, IGREJA
    const filtroNome = data.filtroNome || null; // Nome da região ou igreja específica
    
    // Obter dados das planilhas
    const chamadosData = chamadosSheet.getDataRange().getValues();
    const usuariosData = usuariosSheet.getDataRange().getValues();
    const igrejasData = igrejasSheet.getDataRange().getValues();
    
    // Estrutura para armazenar dados por região/igreja
    const dadosPorRegiao = {};
    const dadosPorIgreja = {};
    let dadosGerais = {
      totalMembros: 0,
      totalVoluntarios: 0,
      totalCoordenadores: 0,
      totalChamados: 0,
      chamadosResolvidos: 0,
      chamadosTituloEleitor: 0,
      igrejas: 0
    };
    
    // Processar dados das igrejas
    for (let i = 1; i < igrejasData.length; i++) {
      const row = igrejasData[i];
      const igreja = row[1]; // NOME_IGREJA
      const regiao = row[2]; // REGIAO
      const obreiros = row[3] || 0; // OBREIROS
      const voluntariosGrupos = row[4] || 0; // VOLUNTARIOS_DOS_GRUPOS
      const membrosDomingo = row[5] || 0; // MEMBROS_DOMINGO
      const totalMembros = Number(obreiros) + Number(voluntariosGrupos) + Number(membrosDomingo);
      const totalVoluntariosSistema = row[8] || 0; // TOTAL_VOLUNTARIOS
      const totalAtendimentos = row[9] || 0; // TOTAL_ATENDIMENTOS
      
      // Inicializar estrutura da região se não existir
      if (!dadosPorRegiao[regiao]) {
        dadosPorRegiao[regiao] = {
          nome: regiao,
          igrejas: [],
          totalMembros: 0,
          totalVoluntarios: 0,
          totalCoordenadores: 0,
          totalChamados: 0,
          chamadosResolvidos: 0,
          chamadosTituloEleitor: 0,
          metaVoluntarios: 0,
          metaCoordenadores: 0
        };
      }
      
      // Calcular metas
      const metaVoluntarios = Math.max(1, Math.ceil(totalMembros * 0.01)); // 1% dos membros
      const metaCoordenadores = 1; // 1 coordenador por igreja
      
      // Dados da igreja específica
      const dadosIgreja = {
        nome: igreja,
        regiao: regiao,
        totalMembros: totalMembros,
        totalVoluntarios: totalVoluntariosSistema,
        totalCoordenadores: 0, // Será calculado abaixo
        totalChamados: 0, // Será calculado abaixo
        chamadosResolvidos: 0, // Será calculado abaixo
        chamadosTituloEleitor: 0, // Será calculado abaixo
        metaVoluntarios: metaVoluntarios,
        metaCoordenadores: metaCoordenadores,
        statusMetaVoluntarios: totalVoluntariosSistema >= metaVoluntarios ? 'ATINGIDA' : 'ABAIXO',
        statusMetaCoordenadores: 'PENDENTE' // Será atualizado após contar coordenadores
      };
      
      // Adicionar à região
      dadosPorRegiao[regiao].igrejas.push(dadosIgreja);
      dadosPorRegiao[regiao].totalMembros += totalMembros;
      dadosPorRegiao[regiao].totalVoluntarios += Number(totalVoluntariosSistema);
      dadosPorRegiao[regiao].metaVoluntarios += metaVoluntarios;
      dadosPorRegiao[regiao].metaCoordenadores += metaCoordenadores;
      
      // Adicionar aos dados gerais
      dadosGerais.totalMembros += totalMembros;
      dadosGerais.totalVoluntarios += Number(totalVoluntariosSistema);
      dadosGerais.igrejas++;
      
      // Armazenar dados da igreja para acesso rápido
      dadosPorIgreja[igreja] = dadosIgreja;
    }
    
    // Contar coordenadores por igreja/região
    for (let i = 1; i < usuariosData.length; i++) {
      const row = usuariosData[i];
      const cargo = row[4]; // CARGO
      const igreja = row[6]; // IGREJA
      const regiao = row[7]; // REGIAO
      const status = row[5]; // STATUS
      
      if (cargo === 'COORDENADOR' && status === 'Ativo') {
        if (dadosPorIgreja[igreja]) {
          dadosPorIgreja[igreja].totalCoordenadores++;
        }
        if (dadosPorRegiao[regiao]) {
          dadosPorRegiao[regiao].totalCoordenadores++;
        }
        dadosGerais.totalCoordenadores++;
      }
    }
    
    // Processar chamados por igreja/região
    for (let i = 1; i < chamadosData.length; i++) {
      const row = chamadosData[i];
      const igreja = row[5]; // IGREJA
      const regiao = row[6]; // REGIAO
      const status = row[8]; // STATUS
      const demanda = row[11]; // DEMANDA_ESPECIFICA
      
      if (dadosPorIgreja[igreja]) {
        dadosPorIgreja[igreja].totalChamados++;
        if (status === 'Resolvido' || status === 'Fechado') {
          dadosPorIgreja[igreja].chamadosResolvidos++;
        }
        if (demanda === 'Título de Eleitor') {
          dadosPorIgreja[igreja].chamadosTituloEleitor++;
        }
      }
      
      if (dadosPorRegiao[regiao]) {
        dadosPorRegiao[regiao].totalChamados++;
        if (status === 'Resolvido' || status === 'Fechado') {
          dadosPorRegiao[regiao].chamadosResolvidos++;
        }
        if (demanda === 'Título de Eleitor') {
          dadosPorRegiao[regiao].chamadosTituloEleitor++;
        }
      }
      
      dadosGerais.totalChamados++;
      if (status === 'Resolvido' || status === 'Fechado') {
        dadosGerais.chamadosResolvidos++;
      }
      if (demanda === 'Título de Eleitor') {
        dadosGerais.chamadosTituloEleitor++;
      }
    }
    
    // Atualizar status das metas de coordenadores
    Object.values(dadosPorIgreja).forEach(igreja => {
      igreja.statusMetaCoordenadores = igreja.totalCoordenadores >= igreja.metaCoordenadores ? 'ATINGIDA' : 'ABAIXO';
    });
    
    Object.values(dadosPorRegiao).forEach(regiao => {
      regiao.statusMetaVoluntarios = regiao.totalVoluntarios >= regiao.metaVoluntarios ? 'ATINGIDA' : 'ABAIXO';
      regiao.statusMetaCoordenadores = regiao.totalCoordenadores >= regiao.metaCoordenadores ? 'ATINGIDA' : 'ABAIXO';
    });
    
    // Gerar relatórios baseado no tipo solicitado
    const relatorios = [];
    
    if (tipoRelatorio === 'GERAL' || !filtroNome) {
      // Relatório GERAL (BLOCO)
      const relatorioGeral = [
        now,                                                    // A - DATA_RELATORIO
        'GERAL',                                               // B - TIPO_RELATORIO
        'BLOCO GERAL',                                         // C - NOME_REGIAO_IGREJA
        dadosGerais.totalMembros,                              // D - TOTAL_MEMBROS
        dadosGerais.totalVoluntarios,                          // E - TOTAL_VOLUNTARIOS_SISTEMA
        Math.ceil(dadosGerais.totalMembros * 0.01),           // F - META_VOLUNTARIOS (1%)
        dadosGerais.totalVoluntarios >= Math.ceil(dadosGerais.totalMembros * 0.01) ? 'ATINGIDA' : 'ABAIXO', // G - STATUS_META_VOLUNTARIOS
        dadosGerais.totalCoordenadores,                        // H - TOTAL_COORDENADORES
        dadosGerais.igrejas,                                   // I - META_COORDENADORES (1 por igreja)
        dadosGerais.totalCoordenadores >= dadosGerais.igrejas ? 'ATINGIDA' : 'ABAIXO', // J - STATUS_META_COORDENADORES
        dadosGerais.totalChamados,                             // K - TOTAL_CHAMADOS
        dadosGerais.chamadosResolvidos,                        // L - CHAMADOS_RESOLVIDOS
        dadosGerais.chamadosTituloEleitor,                     // M - CHAMADOS_TITULO_ELEITOR
        dadosGerais.totalChamados > 0 ? Math.round((dadosGerais.chamadosTituloEleitor / dadosGerais.totalChamados) * 100) + '%' : '0%', // N - PORCENTAGEM_TITULO_ELEITOR
        dadosGerais.totalChamados > 0 ? Math.round((dadosGerais.chamadosResolvidos / dadosGerais.totalChamados) * 100) + '%' : '0%', // O - TAXA_RESOLUCAO
        0,                                                     // P - TEMPO_MEDIO_RESOLUCAO
        'Documentação',                                        // Q - CATEGORIA_MAIS_DEMANDADA
        0,                                                     // R - SATISFACAO_MEDIA
        `Total: ${dadosGerais.igrejas} igrejas, ${Object.keys(dadosPorRegiao).length} regiões` // S - OBSERVACOES
      ];
      relatorios.push(relatorioGeral);
      
      // Relatórios por REGIÃO
      Object.values(dadosPorRegiao).forEach(regiao => {
        const relatorioRegiao = [
          now,                                                  // A - DATA_RELATORIO
          'REGIAO',                                            // B - TIPO_RELATORIO
          regiao.nome,                                         // C - NOME_REGIAO_IGREJA
          regiao.totalMembros,                                 // D - TOTAL_MEMBROS
          regiao.totalVoluntarios,                             // E - TOTAL_VOLUNTARIOS_SISTEMA
          regiao.metaVoluntarios,                              // F - META_VOLUNTARIOS
          regiao.statusMetaVoluntarios,                        // G - STATUS_META_VOLUNTARIOS
          regiao.totalCoordenadores,                           // H - TOTAL_COORDENADORES
          regiao.metaCoordenadores,                            // I - META_COORDENADORES
          regiao.statusMetaCoordenadores,                      // J - STATUS_META_COORDENADORES
          regiao.totalChamados,                                // K - TOTAL_CHAMADOS
          regiao.chamadosResolvidos,                           // L - CHAMADOS_RESOLVIDOS
          regiao.chamadosTituloEleitor,                        // M - CHAMADOS_TITULO_ELEITOR
          regiao.totalChamados > 0 ? Math.round((regiao.chamadosTituloEleitor / regiao.totalChamados) * 100) + '%' : '0%', // N - PORCENTAGEM_TITULO_ELEITOR
          regiao.totalChamados > 0 ? Math.round((regiao.chamadosResolvidos / regiao.totalChamados) * 100) + '%' : '0%', // O - TAXA_RESOLUCAO
          0,                                                   // P - TEMPO_MEDIO_RESOLUCAO
          'Documentação',                                      // Q - CATEGORIA_MAIS_DEMANDADA
          0,                                                   // R - SATISFACAO_MEDIA
          `${regiao.igrejas.length} igrejas na região`        // S - OBSERVACOES
        ];
        relatorios.push(relatorioRegiao);
      });
    }
    
    if (tipoRelatorio === 'IGREJA' && filtroNome && dadosPorIgreja[filtroNome]) {
      // Relatório específico de IGREJA
      const igreja = dadosPorIgreja[filtroNome];
      const relatorioIgreja = [
        now,                                                  // A - DATA_RELATORIO
        'IGREJA',                                            // B - TIPO_RELATORIO
        igreja.nome,                                         // C - NOME_REGIAO_IGREJA
        igreja.totalMembros,                                 // D - TOTAL_MEMBROS
        igreja.totalVoluntarios,                             // E - TOTAL_VOLUNTARIOS_SISTEMA
        igreja.metaVoluntarios,                              // F - META_VOLUNTARIOS
        igreja.statusMetaVoluntarios,                        // G - STATUS_META_VOLUNTARIOS
        igreja.totalCoordenadores,                           // H - TOTAL_COORDENADORES
        igreja.metaCoordenadores,                            // I - META_COORDENADORES
        igreja.statusMetaCoordenadores,                      // J - STATUS_META_COORDENADORES
        igreja.totalChamados,                                // K - TOTAL_CHAMADOS
        igreja.chamadosResolvidos,                           // L - CHAMADOS_RESOLVIDOS
        igreja.chamadosTituloEleitor,                        // M - CHAMADOS_TITULO_ELEITOR
        igreja.totalChamados > 0 ? Math.round((igreja.chamadosTituloEleitor / igreja.totalChamados) * 100) + '%' : '0%', // N - PORCENTAGEM_TITULO_ELEITOR
        igreja.totalChamados > 0 ? Math.round((igreja.chamadosResolvidos / igreja.totalChamados) * 100) + '%' : '0%', // O - TAXA_RESOLUCAO
        0,                                                   // P - TEMPO_MEDIO_RESOLUCAO
        'Documentação',                                      // Q - CATEGORIA_MAIS_DEMANDADA
        0,                                                   // R - SATISFACAO_MEDIA
        `Igreja da região ${igreja.regiao}`                 // S - OBSERVACOES
      ];
      relatorios.push(relatorioIgreja);
    }
    
    // Salvar relatórios na planilha
    relatorios.forEach(relatorio => {
      relatoriosSheet.appendRow(relatorio);
    });
    
    return {
      success: true,
      message: `${relatorios.length} relatório(s) gerado(s) com sucesso!`,
      dados: {
        tipo: tipoRelatorio,
        filtro: filtroNome,
        relatoriosGerados: relatorios.length,
        dadosGerais: dadosGerais,
        regioes: Object.keys(dadosPorRegiao).length,
        igrejas: Object.keys(dadosPorIgreja).length
      }
    };
    
  } catch (error) {
    console.error('Erro ao gerar relatório avançado:', error);
    return {
      success: false,
      error: 'Erro ao gerar relatório: ' + error.toString()
    };
  }
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
 * �‍⚕️ ADICIONAR PROFISSIONAL LIBERAL
 */
function adicionarProfissional(data) {
  try {
    // Verificar permissões (apenas COORDENADOR e SECRETARIA)
    const userRole = data.userInfo?.role;
    if (!userRole || (userRole !== 'COORDENADOR' && userRole !== 'SECRETARIA')) {
      return {
        success: false,
        error: 'Acesso negado. Apenas coordenadores e secretários podem adicionar profissionais.'
      };
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.PROFISSIONAIS_LIBERAIS);
    
    // Verificar se profissional já existe (por nome + profissão + cidade)
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    for (let i = 1; i < values.length; i++) {
      const nome = values[i][1]; // NOME
      const profissao = values[i][3]; // PROFISSAO
      const cidade = values[i][4]; // CIDADE
      
      if (nome === data.dados.nome && 
          profissao === data.dados.profissao && 
          cidade === data.dados.cidade) {
        return {
          success: false,
          error: 'Profissional já cadastrado com esta profissão nesta cidade.'
        };
      }
    }
    
    const profId = generateId('PROF');
    const now = new Date();
    
    // Estrutura da linha conforme PROFISSIONAIS_LIBERAIS aba
    const rowData = [
      profId,                               // A - ID
      data.dados.nome,                      // B - NOME
      data.dados.telefone,                  // C - TELEFONE
      data.dados.profissao,                 // D - PROFISSAO
      data.dados.cidade,                    // E - CIDADE
      data.dados.email || '',               // F - EMAIL
      data.dados.registro || '',            // G - CRM_CRO_OAB
      data.dados.especialidade || '',       // H - ESPECIALIDADE
      data.dados.disponibilidade || '',     // I - DISPONIBILIDADE
      'Ativo',                              // J - STATUS
      now,                                  // K - DATA_CADASTRO
      data.userInfo.name,                   // L - CADASTRADO_POR
      data.dados.observacoes || '',         // M - OBSERVACOES
      0,                                    // N - TOTAL_ATENDIMENTOS
      now                                   // O - ULTIMA_ATUALIZACAO
    ];
    
    sheet.appendRow(rowData);
    
    return {
      success: true,
      message: 'Profissional cadastrado com sucesso!',
      data: {
        profId: profId,
        nome: data.dados.nome,
        profissao: data.dados.profissao
      }
    };
    
  } catch (error) {
    console.error('Erro ao adicionar profissional:', error);
    return {
      success: false,
      error: 'Erro interno: ' + error.toString()
    };
  }
}

/**
 * 🔍 BUSCAR PROFISSIONAIS LIBERAIS
 */
function buscarProfissionais(data = {}) {
  try {
    // Verificar permissões (apenas COORDENADOR e SECRETARIA)
    const userRole = data.userInfo?.role;
    if (!userRole || (userRole !== 'COORDENADOR' && userRole !== 'SECRETARIA')) {
      return {
        success: false,
        error: 'Acesso negado. Apenas coordenadores e secretários podem visualizar profissionais.'
      };
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.PROFISSIONAIS_LIBERAIS);
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    const profissionais = [];
    
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      
      // Aplicar filtros se fornecidos
      if (data.filtros) {
        if (data.filtros.profissao && row[3] !== data.filtros.profissao) continue;
        if (data.filtros.cidade && row[4] !== data.filtros.cidade) continue;
        if (data.filtros.status && row[9] !== data.filtros.status) continue;
      }
      
      profissionais.push({
        id: row[0],                    // ID
        nome: row[1],                  // NOME
        telefone: row[2],              // TELEFONE
        profissao: row[3],             // PROFISSAO
        cidade: row[4],                // CIDADE
        email: row[5],                 // EMAIL
        registro: row[6],              // CRM_CRO_OAB
        especialidade: row[7],         // ESPECIALIDADE
        disponibilidade: row[8],       // DISPONIBILIDADE
        status: row[9],                // STATUS
        dataCadastro: row[10],         // DATA_CADASTRO
        cadastradoPor: row[11],        // CADASTRADO_POR
        observacoes: row[12],          // OBSERVACOES
        totalAtendimentos: row[13],    // TOTAL_ATENDIMENTOS
        ultimaAtualizacao: row[14]     // ULTIMA_ATUALIZACAO
      });
    }
    
    // Ordenar por nome
    profissionais.sort((a, b) => a.nome.localeCompare(b.nome));
    
    return {
      success: true,
      profissionais: profissionais,
      total: profissionais.length
    };
    
  } catch (error) {
    console.error('Erro ao buscar profissionais:', error);
    return {
      success: false,
      error: 'Erro ao buscar profissionais: ' + error.toString()
    };
  }
}

/**
 * ✏️ ATUALIZAR PROFISSIONAL LIBERAL
 */
function atualizarProfissional(data) {
  try {
    // Verificar permissões (apenas COORDENADOR e SECRETARIA)
    const userRole = data.userInfo?.role;
    if (!userRole || (userRole !== 'COORDENADOR' && userRole !== 'SECRETARIA')) {
      return {
        success: false,
        error: 'Acesso negado. Apenas coordenadores e secretários podem atualizar profissionais.'
      };
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.PROFISSIONAIS_LIBERAIS);
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === data.profId) { // Coluna A - ID
        
        // Atualizar campos fornecidos
        if (data.dados.nome) sheet.getRange(i + 1, 2).setValue(data.dados.nome);
        if (data.dados.telefone) sheet.getRange(i + 1, 3).setValue(data.dados.telefone);
        if (data.dados.profissao) sheet.getRange(i + 1, 4).setValue(data.dados.profissao);
        if (data.dados.cidade) sheet.getRange(i + 1, 5).setValue(data.dados.cidade);
        if (data.dados.email !== undefined) sheet.getRange(i + 1, 6).setValue(data.dados.email);
        if (data.dados.registro !== undefined) sheet.getRange(i + 1, 7).setValue(data.dados.registro);
        if (data.dados.especialidade !== undefined) sheet.getRange(i + 1, 8).setValue(data.dados.especialidade);
        if (data.dados.disponibilidade !== undefined) sheet.getRange(i + 1, 9).setValue(data.dados.disponibilidade);
        if (data.dados.status) sheet.getRange(i + 1, 10).setValue(data.dados.status);
        if (data.dados.observacoes !== undefined) sheet.getRange(i + 1, 13).setValue(data.dados.observacoes);
        
        // Sempre atualizar data de última atualização
        sheet.getRange(i + 1, 15).setValue(new Date()); // ULTIMA_ATUALIZACAO
        
        return {
          success: true,
          message: 'Profissional atualizado com sucesso!'
        };
      }
    }
    
    return {
      success: false,
      error: 'Profissional não encontrado'
    };
    
  } catch (error) {
    console.error('Erro ao atualizar profissional:', error);
    return {
      success: false,
      error: 'Erro ao atualizar profissional: ' + error.toString()
    };
  }
}

/**
 * 🗑️ REMOVER PROFISSIONAL LIBERAL
 */
function removerProfissional(data) {
  try {
    // Verificar permissões (apenas COORDENADOR)
    const userRole = data.userInfo?.role;
    if (!userRole || userRole !== 'COORDENADOR') {
      return {
        success: false,
        error: 'Acesso negado. Apenas coordenadores podem remover profissionais.'
      };
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.PROFISSIONAIS_LIBERAIS);
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === data.profId) { // Coluna A - ID
        
        // Inativar ao invés de deletar (exclusão lógica)
        sheet.getRange(i + 1, 10).setValue('Inativo'); // STATUS
        sheet.getRange(i + 1, 13).setValue((values[i][12] || '') + `\n[${new Date().toLocaleDateString()}] Removido por ${data.userInfo.name}`); // OBSERVACOES
        sheet.getRange(i + 1, 15).setValue(new Date()); // ULTIMA_ATUALIZACAO
        
        return {
          success: true,
          message: 'Profissional removido com sucesso!'
        };
      }
    }
    
    return {
      success: false,
      error: 'Profissional não encontrado'
    };
    
  } catch (error) {
    console.error('Erro ao remover profissional:', error);
    return {
      success: false,
      error: 'Erro ao remover profissional: ' + error.toString()
    };
  }
}

/**
 * 📋 LISTAR PROFISSÕES DISPONÍVEIS
 */
function getProfissoes() {
  return {
    success: true,
    profissoes: [
      'Advogado(a)',
      'Dentista (Cirurgião-Dentista)',
      'Professor(a) de Português',
      'Professor(a) de Matemática',
      'Psicólogo(a)',
      'Assistente Social',
      'Médico(a) Clínico Geral',
      'Fisioterapeuta',
      'Nutricionista',
      'Fonoaudiólogo(a)',
      'Terapeuta Ocupacional',
      'Enfermeiro(a)',
      'Pedagogo(a)',
      'Orientador(a) Educacional',
      'Farmacêutico(a)',
      'Outros'
    ]
  };
}

/**
 * 🏛️ ADICIONAR ASSESSOR PARLAMENTAR
 */
function adicionarAssessor(data) {
  try {
    // Verificar permissões (apenas COORDENADOR e SECRETARIA)
    const userRole = data.userInfo?.role;
    if (!userRole || (userRole !== 'COORDENADOR' && userRole !== 'SECRETARIA')) {
      return {
        success: false,
        error: 'Acesso negado. Apenas coordenadores e secretários podem adicionar assessores.'
      };
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.ASSESSORES);
    
    // Verificar se assessor já existe (por nome + parlamentar)
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    for (let i = 1; i < values.length; i++) {
      const nome = values[i][1]; // ACESSOR
      const parlamentar = values[i][3]; // PARLAMENTAR
      
      if (nome === data.dados.acessor && parlamentar === data.dados.parlamentar) {
        return {
          success: false,
          error: 'Assessor já cadastrado para este parlamentar.'
        };
      }
    }
    
    const assessorId = generateId('ASSES');
    const now = new Date();
    
    // Estrutura da linha conforme ASSESSORES aba
    const rowData = [
      assessorId,                      // A - ID
      data.dados.acessor,              // B - ACESSOR
      data.dados.telefone,             // C - TELEFONE
      data.dados.parlamentar,          // D - PARLAMENTAR
      data.dados.gabinete,             // E - GABINETE - FICA EM QUAL CIDADE
      now,                             // F - DATA_CADASTRO
      data.userInfo.name,              // G - CADASTRADO_POR
      '',                              // H - OBSERVACOES
      now                              // I - ULTIMA_ATUALIZACAO
    ];
    
    sheet.appendRow(rowData);
    
    return {
      success: true,
      message: 'Assessor cadastrado com sucesso!',
      data: {
        assessorId: assessorId,
        nome: data.dados.acessor,
        parlamentar: data.dados.parlamentar
      }
    };
    
  } catch (error) {
    console.error('Erro ao adicionar assessor:', error);
    return {
      success: false,
      error: 'Erro interno: ' + error.toString()
    };
  }
}

/**
 * 🔍 BUSCAR ASSESSORES PARLAMENTARES
 */
function buscarAssessores(data = {}) {
  try {
    // Verificar permissões (apenas COORDENADOR e SECRETARIA)
    const userRole = data.userInfo?.role;
    if (!userRole || (userRole !== 'COORDENADOR' && userRole !== 'SECRETARIA')) {
      return {
        success: false,
        error: 'Acesso negado. Apenas coordenadores e secretários podem visualizar assessores.'
      };
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.ASSESSORES);
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    const assessores = [];
    
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      
      // Aplicar filtros se fornecidos
      if (data.filtros) {
        if (data.filtros.parlamentar && row[3] !== data.filtros.parlamentar) continue;
        if (data.filtros.cidade && row[4] && !row[4].toLowerCase().includes(data.filtros.cidade.toLowerCase())) continue;
        if (data.filtros.acessor && !row[1].toLowerCase().includes(data.filtros.acessor.toLowerCase())) continue;
      }
      
      assessores.push({
        id: row[0],                    // ID
        acessor: row[1],               // ACESSOR
        telefone: row[2],              // TELEFONE
        parlamentar: row[3],           // PARLAMENTAR
        gabinete: row[4],              // GABINETE - FICA EM QUAL CIDADE
        dataCadastro: row[5],          // DATA_CADASTRO
        cadastradoPor: row[6],         // CADASTRADO_POR
        observacoes: row[7],           // OBSERVACOES
        ultimaAtualizacao: row[8]      // ULTIMA_ATUALIZACAO
      });
    }
    
    // Ordenar por parlamentar e depois por nome do assessor
    assessores.sort((a, b) => {
      if (a.parlamentar !== b.parlamentar) {
        return a.parlamentar.localeCompare(b.parlamentar);
      }
      return a.acessor.localeCompare(b.acessor);
    });
    
    return {
      success: true,
      assessores: assessores,
      total: assessores.length
    };
    
  } catch (error) {
    console.error('Erro ao buscar assessores:', error);
    return {
      success: false,
      error: 'Erro ao buscar assessores: ' + error.toString()
    };
  }
}

/**
 * ✏️ ATUALIZAR ASSESSOR PARLAMENTAR
 */
function atualizarAssessor(data) {
  try {
    // Verificar permissões (apenas COORDENADOR e SECRETARIA)
    const userRole = data.userInfo?.role;
    if (!userRole || (userRole !== 'COORDENADOR' && userRole !== 'SECRETARIA')) {
      return {
        success: false,
        error: 'Acesso negado. Apenas coordenadores e secretários podem atualizar assessores.'
      };
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.ASSESSORES);
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === data.assessorId) { // Coluna A - ID
        
        // Atualizar campos fornecidos
        if (data.dados.acessor) sheet.getRange(i + 1, 2).setValue(data.dados.acessor);
        if (data.dados.telefone) sheet.getRange(i + 1, 3).setValue(data.dados.telefone);
        if (data.dados.parlamentar) sheet.getRange(i + 1, 4).setValue(data.dados.parlamentar);
        if (data.dados.gabinete) sheet.getRange(i + 1, 5).setValue(data.dados.gabinete);
        if (data.dados.observacoes !== undefined) sheet.getRange(i + 1, 8).setValue(data.dados.observacoes);
        
        // Sempre atualizar data de última atualização
        sheet.getRange(i + 1, 9).setValue(new Date()); // ULTIMA_ATUALIZACAO
        
        return {
          success: true,
          message: 'Assessor atualizado com sucesso!'
        };
      }
    }
    
    return {
      success: false,
      error: 'Assessor não encontrado'
    };
    
  } catch (error) {
    console.error('Erro ao atualizar assessor:', error);
    return {
      success: false,
      error: 'Erro ao atualizar assessor: ' + error.toString()
    };
  }
}

/**
 * 🗑️ REMOVER ASSESSOR PARLAMENTAR
 */
function removerAssessor(data) {
  try {
    // Verificar permissões (apenas COORDENADOR)
    const userRole = data.userInfo?.role;
    if (!userRole || userRole !== 'COORDENADOR') {
      return {
        success: false,
        error: 'Acesso negado. Apenas coordenadores podem remover assessores.'
      };
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.ASSESSORES);
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === data.assessorId) { // Coluna A - ID
        
        // Remover linha (exclusão física para assessores)
        sheet.deleteRow(i + 1);
        
        return {
          success: true,
          message: 'Assessor removido com sucesso!'
        };
      }
    }
    
    return {
      success: false,
      error: 'Assessor não encontrado'
    };
    
  } catch (error) {
    console.error('Erro ao remover assessor:', error);
    return {
      success: false,
      error: 'Erro ao remover assessor: ' + error.toString()
    };
  }
}

/**
 * 🗳️ ADICIONAR MUNICÍPIO ELEITORAL
 */
function adicionarMunicipio(data) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.ELEICOES_DEPUTADOS);
    
    // Verificar permissões (apenas coordenadores)
    if (data.userInfo.role !== 'COORDENADOR') {
      return { 
        success: false, 
        error: 'Acesso negado. Apenas coordenadores podem gerenciar dados eleitorais.' 
      };
    }
    
    // Verificar se município já existe na região/igreja
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === data.regiao && 
          values[i][1] === data.igreja && 
          values[i][2] === data.municipio) {
        return { 
          success: false, 
          error: 'Este município já está cadastrado para esta região/igreja' 
        };
      }
    }
    
    const municipioId = generateId('MUN');
    const now = new Date();
    
    const rowData = [
      data.regiao,                          // A - REGIAO
      data.igreja,                          // B - IGREJA
      data.municipio,                       // C - MUNICIPIO
      data.endereco || '',                  // D - ENDERECO
      data.habitantes || 0,                 // E - HABITANTES
      data.obreiros || 0,                   // F - OBREIROS
      data.grupos || 0,                     // G - GRUPOS_SEM_OBREIROS
      data.povoGeral || 0,                  // H - POVO_GERAL
      data.arimateiasObreiros || 0,         // I - QTD_ARIMATÉIAS_OBREIROS
      data.totalArimateias || 0,            // J - TOTAL_ARIMATÉIAS
      data.votosDF2018 || 0,                // K - VOTOS_DF_2018
      data.votosDF2022 || 0,                // L - VOTOS_DF_2022
      data.votosDE2018 || 0,                // M - VOTOS_DE_2018
      data.votosDE2022 || 0,                // N - VOTOS_DE_2022
      municipioId,                          // O - ID_CONTROLE
      now,                                  // P - DATA_CADASTRO
      data.userInfo.name,                   // Q - CADASTRADO_POR
      data.observacoes || ''                // R - OBSERVACOES
    ];
    
    sheet.appendRow(rowData);
    
    return { 
      success: true, 
      message: 'Município eleitoral adicionado com sucesso!',
      data: {
        municipioId: municipioId
      }
    };
    
  } catch (error) {
    console.error('Erro ao adicionar município eleitoral:', error);
    return { 
      success: false, 
      error: 'Erro interno: ' + error.toString() 
    };
  }
}

/**
 * 🔍 BUSCAR MUNICÍPIOS ELEITORAIS
 */
function buscarMunicipios(filtros = {}) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.ELEICOES_DEPUTADOS);
    
    // Verificar permissões (apenas coordenadores)
    if (filtros.userInfo && filtros.userInfo.role !== 'COORDENADOR') {
      return { 
        success: false, 
        error: 'Acesso negado. Apenas coordenadores podem acessar dados eleitorais.' 
      };
    }
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    let municipios = [];
    
    for (let i = 1; i < values.length; i++) {
      const municipio = {
        regiao: values[i][0],
        igreja: values[i][1],
        municipio: values[i][2],
        endereco: values[i][3],
        habitantes: values[i][4],
        obreiros: values[i][5],
        gruposSemObreiros: values[i][6],
        povoGeral: values[i][7],
        arimateiasObreiros: values[i][8],
        totalArimateias: values[i][9],
        votosDF2018: values[i][10],
        votosDF2022: values[i][11],
        votosDE2018: values[i][12],
        votosDE2022: values[i][13],
        id: values[i][14],
        dataCadastro: values[i][15],
        cadastradoPor: values[i][16],
        observacoes: values[i][17]
      };
      
      // Aplicar filtros
      let incluir = true;
      
      if (filtros.regiao && municipio.regiao !== filtros.regiao) {
        incluir = false;
      }
      
      if (filtros.igreja && municipio.igreja !== filtros.igreja) {
        incluir = false;
      }
      
      if (filtros.municipio && municipio.municipio !== filtros.municipio) {
        incluir = false;
      }
      
      if (incluir) {
        municipios.push(municipio);
      }
    }
    
    return { 
      success: true, 
      municipios: municipios 
    };
    
  } catch (error) {
    console.error('Erro ao buscar municípios eleitorais:', error);
    return { 
      success: false, 
      error: 'Erro ao buscar municípios: ' + error.toString() 
    };
  }
}

/**
 * ✏️ ATUALIZAR MUNICÍPIO ELEITORAL
 */
function atualizarMunicipio(data) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.ELEICOES_DEPUTADOS);
    
    // Verificar permissões
    if (data.userInfo.role !== 'COORDENADOR') {
      return { 
        success: false, 
        error: 'Acesso negado. Apenas coordenadores podem atualizar dados eleitorais.' 
      };
    }
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    // Encontrar município pelo ID
    for (let i = 1; i < values.length; i++) {
      if (values[i][14] === data.municipioId) { // ID na coluna O
        // Atualizar campos numéricos
        if (data.habitantes !== undefined) sheet.getRange(i + 1, 5).setValue(data.habitantes);
        if (data.obreiros !== undefined) sheet.getRange(i + 1, 6).setValue(data.obreiros);
        if (data.gruposSemObreiros !== undefined) sheet.getRange(i + 1, 7).setValue(data.gruposSemObreiros);
        if (data.povoGeral !== undefined) sheet.getRange(i + 1, 8).setValue(data.povoGeral);
        if (data.arimateiasObreiros !== undefined) sheet.getRange(i + 1, 9).setValue(data.arimateiasObreiros);
        if (data.totalArimateias !== undefined) sheet.getRange(i + 1, 10).setValue(data.totalArimateias);
        if (data.votosDF2018 !== undefined) sheet.getRange(i + 1, 11).setValue(data.votosDF2018);
        if (data.votosDF2022 !== undefined) sheet.getRange(i + 1, 12).setValue(data.votosDF2022);
        if (data.votosDE2018 !== undefined) sheet.getRange(i + 1, 13).setValue(data.votosDE2018);
        if (data.votosDE2022 !== undefined) sheet.getRange(i + 1, 14).setValue(data.votosDE2022);
        if (data.endereco) sheet.getRange(i + 1, 4).setValue(data.endereco);
        if (data.observacoes) sheet.getRange(i + 1, 18).setValue(data.observacoes);
        
        return { 
          success: true, 
          message: 'Dados eleitorais atualizados com sucesso!' 
        };
      }
    }
    
    return { 
      success: false, 
      error: 'Município não encontrado' 
    };
    
  } catch (error) {
    console.error('Erro ao atualizar município eleitoral:', error);
    return { 
      success: false, 
      error: 'Erro ao atualizar município: ' + error.toString() 
    };
  }
}

/**
 * 🗑️ REMOVER MUNICÍPIO ELEITORAL
 */
function removerMunicipio(data) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.ELEICOES_DEPUTADOS);
    
    // Verificar permissões
    if (data.userInfo.role !== 'COORDENADOR') {
      return { 
        success: false, 
        error: 'Acesso negado. Apenas coordenadores podem remover dados eleitorais.' 
      };
    }
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    // Encontrar município pelo ID e remover linha
    for (let i = 1; i < values.length; i++) {
      if (values[i][14] === data.municipioId) { // ID na coluna O
        sheet.deleteRow(i + 1);
        
        return { 
          success: true, 
          message: 'Município removido com sucesso!' 
        };
      }
    }
    
    return { 
      success: false, 
      error: 'Município não encontrado' 
    };
    
  } catch (error) {
    console.error('Erro ao remover município eleitoral:', error);
    return { 
      success: false, 
      error: 'Erro ao remover município: ' + error.toString() 
    };
  }
}

/**
 * 📊 GERAR RELATÓRIO ELEITORAL AVANÇADO
 */
function generateElectoralReport(data) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.ELEICOES_DEPUTADOS);
    
    // Verificar permissões
    if (data.userInfo.role !== 'COORDENADOR') {
      return { 
        success: false, 
        error: 'Acesso negado. Apenas coordenadores podem gerar relatórios eleitorais.' 
      };
    }
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    // Análise geral
    let totalHabitantes = 0;
    let totalObreiros = 0;
    let totalGrupos = 0;
    let totalPovoGeral = 0;
    let totalArimateiasObreiros = 0;
    let totalArimateias = 0;
    let totalVotosDF2018 = 0;
    let totalVotosDF2022 = 0;
    let totalVotosDE2018 = 0;
    let totalVotosDE2022 = 0;
    
    // Análise por região
    const analisePorRegiao = {};
    const analisePorIgreja = {};
    const crescimentoEleitoral = {};
    
    for (let i = 1; i < values.length; i++) {
      const regiao = values[i][0];
      const igreja = values[i][1];
      const municipio = values[i][2];
      const habitantes = parseInt(values[i][4]) || 0;
      const obreiros = parseInt(values[i][5]) || 0;
      const grupos = parseInt(values[i][6]) || 0;
      const povoGeral = parseInt(values[i][7]) || 0;
      const arimateiasObreiros = parseInt(values[i][8]) || 0;
      const totalArimateiasLocal = parseInt(values[i][9]) || 0;
      const votosDF2018 = parseInt(values[i][10]) || 0;
      const votosDF2022 = parseInt(values[i][11]) || 0;
      const votosDE2018 = parseInt(values[i][12]) || 0;
      const votosDE2022 = parseInt(values[i][13]) || 0;
      
      // Totais gerais
      totalHabitantes += habitantes;
      totalObreiros += obreiros;
      totalGrupos += grupos;
      totalPovoGeral += povoGeral;
      totalArimateiasObreiros += arimateiasObreiros;
      totalArimateias += totalArimateiasLocal;
      totalVotosDF2018 += votosDF2018;
      totalVotosDF2022 += votosDF2022;
      totalVotosDE2018 += votosDE2018;
      totalVotosDE2022 += votosDE2022;
      
      // Análise por região
      if (!analisePorRegiao[regiao]) {
        analisePorRegiao[regiao] = {
          municipios: 0,
          igrejas: new Set(),
          habitantes: 0,
          obreiros: 0,
          grupos: 0,
          povoGeral: 0,
          arimateiasObreiros: 0,
          totalArimateias: 0,
          votosDF2018: 0,
          votosDF2022: 0,
          votosDE2018: 0,
          votosDE2022: 0
        };
      }
      
      analisePorRegiao[regiao].municipios++;
      analisePorRegiao[regiao].igrejas.add(igreja);
      analisePorRegiao[regiao].habitantes += habitantes;
      analisePorRegiao[regiao].obreiros += obreiros;
      analisePorRegiao[regiao].grupos += grupos;
      analisePorRegiao[regiao].povoGeral += povoGeral;
      analisePorRegiao[regiao].arimateiasObreiros += arimateiasObreiros;
      analisePorRegiao[regiao].totalArimateias += totalArimateiasLocal;
      analisePorRegiao[regiao].votosDF2018 += votosDF2018;
      analisePorRegiao[regiao].votosDF2022 += votosDF2022;
      analisePorRegiao[regiao].votosDE2018 += votosDE2018;
      analisePorRegiao[regiao].votosDE2022 += votosDE2022;
      
      // Análise por igreja
      const chaveIgreja = `${regiao} - ${igreja}`;
      if (!analisePorIgreja[chaveIgreja]) {
        analisePorIgreja[chaveIgreja] = {
          regiao: regiao,
          igreja: igreja,
          municipios: 0,
          habitantes: 0,
          arimateiasTotal: 0,
          votosTotal2022: 0,
          eficienciaEleitoral: 0
        };
      }
      
      analisePorIgreja[chaveIgreja].municipios++;
      analisePorIgreja[chaveIgreja].habitantes += habitantes;
      analisePorIgreja[chaveIgreja].arimateiasTotal += totalArimateiasLocal;
      analisePorIgreja[chaveIgreja].votosTotal2022 += votosDF2022 + votosDE2022;
      
      // Calcular crescimento eleitoral
      const crescimentoDF = votosDF2018 > 0 ? ((votosDF2022 - votosDF2018) / votosDF2018 * 100) : 0;
      const crescimentoDE = votosDE2018 > 0 ? ((votosDE2022 - votosDE2018) / votosDE2018 * 100) : 0;
      
      crescimentoEleitoral[municipio] = {
        regiao: regiao,
        igreja: igreja,
        municipio: municipio,
        crescimentoDF: crescimentoDF.toFixed(1),
        crescimentoDE: crescimentoDE.toFixed(1),
        votosTotal2022: votosDF2022 + votosDE2022
      };
    }
    
    // Calcular eficiência eleitoral por igreja
    Object.keys(analisePorIgreja).forEach(chave => {
      const igreja = analisePorIgreja[chave];
      igreja.eficienciaEleitoral = igreja.arimateiasTotal > 0 ? 
        (igreja.votosTotal2022 / igreja.arimateiasTotal).toFixed(2) : 0;
    });
    
    // Converter Set para array nas regiões
    Object.keys(analisePorRegiao).forEach(regiao => {
      analisePorRegiao[regiao].totalIgrejas = analisePorRegiao[regiao].igrejas.size;
      delete analisePorRegiao[regiao].igrejas;
    });
    
    // Calcular crescimento geral
    const crescimentoGeralDF = totalVotosDF2018 > 0 ? 
      ((totalVotosDF2022 - totalVotosDF2018) / totalVotosDF2018 * 100).toFixed(1) : 0;
    const crescimentoGeralDE = totalVotosDE2018 > 0 ? 
      ((totalVotosDE2022 - totalVotosDE2018) / totalVotosDE2018 * 100).toFixed(1) : 0;
    
    return {
      success: true,
      relatorioEleitoral: {
        resumoGeral: {
          totalMunicipios: values.length - 1,
          totalHabitantes,
          totalObreiros,
          totalGrupos,
          totalPovoGeral,
          totalArimateiasObreiros,
          totalArimateias,
          percentualArimateiasObreiros: totalArimateias > 0 ? 
            (totalArimateiasObreiros / totalArimateias * 100).toFixed(1) + '%' : '0%'
        },
        votacao: {
          deputadoFederal: {
            votos2018: totalVotosDF2018,
            votos2022: totalVotosDF2022,
            crescimento: crescimentoGeralDF + '%'
          },
          deputadoEstadual: {
            votos2018: totalVotosDE2018,
            votos2022: totalVotosDE2022,
            crescimento: crescimentoGeralDE + '%'
          },
          totalVotos2022: totalVotosDF2022 + totalVotosDE2022,
          eficienciaGeral: totalArimateias > 0 ? 
            ((totalVotosDF2022 + totalVotosDE2022) / totalArimateias).toFixed(2) : 0
        },
        analisePorRegiao,
        analisePorIgreja,
        crescimentoPorMunicipio: Object.values(crescimentoEleitoral),
        rankingIgrejas: Object.values(analisePorIgreja)
          .sort((a, b) => b.eficienciaEleitoral - a.eficienciaEleitoral)
          .slice(0, 10),
        metadados: {
          dataGeracao: new Date().toISOString(),
          tipoRelatorio: 'Eleitoral Avançado',
          geradoPor: data.userInfo.name,
          versao: '1.0'
        }
      }
    };
    
  } catch (error) {
    console.error('Erro ao gerar relatório eleitoral:', error);
    return { 
      success: false, 
      error: 'Erro ao gerar relatório: ' + error.toString() 
    };
  }
}

/**
 * 📈 OBTER DADOS ELEITORAIS PARA DASHBOARDS
 */
function getElectoralData(filtros = {}) {
  try {
    // Verificar permissões
    if (filtros.userInfo && filtros.userInfo.role !== 'COORDENADOR') {
      return { 
        success: false, 
        error: 'Acesso negado. Apenas coordenadores podem acessar dados eleitorais.' 
      };
    }
    
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.ELEICOES_DEPUTADOS);
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    const dadosEleitorais = [];
    
    for (let i = 1; i < values.length; i++) {
      dadosEleitorais.push({
        regiao: values[i][0],
        igreja: values[i][1],
        municipio: values[i][2],
        habitantes: values[i][4],
        totalArimateias: values[i][9],
        votosDF2022: values[i][11],
        votosDE2022: values[i][13],
        eficiencia: values[i][9] > 0 ? 
          ((values[i][11] + values[i][13]) / values[i][9]).toFixed(2) : 0
      });
    }
    
    return {
      success: true,
      dados: dadosEleitorais
    };
    
  } catch (error) {
    console.error('Erro ao obter dados eleitorais:', error);
    return { 
      success: false, 
      error: 'Erro ao obter dados: ' + error.toString() 
    };
  }
}

// 🗳️ ================== FUNÇÕES ELEITORAIS - VEREADORES ==================

/**
 * 📋 ADICIONAR VEREADOR
 */
function adicionarVereador(data) {
  try {
    // Verificar permissões
    if (!data.userInfo || data.userInfo.role !== 'COORDENADOR') {
      return { 
        success: false, 
        error: 'Acesso negado. Apenas coordenadores podem gerenciar dados de vereadores.' 
      };
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.ELEICOES_VEREADORES);
    
    // Se a aba não existir, criar com cabeçalhos
    if (!sheet) {
      const newSheet = SpreadsheetApp.openById(SPREADSHEET_ID).insertSheet(SHEETS.ELEICOES_VEREADORES);
      newSheet.getRange(1, 1, 1, 19).setValues([[
        'ID', 'REGIAO', 'IGREJA', 'MUNICIPIO', 'NOME_2024', 'CONTATO', 'FUNCAO', 
        'PARTIDO', 'ELEITO_NAO_ELEITO_2024', 'QUAL_MANDATO_ESTA', 'SUPLENTE_2024',
        'VOTOS_2016', 'VOTOS_2020', 'VOTOS_2024', 'TOTAL_CADEIRAS',
        'MAIOR_VOTACAO_ELEITO_2016', 'MENOR_VOTACAO_ELEITO_2016',
        'MAIOR_VOTACAO_ELEITO_2020', 'MENOR_VOTACAO_ELEITO_2020',
        'MAIOR_VOTACAO_ELEITO_2024', 'MENOR_VOTACAO_ELEITO_2024',
        'DATA_CADASTRO', 'ULTIMA_ATUALIZACAO'
      ]]);
      return adicionarVereador(data); // Tentar novamente
    }

    // Gerar ID único
    const lastRow = sheet.getLastRow();
    const newId = 'VER' + String(lastRow).padStart(3, '0');
    
    const agora = new Date();
    
    // Dados do vereador
    const vereadorData = [
      newId,
      data.regiao || '',
      data.igreja || '',
      data.municipio || '',
      data.nome2024 || '',
      data.contato || '',
      data.funcao || '',
      data.partido || '',
      data.eleitoNaoEleito2024 || '',
      data.qualMandatoEsta || '',
      data.suplente2024 || '',
      parseInt(data.votos2016) || 0,
      parseInt(data.votos2020) || 0,
      parseInt(data.votos2024) || 0,
      parseInt(data.totalCadeiras) || 0,
      parseInt(data.maiorVotacaoEleito2016) || 0,
      parseInt(data.menorVotacaoEleito2016) || 0,
      parseInt(data.maiorVotacaoEleito2020) || 0,
      parseInt(data.menorVotacaoEleito2020) || 0,
      parseInt(data.maiorVotacaoEleito2024) || 0,
      parseInt(data.menorVotacaoEleito2024) || 0,
      agora,
      agora
    ];

    // Adicionar à planilha
    sheet.appendRow(vereadorData);
    
    return { 
      success: true, 
      message: 'Vereador adicionado com sucesso!',
      vereadorId: newId
    };
    
  } catch (error) {
    console.error('Erro ao adicionar vereador:', error);
    return { 
      success: false, 
      error: 'Erro ao adicionar vereador: ' + error.toString() 
    };
  }
}

/**
 * 🔍 BUSCAR VEREADORES
 */
function buscarVereadores(data) {
  try {
    // Verificar permissões
    if (!data.userInfo || data.userInfo.role !== 'COORDENADOR') {
      return { 
        success: false, 
        error: 'Acesso negado. Apenas coordenadores podem acessar dados de vereadores.' 
      };
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.ELEICOES_VEREADORES);
    if (!sheet) {
      return { success: true, vereadores: [] };
    }

    const values = sheet.getDataRange().getValues();
    if (values.length <= 1) {
      return { success: true, vereadores: [] };
    }

    const headers = values[0];
    const vereadores = [];

    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const vereador = {};
      
      headers.forEach((header, index) => {
        vereador[header.toLowerCase().replace(/[^a-z0-9]/g, '_')] = row[index];
      });
      
      vereadores.push(vereador);
    }

    // Aplicar filtros se fornecidos
    let vereadoriesFiltrados = vereadores;
    
    if (data.regiao) {
      vereadoriesFiltrados = vereadoriesFiltrados.filter(v => 
        v.regiao && v.regiao.toLowerCase().includes(data.regiao.toLowerCase())
      );
    }
    
    if (data.municipio) {
      vereadoriesFiltrados = vereadoriesFiltrados.filter(v => 
        v.municipio && v.municipio.toLowerCase().includes(data.municipio.toLowerCase())
      );
    }
    
    if (data.eleito) {
      vereadoriesFiltrados = vereadoriesFiltrados.filter(v => 
        v.eleito_nao_eleito_2024 && v.eleito_nao_eleito_2024.toLowerCase().includes('eleito')
      );
    }

    return { 
      success: true, 
      vereadores: vereadoriesFiltrados 
    };
    
  } catch (error) {
    console.error('Erro ao buscar vereadores:', error);
    return { 
      success: false, 
      error: 'Erro ao buscar vereadores: ' + error.toString() 
    };
  }
}

/**
 * ✏️ ATUALIZAR VEREADOR
 */
function atualizarVereador(data) {
  try {
    // Verificar permissões
    if (!data.userInfo || data.userInfo.role !== 'COORDENADOR') {
      return { 
        success: false, 
        error: 'Acesso negado. Apenas coordenadores podem editar dados de vereadores.' 
      };
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.ELEICOES_VEREADORES);
    if (!sheet) {
      return { success: false, error: 'Planilha de vereadores não encontrada' };
    }

    const values = sheet.getDataRange().getValues();
    const headers = values[0];
    
    // Encontrar a linha do vereador
    let rowIndex = -1;
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === data.vereadorId) {
        rowIndex = i + 1; // +1 porque as linhas do Google Sheets começam em 1
        break;
      }
    }
    
    if (rowIndex === -1) {
      return { success: false, error: 'Vereador não encontrado' };
    }

    // Atualizar dados
    const agora = new Date();
    const updatedData = [
      data.vereadorId,
      data.regiao || values[rowIndex-1][1],
      data.igreja || values[rowIndex-1][2],
      data.municipio || values[rowIndex-1][3],
      data.nome2024 || values[rowIndex-1][4],
      data.contato || values[rowIndex-1][5],
      data.funcao || values[rowIndex-1][6],
      data.partido || values[rowIndex-1][7],
      data.eleitoNaoEleito2024 || values[rowIndex-1][8],
      data.qualMandatoEsta || values[rowIndex-1][9],
      data.suplente2024 || values[rowIndex-1][10],
      data.votos2016 !== undefined ? parseInt(data.votos2016) || 0 : values[rowIndex-1][11],
      data.votos2020 !== undefined ? parseInt(data.votos2020) || 0 : values[rowIndex-1][12],
      data.votos2024 !== undefined ? parseInt(data.votos2024) || 0 : values[rowIndex-1][13],
      data.totalCadeiras !== undefined ? parseInt(data.totalCadeiras) || 0 : values[rowIndex-1][14],
      data.maiorVotacaoEleito2016 !== undefined ? parseInt(data.maiorVotacaoEleito2016) || 0 : values[rowIndex-1][15],
      data.menorVotacaoEleito2016 !== undefined ? parseInt(data.menorVotacaoEleito2016) || 0 : values[rowIndex-1][16],
      data.maiorVotacaoEleito2020 !== undefined ? parseInt(data.maiorVotacaoEleito2020) || 0 : values[rowIndex-1][17],
      data.menorVotacaoEleito2020 !== undefined ? parseInt(data.menorVotacaoEleito2020) || 0 : values[rowIndex-1][18],
      data.maiorVotacaoEleito2024 !== undefined ? parseInt(data.maiorVotacaoEleito2024) || 0 : values[rowIndex-1][19],
      data.menorVotacaoEleito2024 !== undefined ? parseInt(data.menorVotacaoEleito2024) || 0 : values[rowIndex-1][20],
      values[rowIndex-1][21], // DATA_CADASTRO (manter original)
      agora // ULTIMA_ATUALIZACAO
    ];

    sheet.getRange(rowIndex, 1, 1, updatedData.length).setValues([updatedData]);
    
    return { 
      success: true, 
      message: 'Vereador atualizado com sucesso!' 
    };
    
  } catch (error) {
    console.error('Erro ao atualizar vereador:', error);
    return { 
      success: false, 
      error: 'Erro ao atualizar vereador: ' + error.toString() 
    };
  }
}

/**
 * 🗑️ REMOVER VEREADOR
 */
function removerVereador(data) {
  try {
    // Verificar permissões
    if (!data.userInfo || data.userInfo.role !== 'COORDENADOR') {
      return { 
        success: false, 
        error: 'Acesso negado. Apenas coordenadores podem remover dados de vereadores.' 
      };
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.ELEICOES_VEREADORES);
    if (!sheet) {
      return { success: false, error: 'Planilha de vereadores não encontrada' };
    }

    const values = sheet.getDataRange().getValues();
    
    // Encontrar a linha do vereador
    let rowIndex = -1;
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === data.vereadorId) {
        rowIndex = i + 1;
        break;
      }
    }
    
    if (rowIndex === -1) {
      return { success: false, error: 'Vereador não encontrado' };
    }

    sheet.deleteRow(rowIndex);
    
    return { 
      success: true, 
      message: 'Vereador removido com sucesso!' 
    };
    
  } catch (error) {
    console.error('Erro ao remover vereador:', error);
    return { 
      success: false, 
      error: 'Erro ao remover vereador: ' + error.toString() 
    };
  }
}

/**
 * 📊 GERAR RELATÓRIO DE VEREADORES
 */
function generateVereadorReport(data) {
  try {
    // Verificar permissões
    if (!data.userInfo || data.userInfo.role !== 'COORDENADOR') {
      return { 
        success: false, 
        error: 'Acesso negado. Apenas coordenadores podem gerar relatórios de vereadores.' 
      };
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.ELEICOES_VEREADORES);
    if (!sheet) {
      return { 
        success: true, 
        relatorioVereadores: {
          resumoGeral: { totalVereadores: 0, totalEleitos: 0, totalNaoEleitos: 0 },
          analisePorMunicipio: {},
          evolucaoEleitoral: [],
          rankingVereadores: []
        }
      };
    }

    const values = sheet.getDataRange().getValues();
    if (values.length <= 1) {
      return { 
        success: true, 
        relatorioVereadores: {
          resumoGeral: { totalVereadores: 0, totalEleitos: 0, totalNaoEleitos: 0 },
          analisePorMunicipio: {},
          evolucaoEleitoral: [],
          rankingVereadores: []
        }
      };
    }

    const headers = values[0];
    const vereadores = [];

    // Processar dados
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const vereador = {};
      
      headers.forEach((header, index) => {
        vereador[header.toLowerCase().replace(/[^a-z0-9]/g, '_')] = row[index];
      });
      
      vereadores.push(vereador);
    }

    // Resumo Geral
    const totalVereadores = vereadores.length;
    const totalEleitos = vereadores.filter(v => 
      v.eleito_nao_eleito_2024 && v.eleito_nao_eleito_2024.toLowerCase().includes('eleito')
    ).length;
    const totalNaoEleitos = totalVereadores - totalEleitos;
    const totalVotos2024 = vereadores.reduce((sum, v) => sum + (parseInt(v.votos_2024) || 0), 0);

    // Análise por Município
    const analisePorMunicipio = {};
    vereadores.forEach(vereador => {
      const municipio = vereador.municipio || 'Não Informado';
      
      if (!analisePorMunicipio[municipio]) {
        analisePorMunicipio[municipio] = {
          totalCandidatos: 0,
          eleitos: 0,
          naoEleitos: 0,
          votos2024: 0,
          votos2020: 0,
          votos2016: 0,
          totalCadeiras: 0,
          maiorVotacao2024: 0,
          menorVotacao2024: 0,
          eficiencia: 0
        };
      }
      
      const analise = analisePorMunicipio[municipio];
      analise.totalCandidatos++;
      
      if (vereador.eleito_nao_eleito_2024 && vereador.eleito_nao_eleito_2024.toLowerCase().includes('eleito')) {
        analise.eleitos++;
      } else {
        analise.naoEleitos++;
      }
      
      analise.votos2024 += parseInt(vereador.votos_2024) || 0;
      analise.votos2020 += parseInt(vereador.votos_2020) || 0;
      analise.votos2016 += parseInt(vereador.votos_2016) || 0;
      analise.totalCadeiras = Math.max(analise.totalCadeiras, parseInt(vereador.total_cadeiras) || 0);
      analise.maiorVotacao2024 = Math.max(analise.maiorVotacao2024, parseInt(vereador.maior_votacao_eleito_2024) || 0);
      
      if (analise.menorVotacao2024 === 0) {
        analise.menorVotacao2024 = parseInt(vereador.menor_votacao_eleito_2024) || 0;
      } else {
        analise.menorVotacao2024 = Math.min(analise.menorVotacao2024, parseInt(vereador.menor_votacao_eleito_2024) || 0);
      }
      
      // Calcular eficiência (eleitos / total de cadeiras)
      if (analise.totalCadeiras > 0) {
        analise.eficiencia = ((analise.eleitos / analise.totalCadeiras) * 100).toFixed(1) + '%';
      }
    });

    // Evolução Eleitoral
    const evolucaoEleitoral = vereadores.map(vereador => {
      const votos2016 = parseInt(vereador.votos_2016) || 0;
      const votos2020 = parseInt(vereador.votos_2020) || 0;
      const votos2024 = parseInt(vereador.votos_2024) || 0;
      
      const crescimento2020 = votos2016 > 0 ? (((votos2020 - votos2016) / votos2016) * 100).toFixed(1) : '0.0';
      const crescimento2024 = votos2020 > 0 ? (((votos2024 - votos2020) / votos2020) * 100).toFixed(1) : '0.0';
      
      return {
        nome: vereador.nome_2024 || 'Não Informado',
        municipio: vereador.municipio || 'Não Informado',
        regiao: vereador.regiao || 'Não Informado',
        votos2016,
        votos2020,
        votos2024,
        crescimento2020: crescimento2020 + '%',
        crescimento2024: crescimento2024 + '%',
        situacao2024: vereador.eleito_nao_eleito_2024 || 'Não Informado'
      };
    }).sort((a, b) => b.votos2024 - a.votos2024);

    // Ranking de Vereadores Eleitos
    const rankingVereadores = vereadores
      .filter(v => v.eleito_nao_eleito_2024 && v.eleito_nao_eleito_2024.toLowerCase().includes('eleito'))
      .map(vereador => ({
        nome: vereador.nome_2024 || 'Não Informado',
        municipio: vereador.municipio || 'Não Informado',
        regiao: vereador.regiao || 'Não Informado',
        partido: vereador.partido || 'Não Informado',
        votos2024: parseInt(vereador.votos_2024) || 0,
        mandato: vereador.qual_mandato_esta || 'Não Informado',
        funcao: vereador.funcao || 'Não Informado'
      }))
      .sort((a, b) => b.votos2024 - a.votos2024);

    return {
      success: true,
      relatorioVereadores: {
        resumoGeral: {
          totalVereadores,
          totalEleitos,
          totalNaoEleitos,
          taxaSucesso: totalVereadores > 0 ? ((totalEleitos / totalVereadores) * 100).toFixed(1) + '%' : '0%',
          totalVotos2024,
          dataGeracao: new Date().toLocaleString('pt-BR')
        },
        analisePorMunicipio,
        evolucaoEleitoral,
        rankingVereadores,
        estatisticasGerais: {
          municipiosComCandidatos: Object.keys(analisePorMunicipio).length,
          mediaVotosPorCandidato: totalVereadores > 0 ? Math.round(totalVotos2024 / totalVereadores) : 0,
          melhorMunicipio: Object.entries(analisePorMunicipio)
            .sort(([,a], [,b]) => parseFloat(b.eficiencia) - parseFloat(a.eficiencia))[0]?.[0] || 'N/A'
        }
      }
    };
    
  } catch (error) {
    console.error('Erro ao gerar relatório de vereadores:', error);
    return { 
      success: false, 
      error: 'Erro ao gerar relatório: ' + error.toString() 
    };
  }
}

/**
 * 📊 OBTER DADOS ESPECÍFICOS DE VEREADORES
 */
function getVereadorData(data) {
  try {
    // Verificar permissões
    if (!data.userInfo || data.userInfo.role !== 'COORDENADOR') {
      return { 
        success: false, 
        error: 'Acesso negado. Apenas coordenadores podem acessar dados de vereadores.' 
      };
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.ELEICOES_VEREADORES);
    if (!sheet) {
      return { success: true, vereador: null };
    }

    const values = sheet.getDataRange().getValues();
    const headers = values[0];
    
    // Buscar vereador específico
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === data.vereadorId) {
        const vereador = {};
        headers.forEach((header, index) => {
          vereador[header.toLowerCase().replace(/[^a-z0-9]/g, '_')] = values[i][index];
        });
        
        return { 
          success: true, 
          vereador 
        };
      }
    }
    
    return { 
      success: false, 
      error: 'Vereador não encontrado' 
    };
    
  } catch (error) {
    console.error('Erro ao obter dados do vereador:', error);
    return { 
      success: false, 
      error: 'Erro ao obter dados: ' + error.toString() 
    };
  }
}

// 🏛️ ================== FUNÇÕES ELEITORAIS - CONSELHO ==================

/**
 * 📋 ADICIONAR CONSELHEIRO
 */
function adicionarConselheiro(data) {
  try {
    // Verificar permissões
    if (!data.userInfo || data.userInfo.role !== 'COORDENADOR') {
      return { 
        success: false, 
        error: 'Acesso negado. Apenas coordenadores podem gerenciar dados de conselheiros.' 
      };
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.ELEICOES_CONSELHO);
    
    // Se a aba não existir, criar com cabeçalhos
    if (!sheet) {
      const newSheet = SpreadsheetApp.openById(SPREADSHEET_ID).insertSheet(SHEETS.ELEICOES_CONSELHO);
      newSheet.getRange(1, 1, 1, 12).setValues([[
        'ID', 'REGIAO', 'IGREJA', 'MUNICIPIO', 'NOMES_2023', 'CONTATO', 'FUNCAO', 
        'VOTOS_2019', 'ELEITO_NAO_ELEITO_2023', 'VOTOS_2023', 'POSICAO_2023',
        'DATA_CADASTRO', 'ULTIMA_ATUALIZACAO'
      ]]);
      return adicionarConselheiro(data); // Tentar novamente
    }

    // Gerar ID único
    const lastRow = sheet.getLastRow();
    const newId = 'CNS' + String(lastRow).padStart(3, '0');
    
    const agora = new Date();
    
    // Dados do conselheiro
    const conselheiroData = [
      newId,
      data.regiao || '',
      data.igreja || '',
      data.municipio || '',
      data.nomes2023 || '',
      data.contato || '',
      data.funcao || '',
      parseInt(data.votos2019) || 0,
      data.eleitoNaoEleito2023 || '',
      parseInt(data.votos2023) || 0,
      data.posicao2023 || '',
      agora,
      agora
    ];

    // Adicionar à planilha
    sheet.appendRow(conselheiroData);
    
    return { 
      success: true, 
      message: 'Conselheiro adicionado com sucesso!',
      conselheiroId: newId
    };
    
  } catch (error) {
    console.error('Erro ao adicionar conselheiro:', error);
    return { 
      success: false, 
      error: 'Erro ao adicionar conselheiro: ' + error.toString() 
    };
  }
}

/**
 * 🔍 BUSCAR CONSELHEIROS
 */
function buscarConselheiros(data) {
  try {
    // Verificar permissões
    if (!data.userInfo || data.userInfo.role !== 'COORDENADOR') {
      return { 
        success: false, 
        error: 'Acesso negado. Apenas coordenadores podem acessar dados de conselheiros.' 
      };
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.ELEICOES_CONSELHO);
    if (!sheet) {
      return { success: true, conselheiros: [] };
    }

    const values = sheet.getDataRange().getValues();
    if (values.length <= 1) {
      return { success: true, conselheiros: [] };
    }

    const headers = values[0];
    const conselheiros = [];

    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const conselheiro = {};
      
      headers.forEach((header, index) => {
        conselheiro[header.toLowerCase().replace(/[^a-z0-9]/g, '_')] = row[index];
      });
      
      conselheiros.push(conselheiro);
    }

    // Aplicar filtros se fornecidos
    let conselheirosFiltrados = conselheiros;
    
    if (data.regiao) {
      conselheirosFiltrados = conselheirosFiltrados.filter(c => 
        c.regiao && c.regiao.toLowerCase().includes(data.regiao.toLowerCase())
      );
    }
    
    if (data.municipio) {
      conselheirosFiltrados = conselheirosFiltrados.filter(c => 
        c.municipio && c.municipio.toLowerCase().includes(data.municipio.toLowerCase())
      );
    }
    
    if (data.eleito) {
      conselheirosFiltrados = conselheirosFiltrados.filter(c => 
        c.eleito_nao_eleito_2023 && c.eleito_nao_eleito_2023.toLowerCase().includes('eleito')
      );
    }

    return { 
      success: true, 
      conselheiros: conselheirosFiltrados 
    };
    
  } catch (error) {
    console.error('Erro ao buscar conselheiros:', error);
    return { 
      success: false, 
      error: 'Erro ao buscar conselheiros: ' + error.toString() 
    };
  }
}

/**
 * ✏️ ATUALIZAR CONSELHEIRO
 */
function atualizarConselheiro(data) {
  try {
    // Verificar permissões
    if (!data.userInfo || data.userInfo.role !== 'COORDENADOR') {
      return { 
        success: false, 
        error: 'Acesso negado. Apenas coordenadores podem editar dados de conselheiros.' 
      };
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.ELEICOES_CONSELHO);
    if (!sheet) {
      return { success: false, error: 'Planilha de conselheiros não encontrada' };
    }

    const values = sheet.getDataRange().getValues();
    const headers = values[0];
    
    // Encontrar a linha do conselheiro
    let rowIndex = -1;
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === data.conselheiroId) {
        rowIndex = i + 1;
        break;
      }
    }
    
    if (rowIndex === -1) {
      return { success: false, error: 'Conselheiro não encontrado' };
    }

    // Atualizar dados
    const agora = new Date();
    const updatedData = [
      data.conselheiroId,
      data.regiao || values[rowIndex-1][1],
      data.igreja || values[rowIndex-1][2],
      data.municipio || values[rowIndex-1][3],
      data.nomes2023 || values[rowIndex-1][4],
      data.contato || values[rowIndex-1][5],
      data.funcao || values[rowIndex-1][6],
      data.votos2019 !== undefined ? parseInt(data.votos2019) || 0 : values[rowIndex-1][7],
      data.eleitoNaoEleito2023 || values[rowIndex-1][8],
      data.votos2023 !== undefined ? parseInt(data.votos2023) || 0 : values[rowIndex-1][9],
      data.posicao2023 || values[rowIndex-1][10],
      values[rowIndex-1][11], // DATA_CADASTRO (manter original)
      agora // ULTIMA_ATUALIZACAO
    ];

    sheet.getRange(rowIndex, 1, 1, updatedData.length).setValues([updatedData]);
    
    return { 
      success: true, 
      message: 'Conselheiro atualizado com sucesso!' 
    };
    
  } catch (error) {
    console.error('Erro ao atualizar conselheiro:', error);
    return { 
      success: false, 
      error: 'Erro ao atualizar conselheiro: ' + error.toString() 
    };
  }
}

/**
 * 🗑️ REMOVER CONSELHEIRO
 */
function removerConselheiro(data) {
  try {
    // Verificar permissões
    if (!data.userInfo || data.userInfo.role !== 'COORDENADOR') {
      return { 
        success: false, 
        error: 'Acesso negado. Apenas coordenadores podem remover dados de conselheiros.' 
      };
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.ELEICOES_CONSELHO);
    if (!sheet) {
      return { success: false, error: 'Planilha de conselheiros não encontrada' };
    }

    const values = sheet.getDataRange().getValues();
    
    // Encontrar a linha do conselheiro
    let rowIndex = -1;
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === data.conselheiroId) {
        rowIndex = i + 1;
        break;
      }
    }
    
    if (rowIndex === -1) {
      return { success: false, error: 'Conselheiro não encontrado' };
    }

    sheet.deleteRow(rowIndex);
    
    return { 
      success: true, 
      message: 'Conselheiro removido com sucesso!' 
    };
    
  } catch (error) {
    console.error('Erro ao remover conselheiro:', error);
    return { 
      success: false, 
      error: 'Erro ao remover conselheiro: ' + error.toString() 
    };
  }
}

/**
 * 📊 GERAR RELATÓRIO DE CONSELHO
 */
function generateConselhoReport(data) {
  try {
    // Verificar permissões
    if (!data.userInfo || data.userInfo.role !== 'COORDENADOR') {
      return { 
        success: false, 
        error: 'Acesso negado. Apenas coordenadores podem gerar relatórios de conselho.' 
      };
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.ELEICOES_CONSELHO);
    if (!sheet) {
      return { 
        success: true, 
        relatorioConselho: {
          resumoGeral: { totalConselheiros: 0, totalEleitos: 0, totalNaoEleitos: 0 },
          analisePorRegiao: {},
          evolucaoEleitoral: [],
          rankingConselheiros: []
        }
      };
    }

    const values = sheet.getDataRange().getValues();
    if (values.length <= 1) {
      return { 
        success: true, 
        relatorioConselho: {
          resumoGeral: { totalConselheiros: 0, totalEleitos: 0, totalNaoEleitos: 0 },
          analisePorRegiao: {},
          evolucaoEleitoral: [],
          rankingConselheiros: []
        }
      };
    }

    const headers = values[0];
    const conselheiros = [];

    // Processar dados
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const conselheiro = {};
      
      headers.forEach((header, index) => {
        conselheiro[header.toLowerCase().replace(/[^a-z0-9]/g, '_')] = row[index];
      });
      
      conselheiros.push(conselheiro);
    }

    // Resumo Geral
    const totalConselheiros = conselheiros.length;
    const totalEleitos = conselheiros.filter(c => 
      c.eleito_nao_eleito_2023 && c.eleito_nao_eleito_2023.toLowerCase().includes('eleito')
    ).length;
    const totalNaoEleitos = totalConselheiros - totalEleitos;
    const totalVotos2023 = conselheiros.reduce((sum, c) => sum + (parseInt(c.votos_2023) || 0), 0);
    const totalVotos2019 = conselheiros.reduce((sum, c) => sum + (parseInt(c.votos_2019) || 0), 0);

    // Análise por Região
    const analisePorRegiao = {};
    conselheiros.forEach(conselheiro => {
      const regiao = conselheiro.regiao || 'Não Informado';
      
      if (!analisePorRegiao[regiao]) {
        analisePorRegiao[regiao] = {
          totalConselheiros: 0,
          eleitos: 0,
          naoEleitos: 0,
          votos2023: 0,
          votos2019: 0,
          crescimento: 0,
          igrejas: new Set(),
          municipios: new Set()
        };
      }
      
      const analise = analisePorRegiao[regiao];
      analise.totalConselheiros++;
      
      if (conselheiro.eleito_nao_eleito_2023 && conselheiro.eleito_nao_eleito_2023.toLowerCase().includes('eleito')) {
        analise.eleitos++;
      } else {
        analise.naoEleitos++;
      }
      
      analise.votos2023 += parseInt(conselheiro.votos_2023) || 0;
      analise.votos2019 += parseInt(conselheiro.votos_2019) || 0;
      
      if (conselheiro.igreja) analise.igrejas.add(conselheiro.igreja);
      if (conselheiro.municipio) analise.municipios.add(conselheiro.municipio);
    });

    // Calcular crescimento por região
    Object.keys(analisePorRegiao).forEach(regiao => {
      const analise = analisePorRegiao[regiao];
      analise.totalIgrejas = analise.igrejas.size;
      analise.totalMunicipios = analise.municipios.size;
      analise.igrejas = undefined; // Remover Set para serialização
      analise.municipios = undefined;
      
      if (analise.votos2019 > 0) {
        analise.crescimento = (((analise.votos2023 - analise.votos2019) / analise.votos2019) * 100).toFixed(1) + '%';
      } else {
        analise.crescimento = 'N/A';
      }
    });

    // Evolução Eleitoral Individual
    const evolucaoEleitoral = conselheiros.map(conselheiro => {
      const votos2019 = parseInt(conselheiro.votos_2019) || 0;
      const votos2023 = parseInt(conselheiro.votos_2023) || 0;
      
      let crescimento = '0.0%';
      if (votos2019 > 0) {
        crescimento = (((votos2023 - votos2019) / votos2019) * 100).toFixed(1) + '%';
      }
      
      return {
        nome: conselheiro.nomes_2023 || 'Não Informado',
        regiao: conselheiro.regiao || 'Não Informado',
        municipio: conselheiro.municipio || 'Não Informado',
        votos2019,
        votos2023,
        crescimento,
        posicao2023: conselheiro.posicao_2023 || 'N/A',
        situacao2023: conselheiro.eleito_nao_eleito_2023 || 'Não Informado'
      };
    }).sort((a, b) => b.votos2023 - a.votos2023);

    // Ranking de Conselheiros Eleitos
    const rankingConselheiros = conselheiros
      .filter(c => c.eleito_nao_eleito_2023 && c.eleito_nao_eleito_2023.toLowerCase().includes('eleito'))
      .map(conselheiro => ({
        nome: conselheiro.nomes_2023 || 'Não Informado',
        regiao: conselheiro.regiao || 'Não Informado',
        municipio: conselheiro.municipio || 'Não Informado',
        votos2023: parseInt(conselheiro.votos_2023) || 0,
        posicao2023: conselheiro.posicao_2023 || 'N/A',
        funcao: conselheiro.funcao || 'Não Informado',
        votos2019: parseInt(conselheiro.votos_2019) || 0
      }))
      .sort((a, b) => b.votos2023 - a.votos2023);

    return {
      success: true,
      relatorioConselho: {
        resumoGeral: {
          totalConselheiros,
          totalEleitos,
          totalNaoEleitos,
          taxaSucesso: totalConselheiros > 0 ? ((totalEleitos / totalConselheiros) * 100).toFixed(1) + '%' : '0%',
          totalVotos2023,
          totalVotos2019,
          crescimentoGeral: totalVotos2019 > 0 ? (((totalVotos2023 - totalVotos2019) / totalVotos2019) * 100).toFixed(1) + '%' : 'N/A',
          dataGeracao: new Date().toLocaleString('pt-BR')
        },
        analisePorRegiao,
        evolucaoEleitoral,
        rankingConselheiros,
        estatisticasGerais: {
          regioesComConselheiros: Object.keys(analisePorRegiao).length,
          mediaVotosPorConselheiro: totalConselheiros > 0 ? Math.round(totalVotos2023 / totalConselheiros) : 0,
          melhorRegiao: Object.entries(analisePorRegiao)
            .sort(([,a], [,b]) => parseFloat(b.crescimento) - parseFloat(a.crescimento))[0]?.[0] || 'N/A'
        }
      }
    };
    
  } catch (error) {
    console.error('Erro ao gerar relatório de conselho:', error);
    return { 
      success: false, 
      error: 'Erro ao gerar relatório: ' + error.toString() 
    };
  }
}

/**
 * 📊 OBTER DADOS ESPECÍFICOS DE CONSELHEIRO
 */
function getConselhoData(data) {
  try {
    // Verificar permissões
    if (!data.userInfo || data.userInfo.role !== 'COORDENADOR') {
      return { 
        success: false, 
        error: 'Acesso negado. Apenas coordenadores podem acessar dados de conselheiros.' 
      };
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.ELEICOES_CONSELHO);
    if (!sheet) {
      return { success: true, conselheiro: null };
    }

    const values = sheet.getDataRange().getValues();
    const headers = values[0];
    
    // Buscar conselheiro específico
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === data.conselheiroId) {
        const conselheiro = {};
        headers.forEach((header, index) => {
          conselheiro[header.toLowerCase().replace(/[^a-z0-9]/g, '_')] = values[i][index];
        });
        
        return { 
          success: true, 
          conselheiro 
        };
      }
    }
    
    return { 
      success: false, 
      error: 'Conselheiro não encontrado' 
    };
    
  } catch (error) {
    console.error('Erro ao obter dados do conselheiro:', error);
    return { 
      success: false, 
      error: 'Erro ao obter dados: ' + error.toString() 
    };
  }
}

// 📊 ================== FUNÇÕES DE DASHBOARD ANALYTICS ==================

/**
 * 📊 OBTER ANALYTICS COMPLETOS DO DASHBOARD
 */
function getDashboardAnalytics(data) {
  try {
    // Verificar permissões básicas
    if (!data.userInfo) {
      return { 
        success: false, 
        error: 'Acesso negado. Login necessário.' 
      };
    }

    const filtros = {
      regiao: data.regiao || null,
      igreja: data.igreja || null,
      municipio: data.municipio || null
    };

    // Obter dados de todas as abas principais
    const chamados = getChamadosData(filtros);
    const usuarios = getUsuariosData(filtros);
    const profissionais = getProfissionaisData(filtros);
    const assessores = getAssessoresData(filtros);
    
    // Dados eleitorais (apenas para coordenadores)
    let eleitorais = {};
    if (data.userInfo.role === 'COORDENADOR') {
      eleitorais = {
        deputados: getDeputadosData(filtros),
        vereadores: getVereadoresData(filtros),
        conselho: getConselhoDataAnalytics(filtros)
      };
    }

    // Estatísticas gerais por região/igreja/município
    const analytics = {
      resumoGeral: {
        totalChamados: chamados.total,
        chamadosAbertos: chamados.abertos,
        chamadosAndamento: chamados.andamento,
        chamadosFinalizados: chamados.finalizados,
        taxaFinalizacao: chamados.total > 0 ? ((chamados.finalizados / chamados.total) * 100).toFixed(1) + '%' : '0%',
        tempoMedioResolucao: chamados.tempoMedioResolucao || 0,
        totalUsuarios: usuarios.total,
        totalProfissionais: profissionais.total,
        totalAssessores: assessores.total
      },
      analisePorRegiao: getAnaliseRegional(chamados, usuarios, profissionais),
      analisePorIgreja: getAnaliseIgreja(chamados, usuarios, profissionais),
      analisePorMunicipio: getAnaliseMunicipio(chamados, usuarios, profissionais),
      progresso: getAnaliseProgresso(chamados),
      eleitorais: eleitorais,
      filtrosAplicados: filtros,
      dataGeracao: new Date().toLocaleString('pt-BR')
    };

    return {
      success: true,
      analytics: analytics
    };
    
  } catch (error) {
    console.error('Erro ao obter analytics do dashboard:', error);
    return { 
      success: false, 
      error: 'Erro ao obter analytics: ' + error.toString() 
    };
  }
}

/**
 * 📞 OBTER DADOS DE CHAMADOS COM FILTROS
 */
function getChamadosData(filtros) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.CHAMADOS);
    if (!sheet) return { total: 0, abertos: 0, andamento: 0, finalizados: 0, dados: [] };

    const values = sheet.getDataRange().getValues();
    if (values.length <= 1) return { total: 0, abertos: 0, andamento: 0, finalizados: 0, dados: [] };

    const headers = values[0];
    let chamados = [];

    // Processar dados
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const chamado = {};
      
      headers.forEach((header, index) => {
        chamado[header.toLowerCase().replace(/[^a-z0-9]/g, '_')] = row[index];
      });
      
      chamados.push(chamado);
    }

    // Aplicar filtros
    if (filtros.regiao) {
      chamados = chamados.filter(c => c.regiao && c.regiao.toLowerCase().includes(filtros.regiao.toLowerCase()));
    }
    if (filtros.igreja) {
      chamados = chamados.filter(c => c.igreja && c.igreja.toLowerCase().includes(filtros.igreja.toLowerCase()));
    }
    if (filtros.municipio) {
      chamados = chamados.filter(c => c.municipio && c.municipio.toLowerCase().includes(filtros.municipio.toLowerCase()));
    }

    // Calcular estatísticas
    const total = chamados.length;
    const abertos = chamados.filter(c => c.status && c.status.toLowerCase() === 'aberto').length;
    const andamento = chamados.filter(c => c.status && c.status.toLowerCase() === 'em andamento').length;
    const finalizados = chamados.filter(c => c.status && c.status.toLowerCase() === 'finalizado').length;

    // Calcular tempo médio de resolução
    const chamadosFinalizadosComTempo = chamados.filter(c => 
      c.status && c.status.toLowerCase() === 'finalizado' && c.data_criacao && c.data_finalizacao
    );
    
    let tempoMedioResolucao = 0;
    if (chamadosFinalizadosComTempo.length > 0) {
      const tempoTotal = chamadosFinalizadosComTempo.reduce((sum, c) => {
        const inicio = new Date(c.data_criacao);
        const fim = new Date(c.data_finalizacao);
        return sum + (fim - inicio) / (1000 * 60 * 60 * 24); // dias
      }, 0);
      tempoMedioResolucao = (tempoTotal / chamadosFinalizadosComTempo.length).toFixed(1);
    }

    return {
      total,
      abertos,
      andamento,
      finalizados,
      tempoMedioResolucao,
      dados: chamados
    };
    
  } catch (error) {
    console.error('Erro ao obter dados de chamados:', error);
    return { total: 0, abertos: 0, andamento: 0, finalizados: 0, dados: [] };
  }
}

/**
 * 👥 OBTER DADOS DE USUÁRIOS COM FILTROS
 */
function getUsuariosData(filtros) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.USUARIOS);
    if (!sheet) return { total: 0, dados: [] };

    const values = sheet.getDataRange().getValues();
    if (values.length <= 1) return { total: 0, dados: [] };

    const headers = values[0];
    let usuarios = [];

    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const usuario = {};
      
      headers.forEach((header, index) => {
        usuario[header.toLowerCase().replace(/[^a-z0-9]/g, '_')] = row[index];
      });
      
      usuarios.push(usuario);
    }

    // Aplicar filtros
    if (filtros.regiao) {
      usuarios = usuarios.filter(u => u.regiao && u.regiao.toLowerCase().includes(filtros.regiao.toLowerCase()));
    }
    if (filtros.igreja) {
      usuarios = usuarios.filter(u => u.igreja && u.igreja.toLowerCase().includes(filtros.igreja.toLowerCase()));
    }

    return {
      total: usuarios.length,
      dados: usuarios
    };
    
  } catch (error) {
    console.error('Erro ao obter dados de usuários:', error);
    return { total: 0, dados: [] };
  }
}

/**
 * 👨‍⚕️ OBTER DADOS DE PROFISSIONAIS COM FILTROS
 */
function getProfissionaisData(filtros) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.PROFISSIONAIS_LIBERAIS);
    if (!sheet) return { total: 0, dados: [] };

    const values = sheet.getDataRange().getValues();
    if (values.length <= 1) return { total: 0, dados: [] };

    const headers = values[0];
    let profissionais = [];

    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const profissional = {};
      
      headers.forEach((header, index) => {
        profissional[header.toLowerCase().replace(/[^a-z0-9]/g, '_')] = row[index];
      });
      
      profissionais.push(profissional);
    }

    // Aplicar filtros
    if (filtros.municipio) {
      profissionais = profissionais.filter(p => p.cidade && p.cidade.toLowerCase().includes(filtros.municipio.toLowerCase()));
    }

    return {
      total: profissionais.length,
      dados: profissionais
    };
    
  } catch (error) {
    console.error('Erro ao obter dados de profissionais:', error);
    return { total: 0, dados: [] };
  }
}

/**
 * 🏛️ OBTER DADOS DE ASSESSORES COM FILTROS
 */
function getAssessoresData(filtros) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.ASSESSORES);
    if (!sheet) return { total: 0, dados: [] };

    const values = sheet.getDataRange().getValues();
    if (values.length <= 1) return { total: 0, dados: [] };

    const headers = values[0];
    let assessores = [];

    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const assessor = {};
      
      headers.forEach((header, index) => {
        assessor[header.toLowerCase().replace(/[^a-z0-9]/g, '_')] = row[index];
      });
      
      assessores.push(assessor);
    }

    // Aplicar filtros
    if (filtros.regiao) {
      assessores = assessores.filter(a => a.regiao && a.regiao.toLowerCase().includes(filtros.regiao.toLowerCase()));
    }

    return {
      total: assessores.length,
      dados: assessores
    };
    
  } catch (error) {
    console.error('Erro ao obter dados de assessores:', error);
    return { total: 0, dados: [] };
  }
}

/**
 * 🗳️ OBTER DADOS ELEITORAIS PARA ANALYTICS
 */
function getDeputadosData(filtros) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.ELEICOES_DEPUTADOS);
    if (!sheet) return { total: 0 };

    const values = sheet.getDataRange().getValues();
    if (values.length <= 1) return { total: 0 };

    let municipios = values.slice(1);

    // Aplicar filtros
    if (filtros.regiao) {
      municipios = municipios.filter(m => m[1] && m[1].toLowerCase().includes(filtros.regiao.toLowerCase()));
    }
    if (filtros.igreja) {
      municipios = municipios.filter(m => m[2] && m[2].toLowerCase().includes(filtros.igreja.toLowerCase()));
    }
    if (filtros.municipio) {
      municipios = municipios.filter(m => m[3] && m[3].toLowerCase().includes(filtros.municipio.toLowerCase()));
    }

    return { total: municipios.length };
    
  } catch (error) {
    return { total: 0 };
  }
}

function getVereadoresData(filtros) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.ELEICOES_VEREADORES);
    if (!sheet) return { total: 0, eleitos: 0 };

    const values = sheet.getDataRange().getValues();
    if (values.length <= 1) return { total: 0, eleitos: 0 };

    let vereadores = values.slice(1);

    // Aplicar filtros
    if (filtros.regiao) {
      vereadores = vereadores.filter(v => v[1] && v[1].toLowerCase().includes(filtros.regiao.toLowerCase()));
    }
    if (filtros.municipio) {
      vereadores = vereadores.filter(v => v[3] && v[3].toLowerCase().includes(filtros.municipio.toLowerCase()));
    }

    const eleitos = vereadores.filter(v => v[8] && v[8].toLowerCase().includes('eleito')).length;

    return { total: vereadores.length, eleitos };
    
  } catch (error) {
    return { total: 0, eleitos: 0 };
  }
}

function getConselhoDataAnalytics(filtros) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.ELEICOES_CONSELHO);
    if (!sheet) return { total: 0, eleitos: 0 };

    const values = sheet.getDataRange().getValues();
    if (values.length <= 1) return { total: 0, eleitos: 0 };

    let conselheiros = values.slice(1);

    // Aplicar filtros
    if (filtros.regiao) {
      conselheiros = conselheiros.filter(c => c[1] && c[1].toLowerCase().includes(filtros.regiao.toLowerCase()));
    }
    if (filtros.municipio) {
      conselheiros = conselheiros.filter(c => c[3] && c[3].toLowerCase().includes(filtros.municipio.toLowerCase()));
    }

    const eleitos = conselheiros.filter(c => c[8] && c[8].toLowerCase().includes('eleito')).length;

    return { total: conselheiros.length, eleitos };
    
  } catch (error) {
    return { total: 0, eleitos: 0 };
  }
}

/**
 * 🌍 ANÁLISE POR REGIÃO
 */
function getAnaliseRegional(chamados, usuarios, profissionais) {
  const analise = {};
  
  // Agrupar chamados por região
  chamados.dados.forEach(chamado => {
    const regiao = chamado.regiao || 'Não Informado';
    
    if (!analise[regiao]) {
      analise[regiao] = {
        totalChamados: 0,
        chamadosFinalizados: 0,
        chamadosAbertos: 0,
        usuarios: 0,
        profissionais: 0,
        igrejas: new Set(),
        municipios: new Set()
      };
    }
    
    analise[regiao].totalChamados++;
    
    if (chamado.status && chamado.status.toLowerCase() === 'finalizado') {
      analise[regiao].chamadosFinalizados++;
    } else if (chamado.status && chamado.status.toLowerCase() === 'aberto') {
      analise[regiao].chamadosAbertos++;
    }
    
    if (chamado.igreja) analise[regiao].igrejas.add(chamado.igreja);
    if (chamado.municipio) analise[regiao].municipios.add(chamado.municipio);
  });
  
  // Adicionar usuários por região
  usuarios.dados.forEach(usuario => {
    const regiao = usuario.regiao || 'Não Informado';
    if (analise[regiao]) {
      analise[regiao].usuarios++;
    }
  });
  
  // Calcular taxas e converter Sets
  Object.keys(analise).forEach(regiao => {
    const dados = analise[regiao];
    dados.taxaFinalizacao = dados.totalChamados > 0 ? 
      ((dados.chamadosFinalizados / dados.totalChamados) * 100).toFixed(1) + '%' : '0%';
    dados.totalIgrejas = dados.igrejas.size;
    dados.totalMunicipios = dados.municipios.size;
    delete dados.igrejas;
    delete dados.municipios;
  });
  
  return analise;
}

/**
 * ⛪ ANÁLISE POR IGREJA
 */
function getAnaliseIgreja(chamados, usuarios, profissionais) {
  const analise = {};
  
  chamados.dados.forEach(chamado => {
    const igreja = chamado.igreja || 'Não Informado';
    
    if (!analise[igreja]) {
      analise[igreja] = {
        totalChamados: 0,
        chamadosFinalizados: 0,
        chamadosAbertos: 0,
        regiao: chamado.regiao || 'Não Informado',
        municipio: chamado.municipio || 'Não Informado'
      };
    }
    
    analise[igreja].totalChamados++;
    
    if (chamado.status && chamado.status.toLowerCase() === 'finalizado') {
      analise[igreja].chamadosFinalizados++;
    } else if (chamado.status && chamado.status.toLowerCase() === 'aberto') {
      analise[igreja].chamadosAbertos++;
    }
  });
  
  // Calcular taxas
  Object.keys(analise).forEach(igreja => {
    const dados = analise[igreja];
    dados.taxaFinalizacao = dados.totalChamados > 0 ? 
      ((dados.chamadosFinalizados / dados.totalChamados) * 100).toFixed(1) + '%' : '0%';
  });
  
  return analise;
}

/**
 * 🏙️ ANÁLISE POR MUNICÍPIO
 */
function getAnaliseMunicipio(chamados, usuarios, profissionais) {
  const analise = {};
  
  chamados.dados.forEach(chamado => {
    const municipio = chamado.municipio || 'Não Informado';
    
    if (!analise[municipio]) {
      analise[municipio] = {
        totalChamados: 0,
        chamadosFinalizados: 0,
        chamadosAbertos: 0,
        regiao: chamado.regiao || 'Não Informado',
        profissionais: 0
      };
    }
    
    analise[municipio].totalChamados++;
    
    if (chamado.status && chamado.status.toLowerCase() === 'finalizado') {
      analise[municipio].chamadosFinalizados++;
    } else if (chamado.status && chamado.status.toLowerCase() === 'aberto') {
      analise[municipio].chamadosAbertos++;
    }
  });
  
  // Adicionar profissionais por município
  profissionais.dados.forEach(profissional => {
    const municipio = profissional.cidade || 'Não Informado';
    if (analise[municipio]) {
      analise[municipio].profissionais++;
    }
  });
  
  // Calcular taxas
  Object.keys(analise).forEach(municipio => {
    const dados = analise[municipio];
    dados.taxaFinalizacao = dados.totalChamados > 0 ? 
      ((dados.chamadosFinalizados / dados.totalChamados) * 100).toFixed(1) + '%' : '0%';
  });
  
  return analise;
}

/**
 * 📈 ANÁLISE DE PROGRESSO
 */
function getAnaliseProgresso(chamados) {
  const hoje = new Date();
  const umMesAtras = new Date(hoje.getFullYear(), hoje.getMonth() - 1, hoje.getDate());
  const seiseMesesAtras = new Date(hoje.getFullYear(), hoje.getMonth() - 6, hoje.getDate());
  
  const progressoMensal = {};
  const progressoSemestral = {};
  
  chamados.dados.forEach(chamado => {
    if (!chamado.data_criacao) return;
    
    const dataCriacao = new Date(chamado.data_criacao);
    const mesAno = dataCriacao.getFullYear() + '-' + String(dataCriacao.getMonth() + 1).padStart(2, '0');
    
    if (!progressoMensal[mesAno]) {
      progressoMensal[mesAno] = {
        total: 0,
        finalizados: 0,
        abertos: 0,
        andamento: 0
      };
    }
    
    progressoMensal[mesAno].total++;
    
    if (chamado.status) {
      if (chamado.status.toLowerCase() === 'finalizado') {
        progressoMensal[mesAno].finalizados++;
      } else if (chamado.status.toLowerCase() === 'aberto') {
        progressoMensal[mesAno].abertos++;
      } else if (chamado.status.toLowerCase() === 'em andamento') {
        progressoMensal[mesAno].andamento++;
      }
    }
  });
  
  return {
    progressoMensal,
    tendencia: calcularTendencia(progressoMensal)
  };
}

/**
 * 📊 CALCULAR TENDÊNCIA DE PROGRESSO
 */
function calcularTendencia(progressoMensal) {
  const meses = Object.keys(progressoMensal).sort();
  if (meses.length < 2) return 'Insuficiente';
  
  const ultimoMes = progressoMensal[meses[meses.length - 1]];
  const penultimoMes = progressoMensal[meses[meses.length - 2]];
  
  const crescimentoChamados = ultimoMes.total - penultimoMes.total;
  const crescimentoFinalizados = ultimoMes.finalizados - penultimoMes.finalizados;
  
  if (crescimentoChamados > 0 && crescimentoFinalizados > crescimentoChamados * 0.8) {
    return 'Crescimento Positivo';
  } else if (crescimentoChamados < 0 && crescimentoFinalizados >= 0) {
    return 'Estabilização';
  } else if (crescimentoFinalizados < 0) {
    return 'Atenção Necessária';
  } else {
    return 'Estável';
  }
}

/**
 * � ANALYTICS ESPECÍFICOS DE CHAMADOS
 */
function getChamadosAnalytics(data) {
  try {
    if (!data.userInfo) {
      return { 
        success: false, 
        error: 'Acesso negado. Login necessário.' 
      };
    }

    const filtros = {
      regiao: data.regiao || null,
      igreja: data.igreja || null,
      municipio: data.municipio || null,
      periodo: data.periodo || 'todos' // ultimos30dias, ultimos90dias, todos
    };

    const chamados = getChamadosData(filtros);
    
    // Análise detalhada por status
    const statusAnalysis = {
      abertos: {
        total: chamados.abertos,
        percentual: chamados.total > 0 ? ((chamados.abertos / chamados.total) * 100).toFixed(1) + '%' : '0%',
        detalhes: getDetalhesPorStatus(chamados.dados, 'aberto')
      },
      andamento: {
        total: chamados.andamento,
        percentual: chamados.total > 0 ? ((chamados.andamento / chamados.total) * 100).toFixed(1) + '%' : '0%',
        detalhes: getDetalhesPorStatus(chamados.dados, 'em andamento')
      },
      finalizados: {
        total: chamados.finalizados,
        percentual: chamados.total > 0 ? ((chamados.finalizados / chamados.total) * 100).toFixed(1) + '%' : '0%',
        detalhes: getDetalhesPorStatus(chamados.dados, 'finalizado')
      }
    };

    // Análise por tipo de chamado
    const tipoAnalysis = getAnalisePorTipo(chamados.dados);
    
    // Análise por prioridade
    const prioridadeAnalysis = getAnalisePorPrioridade(chamados.dados);
    
    // Análise temporal
    const temporalAnalysis = getAnaliseTemporalChamados(chamados.dados, filtros.periodo);
    
    // Top 10 regiões/igrejas/municípios com mais chamados
    const rankingRegioes = getRankingPorRegiao(chamados.dados);
    const rankingIgrejas = getRankingPorIgreja(chamados.dados);
    const rankingMunicipios = getRankingPorMunicipio(chamados.dados);

    const analytics = {
      resumo: {
        totalChamados: chamados.total,
        taxaFinalizacao: chamados.total > 0 ? ((chamados.finalizados / chamados.total) * 100).toFixed(1) + '%' : '0%',
        tempoMedioResolucao: chamados.tempoMedioResolucao + ' dias',
        chamadosUrgentes: chamados.dados.filter(c => c.prioridade && c.prioridade.toLowerCase() === 'urgente').length
      },
      statusAnalysis,
      tipoAnalysis,
      prioridadeAnalysis,
      temporalAnalysis,
      rankings: {
        regioes: rankingRegioes,
        igrejas: rankingIgrejas,
        municipios: rankingMunicipios
      },
      filtrosAplicados: filtros,
      dataGeracao: new Date().toLocaleString('pt-BR')
    };

    return {
      success: true,
      analytics: analytics
    };
    
  } catch (error) {
    console.error('Erro ao obter analytics de chamados:', error);
    return { 
      success: false, 
      error: 'Erro ao obter analytics: ' + error.toString() 
    };
  }
}

/**
 * 🌍 ANALYTICS REGIONAIS AVANÇADOS
 */
function getRegionalAnalytics(data) {
  try {
    if (!data.userInfo) {
      return { 
        success: false, 
        error: 'Acesso negado. Login necessário.' 
      };
    }

    const filtros = {
      regiao: data.regiao || null,
      igreja: data.igreja || null,
      municipio: data.municipio || null
    };

    // Dados de todas as abas
    const chamados = getChamadosData(filtros);
    const usuarios = getUsuariosData(filtros);
    const profissionais = getProfissionaisData(filtros);
    const assessores = getAssessoresData(filtros);

    // Análise completa por região
    const regiaoCompleta = getAnaliseRegionalCompleta(chamados, usuarios, profissionais, assessores);
    
    // Mapa de cobertura
    const mapaCobertura = getMapaCobertura(chamados, usuarios, profissionais);
    
    // Comparativo entre regiões
    const comparativoRegioes = getComparativoRegioes(chamados, usuarios);
    
    // Análise de densidade
    const densidadeAnalysis = getAnaliseDesidade(chamados, usuarios, profissionais);

    const analytics = {
      resumoRegional: {
        totalRegioes: Object.keys(regiaoCompleta).length,
        regiaoMaisAtiva: getMaiorAtividade(regiaoCompleta),
        regiaoMelhorTaxa: getMelhorTaxaFinalizacao(regiaoCompleta),
        coberturaMunicipios: mapaCobertura.totalMunicipios,
        coberturaIgrejas: mapaCobertura.totalIgrejas
      },
      detalhePorRegiao: regiaoCompleta,
      mapaCobertura,
      comparativoRegioes,
      densidadeAnalysis,
      filtrosAplicados: filtros,
      dataGeracao: new Date().toLocaleString('pt-BR')
    };

    return {
      success: true,
      analytics: analytics
    };
    
  } catch (error) {
    console.error('Erro ao obter analytics regionais:', error);
    return { 
      success: false, 
      error: 'Erro ao obter analytics: ' + error.toString() 
    };
  }
}

/**
 * 📈 ANALYTICS DE PROGRESSO E METAS
 */
function getProgressAnalytics(data) {
  try {
    if (!data.userInfo) {
      return { 
        success: false, 
        error: 'Acesso negado. Login necessário.' 
      };
    }

    const filtros = {
      regiao: data.regiao || null,
      igreja: data.igreja || null,
      municipio: data.municipio || null,
      meta: data.meta || 80 // Meta padrão de 80% de finalização
    };

    const chamados = getChamadosData(filtros);
    
    // Progresso em direção às metas
    const progressoMetas = getProgressoMetas(chamados, filtros.meta);
    
    // Evolução temporal
    const evolucaoTemporal = getEvolucaoTemporal(chamados);
    
    // Previsões baseadas em tendências
    const previsoes = getPrevisoesTendencia(chamados);
    
    // Análise de performance
    const performanceAnalysis = getAnalisePerformance(chamados);
    
    // KPIs principais
    const kpis = getKPIsPrincipais(chamados, filtros.meta);

    const analytics = {
      resumoProgresso: {
        metaDefinida: filtros.meta + '%',
        progressoAtual: kpis.taxaFinalizacaoAtual,
        distanciaMeta: kpis.distanciaMeta,
        tendencia: kpis.tendencia,
        previsaoAlcanceMeta: previsoes.dataEstimadaMeta
      },
      progressoMetas,
      evolucaoTemporal,
      previsoes,
      performanceAnalysis,
      kpis,
      recomendacoes: getRecomendacoesProgresso(kpis, progressoMetas),
      filtrosAplicados: filtros,
      dataGeracao: new Date().toLocaleString('pt-BR')
    };

    return {
      success: true,
      analytics: analytics
    };
    
  } catch (error) {
    console.error('Erro ao obter analytics de progresso:', error);
    return { 
      success: false, 
      error: 'Erro ao obter analytics: ' + error.toString() 
    };
  }
}

// ============ FUNÇÕES AUXILIARES PARA ANALYTICS ============

function getDetalhesPorStatus(chamados, status) {
  const filtrados = chamados.filter(c => c.status && c.status.toLowerCase() === status.toLowerCase());
  const porRegiao = {};
  
  filtrados.forEach(chamado => {
    const regiao = chamado.regiao || 'Não Informado';
    if (!porRegiao[regiao]) porRegiao[regiao] = 0;
    porRegiao[regiao]++;
  });
  
  return {
    total: filtrados.length,
    porRegiao,
    maisAntigo: getMaisAntigo(filtrados),
    maisRecente: getMaisRecente(filtrados)
  };
}

function getAnalisePorTipo(chamados) {
  const tipos = {};
  
  chamados.forEach(chamado => {
    const tipo = chamado.tipo || chamado.categoria || 'Não Classificado';
    if (!tipos[tipo]) {
      tipos[tipo] = { total: 0, finalizados: 0 };
    }
    tipos[tipo].total++;
    if (chamado.status && chamado.status.toLowerCase() === 'finalizado') {
      tipos[tipo].finalizados++;
    }
  });
  
  // Calcular taxas
  Object.keys(tipos).forEach(tipo => {
    tipos[tipo].taxaFinalizacao = tipos[tipo].total > 0 ? 
      ((tipos[tipo].finalizados / tipos[tipo].total) * 100).toFixed(1) + '%' : '0%';
  });
  
  return tipos;
}

function getAnalisePorPrioridade(chamados) {
  const prioridades = { 'baixa': 0, 'media': 0, 'alta': 0, 'urgente': 0 };
  
  chamados.forEach(chamado => {
    const prioridade = (chamado.prioridade || 'media').toLowerCase();
    if (prioridades.hasOwnProperty(prioridade)) {
      prioridades[prioridade]++;
    } else {
      prioridades['media']++;
    }
  });
  
  return prioridades;
}

function getAnaliseTemporalChamados(chamados, periodo) {
  const hoje = new Date();
  let dataLimite;
  
  switch(periodo) {
    case 'ultimos30dias':
      dataLimite = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'ultimos90dias':
      dataLimite = new Date(hoje.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    default:
      dataLimite = new Date(2020, 0, 1); // Data muito antiga para incluir todos
  }
  
  const chamadosFiltrados = chamados.filter(c => {
    if (!c.data_criacao) return false;
    return new Date(c.data_criacao) >= dataLimite;
  });
  
  const porDia = {};
  chamadosFiltrados.forEach(chamado => {
    const data = new Date(chamado.data_criacao).toISOString().split('T')[0];
    if (!porDia[data]) {
      porDia[data] = { total: 0, finalizados: 0 };
    }
    porDia[data].total++;
    if (chamado.status && chamado.status.toLowerCase() === 'finalizado') {
      porDia[data].finalizados++;
    }
  });
  
  return {
    periodoAnalisado: periodo,
    totalNoPeriodo: chamadosFiltrados.length,
    distribuicaoDiaria: porDia,
    mediadiaria: (chamadosFiltrados.length / Object.keys(porDia).length).toFixed(1)
  };
}

function getRankingPorRegiao(chamados) {
  const regioes = {};
  
  chamados.forEach(chamado => {
    const regiao = chamado.regiao || 'Não Informado';
    if (!regioes[regiao]) {
      regioes[regiao] = { total: 0, finalizados: 0 };
    }
    regioes[regiao].total++;
    if (chamado.status && chamado.status.toLowerCase() === 'finalizado') {
      regioes[regiao].finalizados++;
    }
  });
  
  return Object.keys(regioes)
    .map(regiao => ({
      regiao,
      ...regioes[regiao],
      taxaFinalizacao: regioes[regiao].total > 0 ? 
        ((regioes[regiao].finalizados / regioes[regiao].total) * 100).toFixed(1) : '0'
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);
}

function getRankingPorIgreja(chamados) {
  const igrejas = {};
  
  chamados.forEach(chamado => {
    const igreja = chamado.igreja || 'Não Informado';
    if (!igrejas[igreja]) {
      igrejas[igreja] = { total: 0, finalizados: 0, regiao: chamado.regiao };
    }
    igrejas[igreja].total++;
    if (chamado.status && chamado.status.toLowerCase() === 'finalizado') {
      igrejas[igreja].finalizados++;
    }
  });
  
  return Object.keys(igrejas)
    .map(igreja => ({
      igreja,
      ...igrejas[igreja],
      taxaFinalizacao: igrejas[igreja].total > 0 ? 
        ((igrejas[igreja].finalizados / igrejas[igreja].total) * 100).toFixed(1) : '0'
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);
}

function getRankingPorMunicipio(chamados) {
  const municipios = {};
  
  chamados.forEach(chamado => {
    const municipio = chamado.municipio || 'Não Informado';
    if (!municipios[municipio]) {
      municipios[municipio] = { total: 0, finalizados: 0, regiao: chamado.regiao };
    }
    municipios[municipio].total++;
    if (chamado.status && chamado.status.toLowerCase() === 'finalizado') {
      municipios[municipio].finalizados++;
    }
  });
  
  return Object.keys(municipios)
    .map(municipio => ({
      municipio,
      ...municipios[municipio],
      taxaFinalizacao: municipios[municipio].total > 0 ? 
        ((municipios[municipio].finalizados / municipios[municipio].total) * 100).toFixed(1) : '0'
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);
}

function getMaisAntigo(chamados) {
  if (chamados.length === 0) return null;
  
  return chamados.reduce((mais_antigo, atual) => {
    const dataAtual = new Date(atual.data_criacao || '2099-12-31');
    const dataMaisAntigo = new Date(mais_antigo.data_criacao || '2099-12-31');
    return dataAtual < dataMaisAntigo ? atual : mais_antigo;
  });
}

function getMaisRecente(chamados) {
  if (chamados.length === 0) return null;
  
  return chamados.reduce((mais_recente, atual) => {
    const dataAtual = new Date(atual.data_criacao || '1900-01-01');
    const dataMaisRecente = new Date(mais_recente.data_criacao || '1900-01-01');
    return dataAtual > dataMaisRecente ? atual : mais_recente;
  });
}

function getAnaliseRegionalCompleta(chamados, usuarios, profissionais, assessores) {
  const regioes = {};
  
  // Processar chamados
  chamados.dados.forEach(chamado => {
    const regiao = chamado.regiao || 'Não Informado';
    if (!regioes[regiao]) {
      regioes[regiao] = {
        chamados: { total: 0, finalizados: 0, abertos: 0, andamento: 0 },
        usuarios: 0,
        profissionais: 0,
        assessores: 0,
        igrejas: new Set(),
        municipios: new Set()
      };
    }
    
    regioes[regiao].chamados.total++;
    if (chamado.status) {
      const status = chamado.status.toLowerCase();
      if (status === 'finalizado') regioes[regiao].chamados.finalizados++;
      else if (status === 'aberto') regioes[regiao].chamados.abertos++;
      else if (status === 'em andamento') regioes[regiao].chamados.andamento++;
    }
    
    if (chamado.igreja) regioes[regiao].igrejas.add(chamado.igreja);
    if (chamado.municipio) regioes[regiao].municipios.add(chamado.municipio);
  });
  
  // Processar usuários
  usuarios.dados.forEach(usuario => {
    const regiao = usuario.regiao || 'Não Informado';
    if (regioes[regiao]) {
      regioes[regiao].usuarios++;
    }
  });
  
  // Processar assessores
  assessores.dados.forEach(assessor => {
    const regiao = assessor.regiao || 'Não Informado';
    if (regioes[regiao]) {
      regioes[regiao].assessores++;
    }
  });
  
  // Finalizar análise
  Object.keys(regioes).forEach(regiao => {
    const dados = regioes[regiao];
    dados.chamados.taxaFinalizacao = dados.chamados.total > 0 ? 
      ((dados.chamados.finalizados / dados.chamados.total) * 100).toFixed(1) + '%' : '0%';
    dados.totalIgrejas = dados.igrejas.size;
    dados.totalMunicipios = dados.municipios.size;
    delete dados.igrejas;
    delete dados.municipios;
  });
  
  return regioes;
}

function getMapaCobertura(chamados, usuarios, profissionais) {
  const municipiosCobertura = new Set();
  const igrejasCobertura = new Set();
  const regioesCobertura = new Set();
  
  chamados.dados.forEach(chamado => {
    if (chamado.municipio) municipiosCobertura.add(chamado.municipio);
    if (chamado.igreja) igrejasCobertura.add(chamado.igreja);
    if (chamado.regiao) regioesCobertura.add(chamado.regiao);
  });
  
  usuarios.dados.forEach(usuario => {
    if (usuario.regiao) regioesCobertura.add(usuario.regiao);
  });
  
  return {
    totalMunicipios: municipiosCobertura.size,
    totalIgrejas: igrejasCobertura.size,
    totalRegioes: regioesCobertura.size,
    municipiosList: Array.from(municipiosCobertura),
    igrejasList: Array.from(igrejasCobertura),
    regioesList: Array.from(regioesCobertura)
  };
}

function getComparativoRegioes(chamados, usuarios) {
  const comparativo = {};
  
  chamados.dados.forEach(chamado => {
    const regiao = chamado.regiao || 'Não Informado';
    if (!comparativo[regiao]) {
      comparativo[regiao] = { chamados: 0, usuarios: 0 };
    }
    comparativo[regiao].chamados++;
  });
  
  usuarios.dados.forEach(usuario => {
    const regiao = usuario.regiao || 'Não Informado';
    if (comparativo[regiao]) {
      comparativo[regiao].usuarios++;
    }
  });
  
  // Calcular ratio chamados/usuários
  Object.keys(comparativo).forEach(regiao => {
    const dados = comparativo[regiao];
    dados.ratioChamadosUsuarios = dados.usuarios > 0 ? 
      (dados.chamados / dados.usuarios).toFixed(2) : 'N/A';
  });
  
  return comparativo;
}

function getAnaliseDesidade(chamados, usuarios, profissionais) {
  // Calcular densidade por região (simulado - em implementação real usaria dados geográficos)
  const densidade = {};
  
  Object.keys(getAnaliseRegional(chamados, usuarios, profissionais)).forEach(regiao => {
    densidade[regiao] = {
      chamadosPorKm2: 'Simulado', // Implementar com dados reais de área
      usuariosPorMil: 'Simulado', // Implementar com dados demográficos
      categoria: 'Média' // Baixa, Média, Alta
    };
  });
  
  return densidade;
}

function getMaiorAtividade(analiseRegional) {
  return Object.keys(analiseRegional).reduce((maior, atual) => {
    return analiseRegional[atual].totalChamados > (analiseRegional[maior]?.totalChamados || 0) ? atual : maior;
  }, Object.keys(analiseRegional)[0] || 'Nenhuma');
}

function getMelhorTaxaFinalizacao(analiseRegional) {
  return Object.keys(analiseRegional).reduce((melhor, atual) => {
    const taxaAtual = parseFloat(analiseRegional[atual].taxaFinalizacao?.replace('%', '') || '0');
    const taxaMelhor = parseFloat(analiseRegional[melhor]?.taxaFinalizacao?.replace('%', '') || '0');
    return taxaAtual > taxaMelhor ? atual : melhor;
  }, Object.keys(analiseRegional)[0] || 'Nenhuma');
}

function getProgressoMetas(chamados, meta) {
  const taxaAtual = chamados.total > 0 ? (chamados.finalizados / chamados.total) * 100 : 0;
  const distancia = meta - taxaAtual;
  
  return {
    metaDefinida: meta,
    taxaAtual: taxaAtual.toFixed(1),
    distanciaMeta: distancia.toFixed(1),
    statusMeta: distancia <= 0 ? 'Alcançada' : distancia <= 10 ? 'Próxima' : 'Distante',
    chamadosParaMeta: distancia > 0 ? Math.ceil((chamados.abertos + chamados.andamento) * (meta / 100)) : 0
  };
}

function getEvolucaoTemporal(chamados) {
  const evolucao = {};
  
  chamados.dados.forEach(chamado => {
    if (!chamado.data_criacao) return;
    
    const data = new Date(chamado.data_criacao);
    const mesAno = data.getFullYear() + '-' + String(data.getMonth() + 1).padStart(2, '0');
    
    if (!evolucao[mesAno]) {
      evolucao[mesAno] = { criados: 0, finalizados: 0 };
    }
    
    evolucao[mesAno].criados++;
    
    if (chamado.data_finalizacao) {
      const dataFim = new Date(chamado.data_finalizacao);
      const mesAnoFim = dataFim.getFullYear() + '-' + String(dataFim.getMonth() + 1).padStart(2, '0');
      
      if (!evolucao[mesAnoFim]) {
        evolucao[mesAnoFim] = { criados: 0, finalizados: 0 };
      }
      evolucao[mesAnoFim].finalizados++;
    }
  });
  
  return evolucao;
}

function getPrevisoesTendencia(chamados) {
  const evolucao = getEvolucaoTemporal(chamados);
  const meses = Object.keys(evolucao).sort();
  
  if (meses.length < 2) {
    return {
      tendencia: 'Dados insuficientes',
      previsaoProximoMes: 'Indisponível',
      dataEstimadaMeta: 'Indisponível'
    };
  }
  
  // Calcular tendência simples (média dos últimos 3 meses)
  const ultimosTres = meses.slice(-3);
  const mediaCriados = ultimosTres.reduce((sum, mes) => sum + evolucao[mes].criados, 0) / ultimosTres.length;
  const mediaFinalizados = ultimosTres.reduce((sum, mes) => sum + evolucao[mes].finalizados, 0) / ultimosTres.length;
  
  return {
    tendencia: mediaFinalizados > mediaCriados ? 'Melhoria' : 'Estável',
    previsaoProximoMes: Math.round(mediaCriados),
    dataEstimadaMeta: 'Calculando...' // Implementar lógica específica
  };
}

function getAnalisePerformance(chamados) {
  const hoje = new Date();
  const ultimoMes = new Date(hoje.getFullYear(), hoje.getMonth() - 1, hoje.getDate());
  
  const chamadosUltimoMes = chamados.dados.filter(c => 
    c.data_criacao && new Date(c.data_criacao) >= ultimoMes
  );
  
  const finalizadosUltimoMes = chamadosUltimoMes.filter(c => 
    c.status && c.status.toLowerCase() === 'finalizado'
  );
  
  return {
    chamadosUltimoMes: chamadosUltimoMes.length,
    finalizadosUltimoMes: finalizadosUltimoMes.length,
    taxaUltimoMes: chamadosUltimoMes.length > 0 ? 
      ((finalizadosUltimoMes.length / chamadosUltimoMes.length) * 100).toFixed(1) + '%' : '0%',
    crescimentoMensal: 'Calculando...' // Implementar comparação com mês anterior
  };
}

function getKPIsPrincipais(chamados, meta) {
  const taxaFinalizacaoAtual = chamados.total > 0 ? (chamados.finalizados / chamados.total) * 100 : 0;
  const distanciaMeta = meta - taxaFinalizacaoAtual;
  
  return {
    taxaFinalizacaoAtual: taxaFinalizacaoAtual.toFixed(1) + '%',
    distanciaMeta: distanciaMeta.toFixed(1) + '%',
    tendencia: calcularTendencia(getEvolucaoTemporal(chamados)),
    urgentesAbertos: chamados.dados.filter(c => 
      c.prioridade && c.prioridade.toLowerCase() === 'urgente' && 
      c.status && c.status.toLowerCase() !== 'finalizado'
    ).length
  };
}

function getRecomendacoesProgresso(kpis, progressoMetas) {
  const recomendacoes = [];
  
  if (parseFloat(progressoMetas.distanciaMeta) > 20) {
    recomendacoes.push('Meta distante: Concentrar esforços nos chamados em andamento');
  }
  
  if (kpis.urgentesAbertos > 0) {
    recomendacoes.push(`${kpis.urgentesAbertos} chamados urgentes precisam de atenção imediata`);
  }
  
  if (kpis.tendencia === 'Atenção Necessária') {
    recomendacoes.push('Tendência negativa detectada: Revisar processos de atendimento');
  }
  
  if (recomendacoes.length === 0) {
    recomendacoes.push('Desempenho satisfatório. Manter o ritmo atual.');
  }
  
  return recomendacoes;
}

/**
 * �📤 CRIAR RESPOSTA PADRONIZADA
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
 * ��� GERAR RELATÓRIO GERAL
 */
function gerarRelatorioGeral() {
  try {
    const chamados = getChamadosData();
    const voluntarios = getVoluntariosData();
    const analytics = getDashboardAnalytics();
    
    const relatorio = {
      tipo: 'geral',
      dataGeracao: new Date().toISOString(),
      resumoExecutivo: {
        totalChamados: chamados.length,
        totalVoluntarios: voluntarios.length,
        chamadosAtivos: chamados.filter(c => c.status === 'Em Andamento').length,
        taxaResolucao: analytics.taxaResolucao,
        mediaTempoResposta: analytics.mediaTempoResposta
      },
      analiseDetalhada: {
        chamadosPorStatus: analytics.chamadosPorStatus,
        chamadosPorCategoria: analytics.chamadosPorCategoria,
        voluntariosPorTipo: analytics.voluntariosPorTipo,
        evolucaoMensal: analytics.evolucaoMensal
      },
      indicadoresChave: {
        performanceGeral: analytics.performanceScore,
        eficienciaOperacional: analytics.eficienciaScore,
        satisfacaoUsuarios: analytics.satisfacaoScore
      },
      recomendacoes: gerarRecomendacoesRelatorios(analytics),
      metadados: {
        totalRegistros: chamados.length + voluntarios.length,
        ultimaAtualizacao: new Date().toISOString(),
        versaoRelatorio: '1.0'
      }
    };
    
    return createResponse({ relatorio });
    
  } catch (error) {
    console.error('Erro ao gerar relatório geral:', error);
    return createResponse({ error: error.message }, false);
  }
}

/**
 * ��� GERAR RELATÓRIO POR REGIÃO
 */
function gerarRelatorioPorRegiao(data) {
  try {
    const regiao = data.regiao || data;
    if (!regiao) {
      throw new Error('Região não informada');
    }
    
    const chamados = getChamadosData().filter(c => c.regiao === regiao);
    const voluntarios = getVoluntariosData().filter(v => v.regiao === regiao);
    const analyticsRegional = getRegionalAnalytics();
    const dadosRegiao = analyticsRegional.regioes.find(r => r.nome === regiao);
    
    if (!dadosRegiao) {
      throw new Error(`Região '${regiao}' não encontrada`);
    }
    
    const relatorio = {
      tipo: 'regional',
      regiao: regiao,
      dataGeracao: new Date().toISOString(),
      resumoRegional: {
        totalChamados: chamados.length,
        totalVoluntarios: voluntarios.length,
        chamadosAtivos: chamados.filter(c => c.status === 'Em Andamento').length,
        igrejas: dadosRegiao.igrejas,
        performanceRegional: dadosRegiao.performance
      },
      analiseComparativa: {
        rankingNacional: dadosRegiao.ranking,
        percentualDoTotal: ((chamados.length / getChamadosData().length) * 100).toFixed(2),
        crescimentoMensal: dadosRegiao.crescimento
      },
      detalhamento: {
        chamadosPorCategoria: gerarEstatisticasPorCategoria(chamados),
        voluntariosPorTipo: gerarEstatisticasPorTipo(voluntarios),
        tempoMedioResposta: calcularTempoMedioResposta(chamados),
        taxaSucesso: calcularTaxaSucesso(chamados)
      },
      igrejasDetalhadas: gerarDetalhamentoIgrejas(regiao),
      recomendacoesEspecificas: gerarRecomendacoesRegionais(dadosRegiao),
      metadados: {
        totalRegistrosRegiao: chamados.length + voluntarios.length,
        ultimaAtualizacao: new Date().toISOString(),
        versaoRelatorio: '1.0'
      }
    };
    
    return createResponse({ relatorio });
    
  } catch (error) {
    console.error('Erro ao gerar relatório regional:', error);
    return createResponse({ error: error.message }, false);
  }
}

/**
 * ⛪ GERAR RELATÓRIO POR IGREJA
 */
function gerarRelatorioPorIgreja(data) {
  try {
    const igreja = data.igreja || data;
    if (!igreja) {
      throw new Error('Igreja não informada');
    }
    
    const chamados = getChamadosData().filter(c => c.igreja === igreja);
    const voluntarios = getVoluntariosData().filter(v => v.igreja === igreja);
    
    if (chamados.length === 0 && voluntarios.length === 0) {
      throw new Error(`Igreja '${igreja}' não encontrada ou sem dados`);
    }
    
    const relatorio = {
      tipo: 'igreja',
      igreja: igreja,
      dataGeracao: new Date().toISOString(),
      resumoIgreja: {
        totalChamados: chamados.length,
        totalVoluntarios: voluntarios.length,
        chamadosAtivos: chamados.filter(c => c.status === 'Em Andamento').length,
        regiao: chamados.length > 0 ? chamados[0].regiao : voluntarios[0].regiao
      },
      performanceIgreja: {
        tempoMedioResposta: calcularTempoMedioResposta(chamados),
        taxaResolucao: calcularTaxaSucesso(chamados),
        voluntariosAtivos: voluntarios.filter(v => v.status === 'Ativo').length,
        satisfacaoMedia: calcularSatisfacaoMedia(chamados)
      },
      analiseDetalhada: {
        chamadosPorCategoria: gerarEstatisticasPorCategoria(chamados),
        chamadosPorMes: gerarEstatisticasMensais(chamados),
        voluntariosPorTipo: gerarEstatisticasPorTipo(voluntarios),
        tendencias: analisarTendencias(chamados)
      },
      comparativoRegional: {
        posicaoNaRegiao: calcularPosicaoNaRegiao(igreja, chamados[0]?.regiao),
        mediaRegional: obterMediaRegional(chamados[0]?.regiao),
        pontosFortes: identificarPontosFortes(chamados, voluntarios),
        areasDesenvolvimento: identificarAreasDesenvolvimento(chamados, voluntarios)
      },
      planosAcao: gerarPlanosAcao(chamados, voluntarios),
      metadados: {
        totalRegistrosIgreja: chamados.length + voluntarios.length,
        ultimaAtualizacao: new Date().toISOString(),
        versaoRelatorio: '1.0'
      }
    };
    
    return createResponse({ relatorio });
    
  } catch (error) {
    console.error('Erro ao gerar relatório da igreja:', error);
    return createResponse({ error: error.message }, false);
  }
}

/**
 * ��� FUNÇÕES AUXILIARES PARA RELATÓRIOS
 */

function gerarRecomendacoesRelatorios(analytics) {
  const recomendacoes = [];
  
  if (analytics.taxaResolucao < 70) {
    recomendacoes.push({
      tipo: 'crítico',
      area: 'Resolução',
      descricao: 'Taxa de resolução abaixo do esperado',
      acao: 'Implementar treinamento para voluntários e revisão de processos'
    });
  }
  
  if (analytics.mediaTempoResposta > 24) {
    recomendacoes.push({
      tipo: 'importante',
      area: 'Tempo de Resposta',
      descricao: 'Tempo médio de resposta acima de 24 horas',
      acao: 'Estabelecer sistema de notificações automáticas'
    });
  }
  
  return recomendacoes;
}

function gerarEstatisticasPorCategoria(chamados) {
  const categorias = {};
  chamados.forEach(chamado => {
    if (!categorias[chamado.categoria]) {
      categorias[chamado.categoria] = 0;
    }
    categorias[chamado.categoria]++;
  });
  return categorias;
}

function gerarEstatisticasPorTipo(voluntarios) {
  const tipos = {};
  voluntarios.forEach(voluntario => {
    if (!tipos[voluntario.tipo]) {
      tipos[voluntario.tipo] = 0;
    }
    tipos[voluntario.tipo]++;
  });
  return tipos;
}

function calcularTempoMedioResposta(chamados) {
  const chamadosComResposta = chamados.filter(c => c.dataResposta);
  if (chamadosComResposta.length === 0) return 0;
  
  const somaTempos = chamadosComResposta.reduce((soma, chamado) => {
    const tempo = new Date(chamado.dataResposta) - new Date(chamado.data);
    return soma + (tempo / (1000 * 60 * 60)); // em horas
  }, 0);
  
  return (somaTempos / chamadosComResposta.length).toFixed(2);
}

function calcularTaxaSucesso(chamados) {
  if (chamados.length === 0) return 0;
  const resolvidos = chamados.filter(c => c.status === 'Resolvido').length;
  return ((resolvidos / chamados.length) * 100).toFixed(2);
}

function calcularSatisfacaoMedia(chamados) {
  const chamadosComAvaliacao = chamados.filter(c => c.satisfacao);
  if (chamadosComAvaliacao.length === 0) return 0;
  
  const soma = chamadosComAvaliacao.reduce((total, chamado) => total + chamado.satisfacao, 0);
  return (soma / chamadosComAvaliacao.length).toFixed(2);
}

function gerarEstatisticasMensais(chamados) {
  const meses = {};
  chamados.forEach(chamado => {
    const mes = new Date(chamado.data).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    if (!meses[mes]) {
      meses[mes] = 0;
    }
    meses[mes]++;
  });
  return meses;
}

function analisarTendencias(chamados) {
  const ultimos6Meses = chamados.filter(c => {
    const dataChamado = new Date(c.data);
    const seiseMesesAtras = new Date();
    seiseMesesAtras.setMonth(seiseMesesAtras.getMonth() - 6);
    return dataChamado >= seiseMesesAtras;
  });
  
  return {
    tendenciaGeral: ultimos6Meses.length > chamados.length / 2 ? 'crescente' : 'decrescente',
    volumeRecente: ultimos6Meses.length,
    variacao: ((ultimos6Meses.length / chamados.length) * 100).toFixed(2) + '%'
  };
}

function calcularPosicaoNaRegiao(igreja, regiao) {
  // Implementação simplificada - retorna posição mockada
  return Math.floor(Math.random() * 10) + 1;
}

function obterMediaRegional(regiao) {
  // Implementação simplificada - retorna dados mockados
  return {
    chamadosPorIgreja: 25,
    voluntariosPorIgreja: 15,
    taxaResolucao: 75
  };
}

function identificarPontosFortes(chamados, voluntarios) {
  const pontos = [];
  
  if (voluntarios.length > 10) {
    pontos.push('Grande número de voluntários ativos');
  }
  
  if (calcularTaxaSucesso(chamados) > 80) {
    pontos.push('Excelente taxa de resolução');
  }
  
  return pontos;
}

function identificarAreasDesenvolvimento(chamados, voluntarios) {
  const areas = [];
  
  if (voluntarios.length < 5) {
    areas.push('Necessita aumentar número de voluntários');
  }
  
  if (calcularTaxaSucesso(chamados) < 60) {
    areas.push('Melhorar taxa de resolução de chamados');
  }
  
  return areas;
}

function gerarPlanosAcao(chamados, voluntarios) {
  const planos = [];
  
  if (voluntarios.length < 10) {
    planos.push({
      acao: 'Recrutamento de Voluntários',
      prazo: '30 dias',
      responsavel: 'Coordenador Local',
      meta: 'Aumentar em 50% o número de voluntários'
    });
  }
  
  if (calcularTaxaSucesso(chamados) < 70) {
    planos.push({
      acao: 'Treinamento de Capacitação',
      prazo: '45 dias',
      responsavel: 'Equipe Regional',
      meta: 'Elevar taxa de resolução para acima de 80%'
    });
  }
  
  return planos;
}

function gerarDetalhamentoIgrejas(regiao) {
  // Implementação simplificada - retorna dados mockados por região
  const igrejas = [
    { nome: 'Igreja Central', chamados: 45, voluntarios: 12, performance: 85 },
    { nome: 'Igreja Norte', chamados: 32, voluntarios: 8, performance: 78 },
    { nome: 'Igreja Sul', chamados: 28, voluntarios: 10, performance: 82 }
  ];
  
  return igrejas;
}

function gerarRecomendacoesRegionais(dadosRegiao) {
  const recomendacoes = [];
  
  if (dadosRegiao.performance < 75) {
    recomendacoes.push({
      tipo: 'melhoria',
      area: 'Performance Regional',
      acao: 'Implementar programa de mentoria entre igrejas'
    });
  }
  
  return recomendacoes;
}

/**
 * 📁 ACESSAR MÍDIAS ARIMATEIA DO GOOGLE DRIVE
 */

// ID da pasta do Google Drive (extraído da URL fornecida)
const MIDIAS_FOLDER_ID = '1sD7TkMAgc9GdIOTy_yopMXPeYnupqt2P';

/**
 * 📂 Buscar arquivos da pasta MidiasArimateia
 */
function getMidiasArimateia(data = {}) {
  try {
    const folder = DriveApp.getFolderById(MIDIAS_FOLDER_ID);
    const files = [];
    const folders = [];
    
    // Buscar subpastas
    const subfolders = folder.getFolders();
    while (subfolders.hasNext()) {
      const subfolder = subfolders.next();
      folders.push({
        id: subfolder.getId(),
        name: subfolder.getName(),
        type: 'folder',
        dateCreated: subfolder.getDateCreated(),
        lastUpdated: subfolder.getLastUpdated(),
        size: getFolderSize(subfolder),
        itemCount: getFolderItemCount(subfolder)
      });
    }
    
    // Buscar arquivos na pasta principal
    const fileIterator = folder.getFiles();
    while (fileIterator.hasNext()) {
      const file = fileIterator.next();
      const mimeType = file.getBlob().getContentType();
      
      files.push({
        id: file.getId(),
        name: file.getName(),
        type: 'file',
        mimeType: mimeType,
        fileType: getFileType(mimeType),
        size: file.getSize(),
        dateCreated: file.getDateCreated(),
        lastUpdated: file.getLastUpdated(),
        downloadUrl: file.getDownloadUrl(),
        thumbnailUrl: getThumbnailUrl(file),
        isImage: mimeType.startsWith('image/'),
        isVideo: mimeType.startsWith('video/'),
        isPDF: mimeType === 'application/pdf'
      });
    }
    
    return {
      success: true,
      folder: {
        id: folder.getId(),
        name: folder.getName(),
        totalFiles: files.length,
        totalFolders: folders.length
      },
      files: files,
      folders: folders,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Erro ao buscar mídias:', error);
    return {
      success: false,
      error: `Erro ao acessar pasta de mídias: ${error.message}`
    };
  }
}

/**
 * 📂 Buscar arquivos de uma subpasta específica
 */
function getMidiasSubfolder(folderId) {
  try {
    const folder = DriveApp.getFolderById(folderId);
    const files = [];
    
    const fileIterator = folder.getFiles();
    while (fileIterator.hasNext()) {
      const file = fileIterator.next();
      const mimeType = file.getBlob().getContentType();
      
      files.push({
        id: file.getId(),
        name: file.getName(),
        type: 'file',
        mimeType: mimeType,
        fileType: getFileType(mimeType),
        size: file.getSize(),
        dateCreated: file.getDateCreated(),
        lastUpdated: file.getLastUpdated(),
        downloadUrl: file.getDownloadUrl(),
        thumbnailUrl: getThumbnailUrl(file),
        isImage: mimeType.startsWith('image/'),
        isVideo: mimeType.startsWith('video/'),
        isPDF: mimeType === 'application/pdf'
      });
    }
    
    return {
      success: true,
      folder: {
        id: folder.getId(),
        name: folder.getName(),
        totalFiles: files.length
      },
      files: files,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Erro ao buscar subpasta:', error);
    return {
      success: false,
      error: `Erro ao acessar subpasta: ${error.message}`
    };
  }
}

/**
 * 💾 Gerar link de download para um arquivo
 */
function downloadMidia(data) {
  try {
    const fileId = data.fileId;
    if (!fileId) {
      throw new Error('ID do arquivo não fornecido');
    }
    
    const file = DriveApp.getFileById(fileId);
    
    return {
      success: true,
      file: {
        id: file.getId(),
        name: file.getName(),
        size: file.getSize(),
        mimeType: file.getBlob().getContentType(),
        downloadUrl: file.getDownloadUrl(),
        directLink: `https://drive.google.com/uc?export=download&id=${fileId}`
      }
    };
    
  } catch (error) {
    console.error('Erro ao preparar download:', error);
    return {
      success: false,
      error: `Erro ao preparar download: ${error.message}`
    };
  }
}

/**
 * 👁️ Gerar preview de um arquivo
 */
function getMidiaPreview(data) {
  try {
    const fileId = data.fileId;
    if (!fileId) {
      throw new Error('ID do arquivo não fornecido');
    }
    
    const file = DriveApp.getFileById(fileId);
    const mimeType = file.getBlob().getContentType();
    
    return {
      success: true,
      preview: {
        id: file.getId(),
        name: file.getName(),
        mimeType: mimeType,
        size: file.getSize(),
        isImage: mimeType.startsWith('image/'),
        isVideo: mimeType.startsWith('video/'),
        isPDF: mimeType === 'application/pdf',
        viewUrl: `https://drive.google.com/file/d/${fileId}/view`,
        embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
        thumbnailUrl: getThumbnailUrl(file)
      }
    };
    
  } catch (error) {
    console.error('Erro ao gerar preview:', error);
    return {
      success: false,
      error: `Erro ao gerar preview: ${error.message}`
    };
  }
}

/**
 * 🎯 FUNÇÕES AUXILIARES PARA GOOGLE DRIVE
 */

function getFileType(mimeType) {
  if (mimeType.startsWith('image/')) return 'Imagem';
  if (mimeType.startsWith('video/')) return 'Vídeo';
  if (mimeType === 'application/pdf') return 'PDF';
  if (mimeType.startsWith('audio/')) return 'Áudio';
  if (mimeType.includes('document')) return 'Documento';
  if (mimeType.includes('spreadsheet')) return 'Planilha';
  if (mimeType.includes('presentation')) return 'Apresentação';
  return 'Arquivo';
}

function getThumbnailUrl(file) {
  try {
    const fileId = file.getId();
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w200-h200`;
  } catch (error) {
    return null;
  }
}

function getFolderSize(folder) {
  try {
    let totalSize = 0;
    const files = folder.getFiles();
    while (files.hasNext()) {
      totalSize += files.next().getSize();
    }
    return totalSize;
  } catch (error) {
    return 0;
  }
}

/**
 * 🏛️ BUSCAR IGREJAS E REGIÕES
 */
function getIgrejasRegioes() {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEETS.IGREJAS_REGIOES);
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return {
        regioes: [],
        igrejasPorRegiao: {},
        message: 'Nenhuma igreja cadastrada'
      };
    }

    // Obter cabeçalhos
    const headers = data[0];
    const nomeIgrejaIndex = headers.indexOf('NOME_IGREJA');
    const regiaoIndex = headers.indexOf('REGIAO');
    const statusIndex = headers.indexOf('STATUS');

    if (nomeIgrejaIndex === -1 || regiaoIndex === -1) {
      throw new Error('Colunas NOME_IGREJA ou REGIAO não encontradas');
    }

    const igrejasPorRegiao = {};
    const regioesSet = new Set();

    // Processar dados (pular cabeçalho)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const nomeIgreja = row[nomeIgrejaIndex];
      const regiao = row[regiaoIndex];
      const status = statusIndex !== -1 ? row[statusIndex] : 'Ativa';

      // Pular linhas vazias ou igrejas inativas
      if (!nomeIgreja || !regiao || status === 'Inativa') {
        continue;
      }

      regioesSet.add(regiao);

      if (!igrejasPorRegiao[regiao]) {
        igrejasPorRegiao[regiao] = [];
      }

      igrejasPorRegiao[regiao].push({
        nome: nomeIgreja,
        status: status || 'Ativa'
      });
    }

    // Ordenar regiões e igrejas
    const regioes = Array.from(regioesSet).sort();
    
    // Ordenar igrejas dentro de cada região
    Object.keys(igrejasPorRegiao).forEach(regiao => {
      igrejasPorRegiao[regiao].sort((a, b) => a.nome.localeCompare(b.nome));
    });

    return {
      regioes: regioes,
      igrejasPorRegiao: igrejasPorRegiao,
      total: {
        regioes: regioes.length,
        igrejas: Object.values(igrejasPorRegiao).reduce((total, igrejas) => total + igrejas.length, 0)
      }
    };

  } catch (error) {
    console.error('Erro ao buscar igrejas e regiões:', error);
    return {
      error: 'Erro ao carregar igrejas e regiões: ' + error.message,
      regioes: [],
      igrejasPorRegiao: {}
    };
  }
}

function getFolderItemCount(folder) {
  try {
    let count = 0;
    const files = folder.getFiles();
    while (files.hasNext()) {
      files.next();
      count++;
    }
    return count;
  } catch (error) {
    return 0;
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
