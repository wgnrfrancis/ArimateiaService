


function login(email, senha) {
  const planilha = SpreadsheetApp.openById(CONFIG.ID_PLANILHA);
  const aba = planilha.getSheetByName(CONFIG.ABA_USUARIOS);
  const dados = aba.getDataRange().getValues();

  for (let i = 1; i < dados.length; i++) {
    const [id, nome, emailUsuario, senhaUsuario, whatsapp, regiao, igreja, funcao, status, ativo] = dados[i];

    if (emailUsuario === email) {
      if (senhaUsuario !== senha) {
        return { sucesso: false, mensagem: "Senha incorreta." };
      }

      if (status === "Bloqueado" || ativo !== "Sim") {
        return { sucesso: false, mensagem: "Acesso bloqueado ou usuário inativo." };
      }

      // Atualiza data/hora do último acesso (coluna 11)
      aba.getRange(i + 1, 11).setValue(new Date());

      return {
        sucesso: true,
        mensagem: "Login realizado com sucesso.",
        funcao: funcao,
        regiao: regiao,
        email: emailUsuario,
        nome: nome,
        token: Utilities.base64Encode(emailUsuario + ":" + new Date().getTime())
      };
    }
  }

  return { sucesso: false, mensagem: "Usuário não encontrado." };
}


// --- chamados.gs.txt ---
//chamados.gs

function salvarChamado(data) {
  const planilha = SpreadsheetApp.openById(CONFIG.ID_PLANILHA);
  const aba = planilha.getSheetByName(CONFIG.ABA_ATENDIMENTOS);

  const user = getUsuarioLogado();
  const dataAtual = new Date();

  const novoRegistro = [
    gerarIdUnico(),
    data.nome || "",
    data.telefone || "",
    data.whatsapp || "",
    data.email || "",
    data.igreja || "",
    data.regiao || "",
    data.descricao || "",
    Utilities.formatDate(dataAtual, Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss"),
    user.email || "",
    user.nome || "",
    user.regiao || "",
    "Aberto",
    ""
  ];

  aba.appendRow(novoRegistro);
}



// --- config.gs.txt ---
//config.gs

const CONFIG = {
  ID_PLANILHA: "1M3N_Ka5tDpt8XEkGhoV33kYUTppHPymd5C_4UnbQXqM", 
  URL_PLANILHA: "https://docs.google.com/spreadsheets/d/1M3N_Ka5tDpt8XEkGhoV33kYUTppHPymd5C_4UnbQXqM/edit",
  ABA_USUARIOS: "UsuariosAutorizados",
  ABA_CHAMADOS: "Chamados",
  ABA_CHAMADOS_EXCLUIDOS: "Chamados_Excluidos",
  ABA_LOGS_ACESSO: "LogsAcesso",
  ABA_ATENDIMENTOS: "Atendimentos",
  ABA_LOGS: "Logs",
  SENHA_PADRAO: "Arimateia1"
};

// --- coordenador.gs.txt ---
//coordenador.gs

function listarUsuarios() {
  const aba = SpreadsheetApp.openById(CONFIG.ID_PLANILHA).getSheetByName(CONFIG.ABA_USUARIOS);
  const dados = aba.getDataRange().getValues().slice(1);

  return dados.map(l => ({
    nome: l[1],
    email: l[2],
    funcao: l[7],
    status: l[8],
    regiao: l[5]
  }));
}

function atualizarUsuario(email, novaFuncao, novoStatus) {
  const aba = SpreadsheetApp.openById(CONFIG.ID_PLANILHA).getSheetByName(CONFIG.ABA_USUARIOS);
  const dados = aba.getDataRange().getValues();

  for (let i = 1; i < dados.length; i++) {
    if (dados[i][2] === email) {
      aba.getRange(i + 1, 8).setValue(novaFuncao); // Cargo (Função)
      aba.getRange(i + 1, 9).setValue(novoStatus); // Status
      registrarLog(email, "Atualização", `Função: ${novaFuncao}, Status: ${novoStatus}`);
      return;
    }
  }

  throw new Error("Usuário não encontrado.");
}

function excluirUsuario(email) {
  const aba = SpreadsheetApp.openById(CONFIG.ID_PLANILHA).getSheetByName(CONFIG.ABA_USUARIOS);
  const dados = aba.getDataRange().getValues();

  for (let i = 1; i < dados.length; i++) {
    if (dados[i][2] === email) {
      aba.deleteRow(i + 1);
      registrarLog(email, "Exclusão", "Usuário excluído");
      return;
    }
  }

  throw new Error("Usuário não encontrado.");
}


// --- secretaria.gs.txt ---
//secretaria.gs

function listarChamadosPorRegiao(statusFiltro) {
  const aba = SpreadsheetApp.openById(CONFIG.ID_PLANILHA).getSheetByName(CONFIG.ABA_ATENDIMENTOS);
  const dados = aba.getDataRange().getValues();
  const usuario = getUsuarioLogado();

  const cabecalho = dados[0];
  const linhas = dados.slice(1);

  return linhas
    .filter(l => l[11] === usuario.regiao)
    .filter(l => statusFiltro === "Todos" || l[12] === statusFiltro)
    .map(l => ({
      id: l[0],
      nome: l[1],
      telefone: l[2],
      descricao: l[7],
      status: l[12],
      observacao: l[13] || ""
    }));
}

function atualizarChamado(id, novoStatus, novaObs) {
  const aba = SpreadsheetApp.openById(CONFIG.ID_PLANILHA).getSheetByName(CONFIG.ABA_ATENDIMENTOS);
  const dados = aba.getDataRange().getValues();

  for (let i = 1; i < dados.length; i++) {
    if (dados[i][0] === id) {
      aba.getRange(i + 1, 13).setValue(novoStatus); // Status
      aba.getRange(i + 1, 14).setValue(novaObs);    // Observação
      return;
    }
  }

  throw new Error("Chamado não encontrado.");
}


// --- user.gs.txt ---
//user.gs

function getUserData(email) {
  const aba = SpreadsheetApp.openById(CONFIG.ID_PLANILHA).getSheetByName(CONFIG.ABA_USUARIOS);
  const dados = aba.getDataRange().getValues();
  const cabecalho = dados[0];

  const emailIdx = cabecalho.indexOf("Email");
  const nomeIdx = cabecalho.indexOf("Nome");
  const funcaoIdx = cabecalho.indexOf("Cargo (Função)");
  const statusIdx = cabecalho.indexOf("Status");
  const ativoIdx = cabecalho.indexOf("Ativo");

  for (let i = 1; i < dados.length; i++) {
    if (dados[i][emailIdx] === email) {
      if (dados[i][ativoIdx] !== "Sim" || dados[i][statusIdx] !== "Aprovado") {
        return null;
      }
      return {
        nome: dados[i][nomeIdx],
        cargo: dados[i][funcaoIdx]
      };
    }
  }
  return null;
}

function doPost(e) {
  try {
    // Log para debug
    console.log("doPost chamado");
    console.log("Dados recebidos:", e.postData);
    
    if (!e.postData || !e.postData.contents) {
      console.log("Erro: Nenhum dado POST recebido");
      return ContentService.createTextOutput(
        JSON.stringify({ sucesso: false, mensagem: "Nenhum dado recebido" })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    const dados = JSON.parse(e.postData.contents);
    console.log("Dados parseados:", dados);

    // Cadastro
    if (dados.acao === "cadastro") {
      console.log("Processando cadastro para:", dados.email);
      const resultado = salvarUsuario(dados);
      console.log("Resultado do cadastro:", resultado);
      return ContentService.createTextOutput(
        JSON.stringify(resultado)
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Cadastro alternativo com openByUrl
    if (dados.acao === "cadastro_url") {
      console.log("Processando cadastro (openByUrl) para:", dados.email);
      const resultado = salvarUsuarioByUrl(dados);
      console.log("Resultado do cadastro (openByUrl):", resultado);
      return ContentService.createTextOutput(
        JSON.stringify(resultado)
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // Login
    if (dados.email && dados.senha) {
      console.log("Processando login para:", dados.email);
      const resultado = login(dados.email, dados.senha);
      console.log("Resultado do login:", resultado);
      return ContentService.createTextOutput(
        JSON.stringify(resultado)
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // Outros endpoints...
    console.log("Ação inválida recebida:", dados);
    return ContentService.createTextOutput(
      JSON.stringify({ sucesso: false, mensagem: "Ação inválida." })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    console.error("Erro no doPost:", err);
    return ContentService.createTextOutput(
      JSON.stringify({ sucesso: false, mensagem: "Erro interno: " + err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Função para salvar usuário (cadastro) - Versão com openById
function salvarUsuario(dados) {
  try {
    console.log("Iniciando salvarUsuario com dados:", dados);
    
    const planilha = SpreadsheetApp.openById(CONFIG.ID_PLANILHA);
    console.log("Planilha aberta com sucesso (openById)");
    
    const aba = planilha.getSheetByName(CONFIG.ABA_USUARIOS);
    console.log("Aba encontrada:", CONFIG.ABA_USUARIOS);
    
    const linhas = aba.getDataRange().getValues();
    console.log("Dados carregados, total de linhas:", linhas.length);

    // Verifica se já existe
    for (let i = 1; i < linhas.length; i++) {
      if (linhas[i][2] === dados.email) {
        console.log("Email já existe:", dados.email);
        return { sucesso: false, mensagem: "E-mail já cadastrado." };
      }
    }

    // Adiciona novo usuário
    const novoId = gerarIdUnico();
    console.log("Gerando novo ID:", novoId);
    
    aba.appendRow([
      novoId,
      dados.nome,
      dados.email,
      CONFIG.SENHA_PADRAO,
      dados.whatsapp,
      dados.regiao,
      dados.igreja,
      "Cidadao", // Função padrão
      "Aguardando", // Status padrão
      "Sim", // Ativo
      new Date() // Data cadastro
    ]);
    
    console.log("Usuário salvo com sucesso!");
    return { sucesso: true, mensagem: "Usuário cadastrado com sucesso!" };
    
  } catch (error) {
    console.error("Erro em salvarUsuario:", error);
    return { sucesso: false, mensagem: "Erro ao salvar: " + error.toString() };
  }
}

// Função alternativa usando openByUrl (como no código que funciona)
function salvarUsuarioByUrl(dados) {
  try {
    console.log("Iniciando salvarUsuarioByUrl com dados:", dados);
    
    const planilha = SpreadsheetApp.openByUrl(CONFIG.URL_PLANILHA);
    console.log("Planilha aberta com sucesso (openByUrl)");
    
    const aba = planilha.getSheetByName(CONFIG.ABA_USUARIOS);
    console.log("Aba encontrada:", CONFIG.ABA_USUARIOS);
    
    const linhas = aba.getDataRange().getValues();
    console.log("Dados carregados, total de linhas:", linhas.length);

    // Verifica se já existe
    for (let i = 1; i < linhas.length; i++) {
      if (linhas[i][2] === dados.email) {
        console.log("Email já existe:", dados.email);
        return { sucesso: false, mensagem: "E-mail já cadastrado." };
      }
    }

    // Adiciona novo usuário
    const novoId = gerarIdUnico();
    console.log("Gerando novo ID:", novoId);
    
    aba.appendRow([
      novoId,
      dados.nome,
      dados.email,
      CONFIG.SENHA_PADRAO,
      dados.whatsapp,
      dados.regiao,
      dados.igreja,
      "Cidadao", // Função padrão
      "Aguardando", // Status padrão
      "Sim", // Ativo
      new Date() // Data cadastro
    ]);
    
    console.log("Usuário salvo com sucesso (openByUrl)!");
    return { sucesso: true, mensagem: "Usuário cadastrado com sucesso!" };
    
  } catch (error) {
    console.error("Erro em salvarUsuarioByUrl:", error);
    return { sucesso: false, mensagem: "Erro ao salvar: " + error.toString() };
  }
}

// Função para gerar ID único
function gerarIdUnico() {
  return "USR-" + Math.random().toString(36).substr(2, 9) + "-" + new Date().getTime();
}

function doGet(e) {
  console.log("doGet chamado com parâmetros:", e.parameter);
  
  // Endpoint de teste simples
  if (!e.parameter || !e.parameter.acao) {
    return ContentService.createTextOutput(
      JSON.stringify({ 
        sucesso: true, 
        mensagem: "API Arimateia funcionando!", 
        timestamp: new Date().toISOString(),
        versao: "1.0"
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
  
  if (e.parameter.acao === "test") {
    return ContentService.createTextOutput(
      JSON.stringify({ 
        sucesso: true, 
        mensagem: "Teste de conexão bem-sucedido!",
        timestamp: new Date().toISOString()
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
  
  // Cadastro via GET (alternativa ao POST que falha)
  if (e.parameter.acao === "cadastro_get") {
    console.log("Processando cadastro via GET");
    console.log("Parâmetros recebidos:", e.parameter);
    
    try {
      // Validação de parâmetros obrigatórios
      if (!e.parameter.nome || !e.parameter.email || !e.parameter.regiao || 
          !e.parameter.igreja || !e.parameter.whatsapp) {
        return ContentService.createTextOutput(
          JSON.stringify({ 
            sucesso: false, 
            mensagem: "Parâmetros obrigatórios: nome, email, regiao, igreja, whatsapp" 
          })
        ).setMimeType(ContentService.MimeType.JSON);
      }
      
      // Monta objeto de dados como no POST
      const dados = {
        nome: decodeURIComponent(e.parameter.nome),
        email: decodeURIComponent(e.parameter.email),
        regiao: decodeURIComponent(e.parameter.regiao),
        igreja: decodeURIComponent(e.parameter.igreja),
        whatsapp: decodeURIComponent(e.parameter.whatsapp)
      };
      
      console.log("Dados decodificados:", dados);
      
      // Chama a função de salvar usuário
      const resultado = salvarUsuario(dados);
      console.log("Resultado do cadastro via GET:", resultado);
      
      return ContentService.createTextOutput(
        JSON.stringify(resultado)
      ).setMimeType(ContentService.MimeType.JSON);
      
    } catch (error) {
      console.error("Erro no cadastro via GET:", error);
      return ContentService.createTextOutput(
        JSON.stringify({ 
          sucesso: false, 
          mensagem: "Erro interno: " + error.toString() 
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  if (e.parameter.acao === "usuarios") {
    // Protege com token
    if (!validarToken(e.parameter.token)) {
      return ContentService.createTextOutput(
        JSON.stringify({ sucesso: false, mensagem: "Token inválido." })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService.createTextOutput(
      JSON.stringify(listarUsuarios())
    ).setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(
    JSON.stringify({ sucesso: false, mensagem: "Ação inválida." })
  ).setMimeType(ContentService.MimeType.JSON);
}

function validarToken(token) {
  if (!token) return false;
  try {
    var decoded = Utilities.base64Decode(token).map(function(c){return String.fromCharCode(c)}).join('');
    var email = decoded.split(":")[0];
    var user = getUserData(email);
    return !!user;
  } catch (e) {
    return false;
  }
}


//revisado2

