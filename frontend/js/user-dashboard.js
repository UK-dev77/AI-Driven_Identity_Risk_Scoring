// 🔐 PROTECT PAGE (must login first)
if (!localStorage.getItem("userEmail")) {
  window.location.href = "index.html";
}

/* ---------- SHOW USER ---------- */

const email = localStorage.getItem("userEmail");
const welcomeText = document.getElementById("welcomeText");

welcomeText.innerText = "Logged in as: " + email;

/* ---------- LOGOUT ---------- */

function logout() {
  localStorage.removeItem("userEmail");
  window.location.href = "index.html";
}