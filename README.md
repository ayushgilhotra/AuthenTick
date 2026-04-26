# AuthenTick

A QR-code-based medicine authentication system designed to detect counterfeit drugs, track product scans in real-time, and manage batch verification across the pharmaceutical supply chain.

Live Demo: https://authen-tick.vercel.app/

## The Problem

Counterfeit medicines represent one of the most pressing global health challenges today. Without a reliable way to verify authenticity at the point of purchase, patients and retailers cannot distinguish genuine products from dangerous fakes. AuthenTick solves this by giving every single medicine unit its own unique digital identity through QR codes, making counterfeits detectable and impossible to forge without immediate alert.

## Core Features

**Manufacturer Dashboard**
Register medicine batches with complete product metadata including composition, manufacturing date, and expiry information. Secure authentication ensures only authorized personnel can access sensitive batch data.

**Unique Product Identity**
Every medicine unit receives a unique Product ID and cryptographic token upon batch registration. This digital fingerprint forms the foundation of the authentication system and cannot be replicated.

**QR Code Generation**
Automatic creation of individual QR codes for every medicine package. These codes embed product verification data and scan history triggers directly into the physical package label.

**Real-Time Verification**
Customers and retailers scan QR codes to instantly verify authenticity. The system returns one of three states: Authentic, Fake, or Duplicate.

**Scan Tracking and Analytics**
Every scan is logged with timestamp, geographical location, and device information. Manufacturers gain visibility into product distribution patterns and market reach through an analytics dashboard.

**Duplicate Scan Detection**
When the same medicine unit is scanned multiple times within a suspicious timeframe or from different locations, the system flags it as a duplicate and alerts both manufacturer and customer.

**Product Recall Management**
Manufacturers can issue recall alerts for unsafe batches. Customers attempting to verify recalled products receive immediate warnings and guidance.

**Expiry Date Detection**
The system automatically checks expiry dates during verification. Products past their expiration are flagged and reported to manufacturers and health authorities.

**Fake Medicine Reporting**
Customers who encounter suspicious products can submit detailed reports including photos, location, and retail source. This crowdsourced data helps identify counterfeit distribution networks.

**Batch Monitoring Dashboard**
Real-time analytics showing scan counts, geographical heat maps, duplicate alerts, and product recall status. Manufacturers can monitor batch health and market performance at a glance.

## Technology Stack

**Frontend**
React.js with Next.js for server-side rendering and static generation. Responsive design ensures seamless experience across mobile, tablet, and desktop devices. Tailwind CSS handles styling and component consistency.

**Backend**
Node.js with Express.js provides a lightweight, event-driven server. RESTful APIs handle batch registration, QR verification, scan logging, and analytics queries.

**Database**
MongoDB stores batch metadata, scan logs, user reports, and analytics data. Mongoose provides schema validation and data consistency.

**QR Technology**
QRcode.js library generates codes client-side and server-side. Each code encodes the unique product token and verification endpoint.

**Authentication**
JWT-based authentication secures manufacturer endpoints. Tokens are short-lived and refresh tokens enable long sessions without compromising security.

## User Roles

**Manufacturer**
Access the admin dashboard to register new batches, generate and download QR codes, monitor scan analytics, issue product recalls, and review fake medicine reports from the field.

**Customer and Retailer**
Scan QR codes using any smartphone camera or dedicated app. Receive instant authenticity verification with detailed product information and expiry status.

## Getting Started

You'll need Node.js and a MongoDB instance (local or cloud-hosted via MongoDB Atlas) before proceeding.

Clone the repository and navigate to the project directory.

```
git clone https://github.com/ayushgilhotra/AuthenTick.git
cd AuthenTick
```

**Setup Environment Variables**

Copy the example configuration file and fill in your credentials.

```
cp .env.example .env
```

You will need the following variables configured:

MONGO_URI - Connection string to your MongoDB database
JWT_SECRET - Secret key for signing authentication tokens
API_PORT - Port number for the backend server
QRCODE_ENCRYPTION_KEY - Key for encoding product tokens into QR codes

**Install and Run Backend**

Navigate to the server directory, install dependencies, and start the development server.

```
cd server
npm install
npm run dev
```

The backend will be available at http://localhost:5000

**Install and Run Frontend**

In a new terminal, navigate to the client directory, install dependencies, and start the development server.

```
cd ../client
npm install
npm run dev
```

The frontend will open at http://localhost:3000

## Deployment

**Backend Deployment (Render, Railway, or Heroku)**

Set the root directory to server/

Configure the start command as:
```
node src/server.js
```

Add the required environment variables:
MONGO_URI
JWT_SECRET
API_PORT
QRCODE_ENCRYPTION_KEY

**Frontend Deployment (Vercel or Netlify)**

Set the root directory to client/

Build command:
```
npm run build
```

Set the publish directory to dist/

Add the environment variable:
VITE_API_URL - URL of your deployed backend

**Database**

For production, use MongoDB Atlas cloud hosting. Create a free account at atlas.mongodb.com, set up a cluster, and copy the connection string to your environment variables.

## Project Structure

```
AuthenTick/
├── server/
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── main.jsx
│   ├── public/
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Security Considerations

Manufacturer credentials are protected through JWT authentication with short token expiry times. Sensitive batch data is encrypted at rest in the database. QR codes embed cryptographic tokens that are verified server-side, preventing simple replication. Scan logs include IP addresses and device fingerprints for anomaly detection.

## Future Enhancements

Integration with government health databases for real-time recall data. Machine learning models to predict counterfeit hotspots based on scan patterns. Blockchain integration for immutable batch verification records. Mobile app with offline scanning capability. SMS notifications for product recalls and duplicate scans.

## Contributing

This is a production project but contributions are welcome. Please fork the repository, create a feature branch, and submit a pull request with your improvements.

## License

This project is open source and available under the MIT License.

## Contact

For questions, feature requests, or to report security vulnerabilities, please reach out through the GitHub repository or contact the maintainer directly.
