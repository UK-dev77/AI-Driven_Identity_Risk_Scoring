const adminInput = document.getElementById("adminName");
const passwordInput = document.getElementById("adminPassword");

const btn = document.getElementById("adminLoginBtn");
const showPasswordBtn = document.getElementById("showPassword");

btn.addEventListener("click", async () => {

  const admin_name = adminInput.value.trim();
  const password = passwordInput.value.trim();

  if (!admin_name || !password) {
    alert("Please enter both admin name and password");
    return;
  }

  try {

    const res = await fetch("http://localhost:3000/api/admin-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ admin_name, password })
    });

    const data = await res.json();

    if (data.success) {

      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("adminName", admin_name);

      window.location.href = "dashboard.html";

    } else {
      alert(data.message);
    }

  } catch (err) {
    console.log(err);
    alert("Server error");
  }

  /* ---------- CLEAR INPUTS ---------- */

adminInput.value = "";
passwordInput.value = "";



  

});



/* ---------- SHOW PASSWORD ---------- */

showPasswordBtn.addEventListener("click", function () {

if (passwordInput.type === "password") {

passwordInput.type = "text";

} else {

passwordInput.type = "password";

}

});

