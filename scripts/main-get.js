function enviarCadastroGET() {
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const regiao = document.getElementById("regiao").value.trim();
  const igreja = document.getElementById("igreja").value.trim();
  const whatsapp = document.getElementById("whatsapp").value.trim();
  const msg = document.getElementById("cad-msg");
  const btn = document.querySelector(".btn-primary");

  if (!nome || !email || !regiao || !igreja || !whatsapp) {
    msg.style.color = "red";
    msg.textContent = "Preencha todos os campos.";
    return;
  }

  msg.style.color = "white";
  msg.textContent = "⏳ Enviando...";
  btn.disabled = true;

  // URL do Google Apps Script - NOVA IMPLANTAÇÃO
  const scriptUrl = "https://script.google.com/macros/s/AKfycbza7MtqMZMARSCS2F3CwGHlCcJgpSbslaBwavE1HgPc6jliD7vq51fH4rXuedUMfpJy/exec";
  
  console.log("Enviando dados via GET para:", scriptUrl);
  console.log("Dados:", { nome, email, regiao, igreja, whatsapp });

  // Constrói URL com parâmetros (método GET)
  const params = new URLSearchParams({
    acao: "cadastro_get",
    nome: encodeURIComponent(nome),
    email: encodeURIComponent(email),
    regiao: encodeURIComponent(regiao),
    igreja: encodeURIComponent(igreja),
    whatsapp: encodeURIComponent(whatsapp)
  });
  
  const urlCompleta = `${scriptUrl}?${params.toString()}`;
  console.log("URL completa:", urlCompleta);

  fetch(urlCompleta, {
    method: "GET",
    headers: { 
      "Accept": "application/json"
    }
  })
  .then(response => {
    console.log("Status da resposta:", response.status);
    console.log("Headers da resposta:", response.headers);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.text(); // Primeiro pega como texto para debug
  })
  .then(text => {
    console.log("Resposta bruta:", text);
    
    try {
      const res = JSON.parse(text);
      console.log("Resposta parseada:", res);
      
      if (res.sucesso) {
        msg.style.color = "lightgreen";
        msg.textContent = "✅ Cadastro realizado com sucesso!";
        document.getElementById("cadastro-form").reset();
      } else {
        msg.style.color = "red";
        msg.textContent = res.mensagem || "Erro ao cadastrar.";
        console.error("Erro do servidor:", res);
      }
    } catch (parseError) {
      console.error("Erro ao fazer parse da resposta:", parseError);
      console.error("Resposta recebida:", text);
      msg.style.color = "red";
      msg.textContent = "Erro: Resposta inválida do servidor.";
    }
    
    btn.disabled = false;
  })
  .catch(error => {
    console.error("Erro completo:", error);
    console.error("Tipo do erro:", error.name);
    console.error("Mensagem do erro:", error.message);
    
    msg.style.color = "red";
    
    // Mensagens de erro mais específicas
    if (error.name === "TypeError" && error.message.includes("Failed to fetch")) {
      msg.textContent = "❌ Erro de conexão. Verifique sua internet ou se o servidor está ativo.";
    } else if (error.message.includes("HTTP")) {
      msg.textContent = `❌ Erro do servidor: ${error.message}`;
    } else if (error.name === "SyntaxError") {
      msg.textContent = "❌ Erro: Resposta inválida do servidor.";
    } else {
      msg.textContent = `❌ Erro ao conectar: ${error.message}`;
    }
    
    btn.disabled = false;
  });
}
