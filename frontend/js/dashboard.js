if (!localStorage.getItem("isAdmin")) {
  window.location.href = "admin-login.html";
}

let previousLogs = [];

async function loadLogs(){

const table = document.getElementById("logTable");


try{

const res = await fetch("http://localhost:3000/api/logs");

const logs = await res.json();

if (!logs || logs.length === 0) {
  table.innerHTML = "<tr><td colspan='5'>No logs available</td></tr>";
  return;
}

/* ---------- PREVENT UNNECESSARY RE-RENDER ---------- */

if (JSON.stringify(logs) === JSON.stringify(previousLogs)) {
  return; // no change → no update → no blink
}

previousLogs = logs;

/* ---------- NOW CLEAR TABLE ---------- */
table.innerHTML = "";

logs.forEach(log => {

const row = document.createElement("tr");



let time = "-";

try {
  if (log.timestamp) {

    // ✅ Correct for Firestore (Node → JSON)
    if (log.timestamp._seconds) {
      time = new Date(log.timestamp._seconds * 1000)
        .toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short"
        });
    }

    // fallback
    else {
      time = new Date(log.timestamp).toLocaleString();
    }

  }
} catch (e) {
  time = "-";
}

console.log("Log timestamp:", log.timestamp, "Parsed time:", time);

let riskColor = "green";

if(log.risk === "MEDIUM"){
riskColor = "orange";
}

if(log.risk === "HIGH"){
riskColor = "red";
}

row.innerHTML = `
<td>${log.email}</td>
<td>${log.ip}</td>
<td>${log.location || "-"}</td>
<td>${log.device}</td>
<td>${log.os || "-"}</td>
<td>${log.browser || "-"}</td>
<td>${log.loginHour || "-"}</td>
<td>${time}</td>
<td style="color:${riskColor}; font-weight:bold;">
${log.risk}
</td>
<td>${log.riskScore || "-"}</td>
<td>${
  log.reasons && log.reasons.length > 0
    ? log.reasons.join(", ")
    : "No issues found"
}</td>
<td>${log.loginStatus || "Failed"}</td>

`;

table.appendChild(row);

});

}catch(err){

console.log("Error loading logs:", err);

}

}

function logout() {
  localStorage.removeItem("isAdmin");
  localStorage.removeItem("adminName");
  window.location.href = "admin-login.html";
}

loadLogs()

// console.log(log.timestamp);

setInterval(loadLogs, 3000); 