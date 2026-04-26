AuthenTick

A QR-code-based medicine authentication system to detect counterfeit drugs, track scans, and manage batch verification in real-time.

Live Demo: https://authen-tick.vercel.app/

What is AuthenTick?

I built AuthenTick to solve a real problem. Counterfeit medicines are everywhere and patients have no way to know if what they're buying is real or fake. This system gives every medicine unit its own unique digital identity through QR codes. When someone scans the code, they instantly know if it's authentic, and if it's fake, we catch it right away. It's impossible to replicate without being detected.

The way it works is simple but powerful. Manufacturers register their batches and get unique QR codes for every package. Customers scan those codes with any phone camera to verify authenticity. Every scan is tracked with timestamps and location data, so we can spot patterns like duplicate scans or suspicious distribution hotspots.

Core Features

I implemented a manufacturer dashboard where admins can register new medicine batches with complete product metadata including composition, manufacturing date, and expiry information. The registration process is secured so only authorized personnel get access.

Every medicine unit gets a unique Product ID and cryptographic token. This digital fingerprint is what makes the whole system work. It cannot be replicated no matter how hard someone tries.

QR codes are generated automatically for every package. Each code embeds the product verification data directly, and when scanned, it triggers the verification process instantly.

The verification system returns one of three states immediately. Authentic means the product is genuine and safe. Fake means it's counterfeit and the customer is warned. Duplicate means the same package has been scanned multiple times in suspicious ways.

Every single scan gets logged with timestamp, location, and device information. Manufacturers can see exactly where their products are being sold and how they're performing in different markets. The analytics dashboard gives real-time visibility into batch health.

If the same medicine unit gets scanned multiple times from different locations or within impossible timeframes, the system flags it as duplicate and sends alerts. Both the manufacturer and customer get notified immediately.

Manufacturers can issue product recalls for unsafe batches. If someone tries to verify a recalled product, they get an immediate warning with guidance on what to do.

The system automatically checks expiry dates during verification. Products past their expiration are flagged right away and reported to manufacturers and health authorities.

Customers who encounter suspicious products can file reports with photos, location details, and where they bought it. This crowdsourced data helps us build a map of where counterfeits are being distributed and how the fake drug networks operate.

The batch monitoring dashboard shows scan counts, geographical heat maps, duplicate alerts, and recall status all in one place. Manufacturers can monitor everything at a glance and spot trends instantly.

Tech Stack

Frontend is built with React.js and Next.js for server-side rendering. The design is responsive across mobile, tablet, and desktop devices so users get the same smooth experience everywhere. Tailwind CSS keeps the styling consistent and scalable.

Backend runs on Node.js with Express.js. It's lightweight and event-driven, handling batch registration, QR verification, scan logging, and analytics queries through RESTful APIs.

MongoDB stores all the batch metadata, scan logs, user reports, and analytics data. Mongoose keeps everything consistent with schema validation.

QR codes are generated using the QRcode.js library. I use it both on the server and client side. Each code encodes the unique product token so verification happens securely.

Authentication is handled through JWT. Manufacturer endpoints are protected with short-lived tokens, and refresh tokens let users stay logged in without compromising security.

Who Can Use It

Manufacturers get access to the admin dashboard where they register new batches, generate QR codes, download them for printing, monitor scan analytics in real-time, issue product recalls when needed, and review all the fake medicine reports coming from customers in the field.

Customers and retailers can scan QR codes using any smartphone camera or the dedicated app. They get instant verification telling them if the product is authentic, with detailed product information and expiry status included.

Getting Started

You'll need Node.js installed and a MongoDB instance running before you start. You can use a local MongoDB or create a free account on MongoDB Atlas for cloud hosting.

First, clone the repository:

git clone https://github.com/ayushgilhotra/AuthenTick.git
cd AuthenTick

Next, set up your environment variables. Copy the example file and fill in your values:

cp .env.example .env

You'll need these variables:

MONGO_URI is your MongoDB connection string
JWT_SECRET is the secret key for signing tokens
API_PORT is what port your backend runs on
QRCODE_ENCRYPTION_KEY is used for encoding product tokens into the QR codes

Navigate to the server directory, install dependencies, and start it:

cd server
npm install
npm run dev

Your backend will run at http://localhost:5000

In a new terminal, go to the client folder and start the frontend:

cd ../client
npm install
npm run dev

The frontend opens at http://localhost:3000

Deployment

For the backend, you can deploy to Render, Railway, or Heroku. Set the root directory to server/ and configure the start command as node src/server.js. You'll need to add these environment variables in your deployment platform:

MONGO_URI
JWT_SECRET
API_PORT
QRCODE_ENCRYPTION_KEY

For the frontend, Vercel or Netlify work great. Set the root directory to client/, the build command to npm run build, and the publish directory to dist/. Add this environment variable:

VITE_API_URL pointing to your deployed backend URL

If you're using MongoDB Atlas for production, create a free account at atlas.mongodb.com, set up a cluster, and copy the connection string to your environment variables.

Project Structure

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

Security

I took security seriously with this project. Manufacturer credentials are protected through JWT authentication with short token expiry times. Sensitive batch data gets encrypted when stored in the database. QR codes embed cryptographic tokens that are verified on the server side, so simple replication doesn't work. Scan logs include IP addresses and device fingerprints so we can detect anomalies and suspicious patterns.

Future Plans

I'm thinking about integrating with government health databases for real-time recall data. Machine learning models could analyze scan patterns to predict where counterfeits are being distributed. Blockchain could be added for immutable batch verification records. A mobile app with offline scanning capability would be useful. SMS notifications for recalls and duplicate scans would make the system even more responsive.

Contributing

This is a production project but I'm open to contributions. Just fork the repository, create a feature branch, and submit a pull request with your improvements.

License

AuthenTick is open source and available under the MIT License.

Questions or Ideas

If you have questions, feature requests, or want to report security vulnerabilities, reach out through the GitHub repository or contact me directly.
