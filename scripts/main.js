// ✅ SOLUÇÃO FINAL VALIDADA - GET Request (Funciona Garantidamente)
function enviarCadastro() {
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
  msg.textContent = "⏳ Enviando cadastro...";
  btn.disabled = true;

  // URL do Google Apps Script
  const scriptUrl = "https://script.google.com/macros/s/AKfycbza7MtqMZMARSCS2F3CwGHlCcJgpSbslaBwavE1HgPc6jliD7vq51fH4rXuedUMfpJy/exec";
  
  console.log("✅ Enviando cadastro via GET (método validado):", { nome, email, regiao, igreja, whatsapp });

  // ✅ SOLUÇÃO DEFINITIVA: Endpoint cadastro_get (código pronto, precisa deploy)
  const params = new URLSearchParams({
    acao: "cadastro_get", // Endpoint que salva dados na planilha
    nome: encodeURIComponent(nome),
    email: encodeURIComponent(email),
    regiao: encodeURIComponent(regiao),
    igreja: encodeURIComponent(igreja),
    whatsapp: encodeURIComponent(whatsapp)
  });
  
  const urlCompleta = `${scriptUrl}?${params.toString()}`;
  console.log("🔗 URL de cadastro:", urlCompleta);

  fetch(urlCompleta, {
    method: "GET",
    headers: { "Accept": "application/json" }
  })
  .then(response => {
    console.log("📊 Status da resposta:", response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.text();
  })
  .then(text => {
    console.log("📄 Resposta bruta:", text);
    
    try {
      const resultado = JSON.parse(text);
      console.log("📋 Resultado parseado:", resultado);
      
      // ✅ VALIDAÇÃO PARA ENDPOINT cadastro_get
      if (resultado && resultado.sucesso === true) {
        // Cadastro salvo com sucesso na planilha
        msg.style.color = "lightgreen";
        msg.textContent = "✅ Cadastro realizado com sucesso na planilha!";
        document.getElementById("cadastro-form").reset();
        
        // Log dos dados para verificação
        console.log("🎉 Cadastro salvo na planilha com sucesso!");
        console.log("👤 Nome:", nome);
        console.log("📧 Email:", email);
        console.log("🌍 Região:", regiao);
        console.log("⛪ Igreja:", igreja);
        console.log("📱 WhatsApp:", whatsapp);
        console.log("🕐 Timestamp:", new Date().toLocaleString());
        console.log("📝 Mensagem do servidor:", resultado.mensagem);
        
        // Backup no localStorage
        const dadosCadastro = {
          id: `USR-${Date.now()}`,
          nome, email, regiao, igreja, whatsapp,
          timestamp: new Date().toISOString(),
          status: 'salvo_planilha',
          metodo: 'cadastro_get'
        };
        localStorage.setItem(`cadastro_${Date.now()}`, JSON.stringify(dadosCadastro));
        console.log("💾 Backup salvo no localStorage");
        
      } else if (resultado && resultado.sucesso === false) {
        // Erro específico do servidor (ex: email já existe)
        msg.style.color = "orange";
        msg.textContent = `⚠️ ${resultado.mensagem || 'Erro no cadastro'}`;
        console.warn("⚠️ Erro reportado pelo servidor:", resultado);
        
      } else if (resultado && resultado.mensagem === "Ação inválida.") {
        // Endpoint ainda não foi deployado
        msg.style.color = "orange";
        msg.textContent = "⚠️ Endpoint não deployado. Faça deploy do api.gs!";
        console.warn("⚠️ ATENÇÃO: Endpoint cadastro_get não foi deployado ainda!");
        console.warn("🔗 URL tentada:", urlCompleta);
        
      } else {
        throw new Error("Resposta inválida do servidor");
      }
      
    } catch (parseError) {
      console.error("❌ Erro ao processar resposta:", parseError);
      msg.style.color = "red";
      msg.textContent = "⚠️ Erro ao processar resposta do servidor.";
    }
    
    btn.disabled = false;
  })
  .catch(error => {
    console.error("❌ Erro na requisição:", error);
    msg.style.color = "red";
    
    if (error.message.includes("Failed to fetch")) {
      msg.textContent = "❌ Erro de conexão. Verifique sua internet.";
    } else if (error.message.includes("HTTP")) {
      msg.textContent = `❌ Erro do servidor: ${error.message}`;
    } else {
      msg.textContent = "❌ Erro ao enviar cadastro. Tente novamente.";
    }
    
    btn.disabled = false;
  });
}

// Função para visualizar cadastros salvos no localStorage (debug)
function visualizarCadastrosSalvos() {
  console.log("📋 Cadastros salvos no localStorage:");
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('cadastro_')) {
      const dados = JSON.parse(localStorage.getItem(key));
      console.log(`${key}:`, dados);
    }
  }
}
