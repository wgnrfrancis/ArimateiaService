


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
    const dados = JSON.parse(e.postData.contents);

    // Cadastro
    if (dados.acao === "cadastro") {
      return ContentService.createTextOutput(
        JSON.stringify(salvarUsuario(dados))
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // Login
    if (dados.email && dados.senha) {
      return ContentService.createTextOutput(
        JSON.stringify(login(dados.email, dados.senha))
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // Outros endpoints...
    return ContentService.createTextOutput(
      JSON.stringify({ sucesso: false, mensagem: "Ação inválida." })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ sucesso: false, mensagem: "Erro interno: " + err })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Função para salvar usuário (cadastro)
function salvarUsuario(dados) {
  const planilha = SpreadsheetApp.openById(CONFIG.ID_PLANILHA);
  const aba = planilha.getSheetByName(CONFIG.ABA_USUARIOS);
  const linhas = aba.getDataRange().getValues();

  // Verifica se já existe
  for (let i = 1; i < linhas.length; i++) {
    if (linhas[i][2] === dados.email) {
      return { sucesso: false, mensagem: "E-mail já cadastrado." };
    }
  }

  // Adiciona novo usuário
  aba.appendRow([
    gerarIdUnico(),
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

  return { sucesso: true };
}

// Função para gerar ID único
function gerarIdUnico() {
  return "USR-" + Math.random().toString(36).substr(2, 9) + "-" + new Date().getTime();
}

function doGet(e) {
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




