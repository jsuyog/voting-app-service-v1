🗳️ Voting Room Web Application

A real-time web-based voting platform that allows users to create private voting rooms, invite participants, collect votes securely, and display results. Built using React and Firebase with authentication, image uploads, and controlled voting logic.

📌 Features

Google Authentication using Firebase

Unique username management

Dashboard for navigation

Create private voting rooms

Upload candidate images

Minimum 2 and maximum 3 candidates

Auto-generated Room ID

One vote per user

Owner cannot vote in own room

Manual room closing by owner

Winner calculation

Results dashboard

Real-time Firestore updates

Secure voting logic

Responsive UI

🛠️ Tech Stack
Frontend

React.js

JavaScript (ES6)

HTML5 / CSS3

Backend (Serverless)

Firebase Authentication

Firebase Firestore

Firebase Storage

Cloud / DevOps

Firebase Platform

GitHub

Docker (used for backend experiments)

📂 Project Structure
voting-room-app/
│
├── src/
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Username.js
│   │   ├── Dashboard.js
│   │   ├── CreateRoom.js
│   │   ├── VoteRoom.js
│   │   └── Results.js
│   │
│   ├── firebase.js
│   ├── App.js
│   └── index.js
│
├── public/
└── README.md

🚀 Application Flow

User logs in using Google authentication.

User selects or creates a unique username.

Dashboard provides options:

Create Room

Vote for Room

View Results

Room owner uploads 2–3 candidates with images.

System generates a unique Room ID.

Owner shares Room ID with participants.

Participants enter Room ID and vote.

Each user can vote only once.

Owner cannot vote.

Owner manually ends voting.

System calculates the winner.

Results are displayed publicly.

⚙️ Setup Instructions
1️⃣ Clone Repository
git clone https://github.com/<your-username>/voting-room-app.git
cd voting-room-app

2️⃣ Install Dependencies
npm install

3️⃣ Configure Firebase

Create src/firebase.js:

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


Enable in Firebase Console:

Authentication → Google Provider

Firestore Database

Storage

4️⃣ Run Application
npm start


Open in browser:

http://localhost:3000

📊 Firestore Database Structure
users/{uid}
{
  "username": "asdsada",
  "email": "user@gmail.com"
}

rooms/{roomId}
{
  "roomId": "1234",
  "ownerUid": "uid123",
  "ownerName": "asdsad",
  "candidates": [
    {
      "name": "Tom",
      "image": "url",
      "votes": 2
    }
  ],
  "voters": ["uid1", "uid2"],
  "status": "closed",
  "winner": "Tom",
  "createdAt": "timestamp",
  "endedAt": "timestamp"
}

🔐 Security Design

Only authenticated users can access data

Owner cannot vote

Users can vote only once

Voting is blocked after room closure

Firestore rules prevent unauthorized writes

Images secured using Firebase Storage rules

📈 DevOps & Reliability Practices

Stateless frontend

Serverless backend

Environment-based configuration

Secure secrets handling

Modular architecture

Docker-based backend experiments

Indexing for Firestore queries

Health monitoring via Firebase console

🧪 Testing

Manual testing performed for:

Login and logout

Username creation

Room creation

Image uploads

Voting restrictions

Concurrent voting

Result calculation

Multi-user sessions

Error handling

🌱 Future Enhancements

Python FastAPI backend

PostgreSQL database

Redis caching

Kubernetes deployment

Prometheus monitoring

CI/CD pipeline

Rate limiting

Load testing

QR-based room sharing

👨‍💻 Author

Suyog
Cloud / SRE Engineer
