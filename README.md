# AuthenTick
A QR-code based medicine authentication system to detect fake drugs, track scans, and manage batch verification in real-time.

## 💊 MediVerify — Medicine Authentication System

A production-grade web application that enables manufacturers to 
register medicine batches, generate unique QR codes per product unit, 
and allow customers/retailers to instantly verify medicine authenticity 
by scanning the QR code — helping eliminate counterfeit drugs from the 
supply chain.

---

### 🔍 What Problem Does It Solve?
Counterfeit medicines are a global health crisis. This system gives 
every single medicine unit its own unique digital identity via QR code, 
making it impossible to duplicate or forge without detection.

---

### ⚙️ Core Features
- 🏭 Manufacturer Admin Dashboard with secure login
- 📦 Medicine batch registration with full product metadata
- 🔐 Auto-generation of unique Product ID + cryptographic token per unit
- 📲 Individual QR code generation for every medicine package
- ✅ Real-time scan verification — Authentic / Fake / Duplicate detection
- 🗺️ Scan logging with timestamp, IP address & geolocation
- ⚠️ Duplicate scan detection with alert system
- 🚨 Product recall alerts for unsafe batches
- 📅 Automatic expiry date detection on scan
- 🛡️ Fake medicine reporting by customers
- 📊 Batch monitoring dashboard with scan analytics

---

### 🛠️ Tech Stack
> *(Update this section based on your actual stack)*

- **Frontend:** React.js / Next.js
- **Backend:** Node.js / Express
- **Database:** MongoDB / PostgreSQL
- **QR Generation:** qrcode.js / python-qrcode
- **Authentication:** JWT

---

### 👥 User Roles
| Role | Access |
|------|--------|
| Manufacturer | Register batches, generate QR codes, monitor dashboard |
| Customer / Retailer | Scan QR code, verify authenticity, report fake |

---

### 📱 Responsive Design
Fully responsive across Mobile, Tablet, and Desktop with consistent 
UI components, spacing, and layout on all screen sizes.
