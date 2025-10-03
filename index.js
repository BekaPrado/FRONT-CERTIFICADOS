function formatCNPJ(value) {
  value = value.replace(/\D/g, "");
  value = value.replace(/^(\d{2})(\d)/, "$1.$2");
  value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
  value = value.replace(/(\d{4})(\d)/, "$1-$2");
  return value;
}

const cnpjInput = document.getElementById("cnpjInput");
const messageBox = document.getElementById("messageBox");

cnpjInput.addEventListener("input", (e) => {
  e.target.value = formatCNPJ(e.target.value);
});

document.getElementById("cnpjForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  let cnpj = cnpjInput.value.replace(/\D/g, "");
  if (!cnpj) {
    showMessage("Por favor, insira um CNPJ válido.", "error");
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/empresas/certificado/${cnpj}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar CNPJ ou certificado indisponível.");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "certificado.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();

    showMessage("✅ Certificado gerado com sucesso! O download iniciou.", "success");
  } catch (error) {
    console.error(error);
    showMessage("❌ CNPJ não encontrado ou não está com status PAGO.", "error");
  }
});

function showMessage(msg, type) {
  messageBox.textContent = msg;
  messageBox.className = `message ${type}`;
  messageBox.classList.remove("hidden");
}
