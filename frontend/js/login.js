const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const showPasswordBtn = document.getElementById("showPassword");
const riskResult = document.getElementById("riskResult");


emailInput.addEventListener("input", () => {
  riskResult.innerText = "";
  riskResult.style.color = "";
});

passwordInput.addEventListener("input", () => {
  riskResult.innerText = "";
  riskResult.style.color = "";
});


loginBtn.addEventListener("click", async function (e) {

e.preventDefault();


const email = emailInput.value.trim();
const password = passwordInput.value.trim();

/* ---------- VALIDATION (ADDED) ---------- */

if (!email || !password) {
  riskResult.innerText = "⚠️ Please fill all fields";
  riskResult.style.color = "red";
  return;
}

if (!email.includes("@")) {
  riskResult.innerText = "⚠️ Enter valid email";
  riskResult.style.color = "red";
  return;
}

const loginTime = new Date();
const loginHour = loginTime.getHours();
const sessionStart = Date.now();

let ip = "Unknown";
let location = "Unknown";

/* ---------- GET IP + LOCATION ---------- */

try {

const geoRes = await fetch("https://ipapi.co/json/");
const geoData = await geoRes.json();

ip = geoData.ip;

location = `${geoData.country_name}` || "Unknown";

} catch (err) {

console.log("IP / Location fetch error:", err);

}

/* ---------- DEVICE DETECTION ---------- */

const parser = new UAParser();
const result = parser.getResult();

const deviceInfo = {

deviceType: result.device.type || "desktop",

browser: result.browser.name || "Unknown",
browserVersion: result.browser.version || "Unknown",

os: result.os.name || "Unknown",
osVersion: result.os.version || "Unknown",

platform: navigator.platform,

screenWidth: window.screen.width,
screenHeight: window.screen.height

};

console.log("Device Info:", deviceInfo);

/* ---------- LOGIN DATA OBJECT ---------- */

const loginData = {

email,
password,

deviceType: deviceInfo.deviceType,
browser: deviceInfo.browser,
browserVersion: deviceInfo.browserVersion,
os: deviceInfo.os,
osVersion: deviceInfo.osVersion,

platform: deviceInfo.platform,
screenWidth: deviceInfo.screenWidth,
screenHeight: deviceInfo.screenHeight,

ip,
location,
loginHour,
sessionStart

};

console.log("Sending login data:", loginData);

/* ---------- SEND TO BACKEND ---------- */

try {

const response = await fetch("http://localhost:3000/api/login", {

method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify(loginData)

});

const data = await response.json();

console.log("Server response:", data);

/* ---------- HANDLE RESPONSE ---------- */

if (data.risk === "BLOCKED") {
  // ❌ Show error only
  riskResult.innerText = "❌ " + data.message;
  riskResult.style.color = "red";
} else {
  // ✅ SUCCESS → redirect (no risk shown here)
  localStorage.setItem("userEmail", email);
  window.location.href = "user-dashboard.html";
}
} catch (err) {

console.log("Server error:", err);

}

/* ---------- CLEAR INPUTS ---------- */

emailInput.value = "";
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
