document.getElementById('uploadForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const arquivo = document.getElementById('arquivo').files[0];
  const mensagem = document.getElementById('mensagem');
  mensagem.textContent = '';

  if (!arquivo) {
    mensagem.textContent = 'Selecione um arquivo';
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    mensagem.textContent = 'Você não está logado.';
    return;
  }

  const formData = new FormData();
  formData.append('arquivo', arquivo);

  try {
    const response = await fetch('http://localhost:8080/empresas/upload-empresas', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token },
      body: formData
    });

    const data = await response.json();
    if (!response.ok) {
      mensagem.textContent = data.error;
      return;
    }

    mensagem.style.color = "green";
    mensagem.textContent = data.message;
  } catch (err) {
    mensagem.style.color = "red";
    mensagem.textContent = 'Erro ao enviar planilha';
  }
});
