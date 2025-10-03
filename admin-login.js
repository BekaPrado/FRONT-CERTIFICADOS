const loginForm = document.getElementById("loginForm");
const messageBox = document.getElementById("messageBox");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    const resp = await fetch("http://localhost:8080/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || "Erro no login");

    localStorage.setItem("token", data.token);
    showMessage("✅ Login realizado com sucesso! Redirecionando...", "success");

    setTimeout(() => {
      window.location.href = "admin-area.html";
    }, 1500);
  } catch (err) {
    showMessage("❌ E-mail ou senha inválidos.", "error");
  }
});

function showMessage(msg, type) {
  messageBox.textContent = msg;
  messageBox.className = `message ${type}`;
  messageBox.classList.remove("hidden");
}
