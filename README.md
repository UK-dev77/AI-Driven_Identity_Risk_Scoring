# 🔐 Intelligent Identity Risk Scoring for Adaptive Access Control

## 📌 Problem Statement

Develop a system that enhances authentication security by dynamically evaluating user identity risk and adapting access decisions accordingly.

---

## 🚀 Project Overview

This project implements an **intelligent risk-based authentication system** that analyzes user login behavior in real time and assigns a **risk score**.

Unlike traditional systems that rely only on passwords, this system uses **context-aware parameters** such as:

* Login time
* Location
* IP address
* Device information
* Failed login attempts

Based on the calculated risk level, the system dynamically decides whether to:

* ✅ Allow access
* ⚠️ Flag suspicious activity
* ❌ Block login attempts

---

## 🧠 Core Concept

The system follows a **Zero Trust Security Model**, where no login attempt is automatically trusted.

> This is a **rule-based intelligent scoring system** designed to simulate real-world adaptive authentication. It is structured to be extended into AI/ML-based models in the future.

---

## ⚙️ Tech Stack

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* Firebase Firestore

### Tools & Libraries

* Firebase Admin SDK
* REST API architecture

---

## 🔍 Features

### 🔐 User Authentication

* Email & password login
* Admin login system

### 📊 Risk-Based Access Control

* Evaluates every login attempt using behavior analysis

### 📁 Activity Logging

* Stores all login attempts in Firestore
* Tracks success and failure
* Maintains risk history

### 📈 Real-Time Decision System

* Calculates risk instantly
* Sends response to frontend

---

## 📊 Risk Scoring Logic

The system assigns risk points based on the following rules:

### 🕒 Time-Based Risk

* Login between **10 PM – 6 AM** → +1 point

### 🌍 Location Risk

* Login outside **India** → +3 points

### 🌐 IP Behavior

* 3 or more unique IP addresses → +2 points

### 💻 Device Behavior

* 2 or more devices used → +2 points

### ❌ Failed Attempts

* 3 or more failed login attempts → +3 points

---

## 🎯 Risk Levels

| Score | Risk Level | Action      |
| ----- | ---------- | ----------- |
| 0 – 2 | LOW        | Allow Login |
| 3 – 5 | MEDIUM     | Monitor     |
| 6+    | HIGH       | Block Login |

---

## 🗂️ Firebase Firestore Structure

### users

* email
* password

### admins

* admin_name
* password

### login_logs

* email
* ip
* location
* device
* os
* browser
* loginHour
* timestamp
* risk
* riskScore
* reasons
* loginStatus

### failed_attempts

* email
* timestamp

---

## 🔗 API Endpoints

### 1. User Login

**POST /api/login**

#### Request:

```json
{
  "email": "user@example.com",
  "password": "123456",
  "ip": "192.168.1.1",
  "location": "India",
  "deviceType": "Mobile",
  "os": "Android",
  "browser": "Chrome",
  "loginHour": 14
}
```

#### Response:

```json
{
  "message": "Login successful",
  "risk": "LOW"
}
```

---

### 2. Admin Login

**POST /api/admin-login**

#### Request:

```json
{
  "admin_name": "admin",
  "password": "1234"
}
```

#### Response:

```json
{
  "success": true
}
```

---

### 3. Fetch Logs

**GET /api/logs**

#### Response:

```json
[
  {
    "email": "user@example.com",
    "risk": "HIGH",
    "loginStatus": "FAILED"
  }
]
```

---

## 🏗️ System Architecture

1. User enters login details (Frontend)
2. Request sent to Node.js backend
3. Backend:

   * Validates credentials
   * Retrieves previous logs from Firebase
   * Calculates risk score
4. Decision generated (Allow / Block)
5. Login stored in Firestore
6. Response sent back to frontend

---

## ▶️ How to Run

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Firebase

* Add Firebase Admin SDK key file
* Update configuration in `firebase.js`

### 3. Start server

```bash
node server.js
```

### 4. Run frontend

Open `index.html` in browser

---

## 🌐 Deployment

* Frontend: Vercel / Netlify
* Backend: Render / Railway
* Database: Firebase Firestore

---

## 🔐 Security Considerations

This is a prototype system. Improvements for production:

* Password hashing (bcrypt)
* JWT-based authentication
* Rate limiting
* Secure session handling

---

## 🚀 Future Enhancements

* Machine learning-based anomaly detection
* Multi-factor authentication (OTP)
* Real-time alerts
* Advanced geo-location tracking

---

## 🎥 Demo

(https://drive.google.com/file/d/1RsvKI2iZ42GCcrFO6zE7MsDkqriW0_-6/view?usp=drivesdk)

---

## 💡 Key Highlight

This project demonstrates a **behavior-based authentication system** where access decisions are dynamic and context-aware.

It reflects modern security practices used in:

* Banking systems
* Enterprise applications
* Zero Trust architectures
