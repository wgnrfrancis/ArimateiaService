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
  msg.textContent = "⏳ Enviando...";
  btn.disabled = true;

  fetch("https://script.google.com/macros/s/AKfycbzQkIBCS1iV03v8Y2FQN4bwXLcnsBwgNigg3zDOAOW9dPh-FRjdJXx7_hyX5OG1Ip36/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome,
      email,
      regiao,
      igreja,
      whatsapp,
      senha: "Arimateia1",
      funcao: "Voluntário",
      status: "Ativo",
      ativo: "Sim",
      acao: "cadastro"
    })
  })
  .then(response => response.json())
  .then(res => {
    if (res.sucesso) {
      msg.style.color = "lightgreen";
      msg.textContent = "✅ Cadastro realizado!";
      document.getElementById("cadastro-form").reset();
    } else {
      msg.style.color = "red";
      msg.textContent = res.mensagem || "Erro ao cadastrar.";
    }
    btn.disabled = false;
  })
  .catch(() => {
    msg.style.color = "red";
    msg.textContent = "Erro ao conectar ao servidor.";
    btn.disabled = false;
  });
}
