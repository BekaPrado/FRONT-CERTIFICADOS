const BASE_URL = "http://localhost:8080";

const uploadForm = document.getElementById("uploadForm");
const messageBox = document.getElementById("messageBox");
const arquivoInput = document.getElementById("arquivo");
const fileTextSpan = document.getElementById("fileText");

function showMessage(msg, type = "info") {
  messageBox.textContent = msg;
  messageBox.className = `message ${type}`;
  messageBox.classList.remove("hidden");
}
function clearMessage() {
  messageBox.textContent = "";
  messageBox.className = "message hidden";
}

arquivoInput.addEventListener("change", () => {
  fileTextSpan.textContent = arquivoInput.files.length > 0
    ? arquivoInput.files[0].name
    : "Clique ou arraste o arquivo aqui (.xlsx, .xls, .csv)";
});

uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMessage();

  if (!arquivoInput.files.length) {
    showMessage("❌ Selecione um arquivo.", "error");
    return;
  }

  const arquivo = arquivoInput.files[0];
  const allowed = [".xlsx", ".xls", ".csv"];
  const ext = arquivo.name.slice(arquivo.name.lastIndexOf(".")).toLowerCase();
  if (!allowed.includes(ext)) {
    showMessage("❌ Formato inválido. Use .xlsx, .xls ou .csv", "error");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    showMessage("❌ Você não está logado.", "error");
    return;
  }

  const formData = new FormData();
  formData.append("arquivo", arquivo);

  showMessage("⏳ Enviando planilha...", "info");

  try {
    const resp = await fetch(`${BASE_URL}/empresas/upload-empresas`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
      body: formData,
    });

    const data = await resp.json();
    if (!resp.ok) {
      showMessage(data.error || "❌ Erro ao enviar planilha.", "error");
      return;
    }
    showMessage(data.message || "Planilha enviada com sucesso!", "success");

    loadHistorico(); // atualiza histórico
  } catch (err) {
    console.error("Erro no fetch:", err);
    showMessage("❌ Erro na requisição.", "error");
  }
});

// ====== HISTÓRICO ======
async function loadHistorico(limit = 5) {
  try {
    const resp = await fetch(`${BASE_URL}/empresas/historico`);
    const data = await resp.json();

    const tbody = document.getElementById("historicoBody");
    tbody.innerHTML = "";

    let shown = data;
    if (limit !== "all") shown = data.slice(0, limit);

    shown.forEach(row => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
<td>${row.arquivo_nome}</td>
        <td>${row.quantidade_empresas}</td>
        <td>${new Date(row.data_upload).toLocaleString("pt-BR")}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Erro ao carregar histórico:", err);
  }
}

document.getElementById("historicoLimit").addEventListener("change", (e) => {
  const val = e.target.value === "all" ? "all" : parseInt(e.target.value);
  loadHistorico(val);
});

loadHistorico();
