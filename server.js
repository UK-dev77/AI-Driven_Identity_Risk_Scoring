const express = require("express");
const cors = require("cors");

const db = require("./firebase");

const admin = require("firebase-admin");

const app = express();

app.use(cors());
app.use(express.json());

// Admin Login API

app.post("/api/admin-login", async (req, res) => {

  const { admin_name, password } = req.body;

  try {

    const snapshot = await db
      .collection("admins")
      .where("admin_name", "==", admin_name)
      .limit(1)
      .get();

    // ❌ Admin not found
    if (snapshot.empty) {
      return res.json({
        success: false,
        message: "Admin not found"
      });
    }

    const admin = snapshot.docs[0].data();

    // ❌ Wrong password
    if (admin.password !== password) {
      return res.json({
        success: false,
        message: "Wrong password"
      });
    }

    // ✅ Success
    res.json({
      success: true
    });

  } catch (error) {

    console.log("Admin login error:", error);

    res.json({
      success: false,
      message: "Server error"
    });

  }

});


/* ---------- LOGIN API ---------- */

app.post("/api/login", async (req, res) => {

const loginData = req.body;

console.log("Login data received:", loginData);





try {

    /* ---------- CHECK USER EXISTS ---------- */

    const snapshot = await db
    .collection("users") // 🔥 your collection name (case sensitive)
    .where("email", "==", loginData.email)
    .limit(1)
    .get();

    if (snapshot.empty) {

    // ✅ store failed attempt (for risk logic)
    await db.collection("failed_attempts").add({
        email: loginData.email,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    // ✅ store in dashboard logs
    await db.collection("login_logs").add({
        email: loginData.email,
        ip: loginData.ip,
        location: loginData.location,
        device: loginData.deviceType,
        os: loginData.os,
        browser: loginData.browser,
        loginHour: loginData.loginHour,

        timestamp: admin.firestore.FieldValue.serverTimestamp(),

        risk: "HIGH",
        riskScore: 5,
        reasons: ["User not found"],
        loginStatus: "FAILED"
    });

    return res.json({
        message: "User not found",
        risk: "BLOCKED"
    });
}

    const user = snapshot.docs[0].data();

    /* ---------- PASSWORD CHECK ---------- */

    if (user.password !== loginData.password) {

    // ✅ store failed attempt
    await db.collection("failed_attempts").add({
        email: loginData.email,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    // ✅ store in dashboard
    await db.collection("login_logs").add({
        email: loginData.email,
        ip: loginData.ip,
        location: loginData.location,
        device: loginData.deviceType,
        os: loginData.os,
        browser: loginData.browser,
        loginHour: loginData.loginHour,

        timestamp: admin.firestore.FieldValue.serverTimestamp(),

        risk: "HIGH",
        riskScore: 5,
        reasons: ["Wrong password"],
        loginStatus: "FAILED"
    });

    return res.json({
        message: "Invalid password",
        risk: "BLOCKED"
    });
}


// clear failed attempts
const failedDocs = await db
  .collection("failed_attempts")
  .where("email", "==", loginData.email)
  .get();

failedDocs.forEach(doc => doc.ref.delete());

    /* ---------- ACCOUNT STATUS CHECK ---------- */

    // if (user.accountstatus !== "active") {
    //     return res.json({
    //         message: "Account disabled",
    //         risk: "BLOCKED"
    //     });
    // }

    /* ---------- YOUR ORIGINAL RISK LOGIC (UNCHANGED) ---------- */

   let riskScore = 0;
let reasons = [];

/* 1️⃣ Time Risk */
if (loginData.loginHour > 22 || loginData.loginHour < 6) {
  riskScore += 1;
  reasons.push("Unusual login time");
}

/* 2️⃣ Location Risk */
if (!loginData.location.includes("India")) {
  riskScore += 3;
  reasons.push("Foreign location");
}

/* 3️⃣ Previous Behavior Analysis */
const prevLogs = await db
  .collection("login_logs")
  .where("email", "==", loginData.email)
  .get();

let ipSet = new Set();
let deviceSet = new Set();

prevLogs.forEach(doc => {
  const d = doc.data();
  ipSet.add(d.ip);
  deviceSet.add(d.device);
});

/* 4️⃣ Multiple IP */
if (ipSet.size >= 3) {
  riskScore += 2;
  reasons.push("Multiple IP usage");
}

/* 5️⃣ Device Change */
if (deviceSet.size >= 2) {
  riskScore += 2;
  reasons.push("Multiple device usage");
}

/* 6️⃣ Failed Attempts */
const failed = await db
  .collection("failed_attempts")
  .where("email", "==", loginData.email)
  .get();

if (failed.size >= 3) {
  riskScore += 3;
  reasons.push("Multiple failed attempts");
}

console.log(failed);

/* ---------- FINAL RISK ---------- */

let risk = "LOW";

if (riskScore >= 3) risk = "MEDIUM";
if (riskScore >= 6) risk = "HIGH";

    /* ---------- STORE LOGIN LOG (ONLY AFTER VALIDATION) ---------- */

    await db.collection("login_logs").add({

  email: loginData.email,

  ip: loginData.ip,
  location: loginData.location,

  device: loginData.deviceType,
  os: loginData.os,
  browser: loginData.browser,

  loginHour: loginData.loginHour,
  

  timestamp: admin.firestore.FieldValue.serverTimestamp(),

  risk: risk,
  riskScore: riskScore,
  reasons: reasons,

  loginStatus: "SUCCESS"

});

    res.json({
        message: "Login successful",
        risk: risk
    });

} catch (error) {

    console.log("Firestore error:", error);

    res.status(500).json({
        message: "Database error"
    });

}

});

/* ---------- DASHBOARD API (UNCHANGED) ---------- */

app.get("/api/logs", async (req, res) => {

try {

    const snapshot = await db
    .collection("login_logs")
    .orderBy("timestamp", "desc")
    .get();

    const logs = [];

    snapshot.forEach(doc => {
        logs.push(doc.data());
    });

    res.json(logs || []); //if no logs, return empty array

} catch (error) {

    console.log("Error loading logs:", error);

    res.json ([]); // Return empty array on error instead of 500, to keep dashboard functional

    // res.status(500).json({
    //     message: "Error fetching logs"
    // });

}

});

/* ---------- START SERVER ---------- */

app.listen(3000, () => {
console.log("Server running on http://localhost:3000");
});



app.get("/debug", async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    res.json({ success: true, count: snapshot.size });
  } catch (err) {
    console.error("🔥 DEBUG ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});