const messageBox = document.getElementById("messageBox");
const tableBody = document.querySelector("#empresasTable tbody");
const reloadBtn = document.getElementById("reloadBtn");

async function carregarEmpresas() {
  try {
    const resp = await fetch("http://localhost:8080/empresas/lista");
    const data = await resp.json();

    if (!resp.ok) throw new Error(data.error || "Erro ao carregar empresas");

    // Limpa tabela
    tableBody.innerHTML = "";

    if (data.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="3">Nenhuma empresa encontrada.</td></tr>`;
      return;
    }

    data.forEach((empresa) => {
      const tr = document.createElement("tr");

      const tdRazao = document.createElement("td");
      tdRazao.textContent = empresa.razao_social;

      const tdCnpj = document.createElement("td");
      tdCnpj.textContent = empresa.cnpj;

      const tdStatus = document.createElement("td");
      tdStatus.textContent = empresa.status_pagamento;
      tdStatus.className = `status ${empresa.status_pagamento.toLowerCase()}`;

      tr.appendChild(tdRazao);
      tr.appendChild(tdCnpj);
      tr.appendChild(tdStatus);

      tableBody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    showMessage("❌ Erro ao carregar empresas.", "error");
  }
}

reloadBtn.addEventListener("click", carregarEmpresas);

function showMessage(msg, type) {
  messageBox.textContent = msg;
  messageBox.className = `message ${type}`;
  messageBox.classList.remove("hidden");
}

// Carrega na entrada
carregarEmpresas();
