# 🚛 FleetLink – Logistics Vehicle Booking System

FleetLink is a full‑stack platform that lets you add transport vehicles,  
search by capacity & route, and book them with real‑time availability checks.

---

## 📦 Tech Stack

- **Frontend:** React + Vite + Axios + CSS  
- **Backend:** Node.js + Express + Mongoose  
- **Database:** MongoDB Atlas  
- **Hosting:** Vercel (frontend) + Render (backend)

---

## 🚀 Live Demo

- **Frontend:** https://fleetlink.vercel.app  
- **Backend API:** https://YOUR_BACKEND_NAME.onrender.com

---

## 🔑 Features

1. **Add Vehicle**
   - Name, Capacity (kg), Tyres  
   - Saved to MongoDB

2. **Search Available Vehicles**  
   - Filter by capacity ≥ required  
   - Filter by route (from/to pincodes)  
   - Filter by desired start time  
   - Shows “Book Now” for available; shows next available time otherwise

3. **Book Vehicle**  
   - Re‑checks availability (prevents race conditions)  
   - Saves booking with start & computed end time

---

## 🗂 Folder Structure

fleetlink/
├── backend/
│ ├── models/
│ │ ├── Vehicle.js
│ │ └── Booking.js
│ ├── routes/
│ │ ├── vehicles.js
│ │ └── bookings.js
│ ├── server.js
│ └── .env # Contains MONGO_URI
└── frontend/
├── public/
│ └── index.html
├── src/
│ ├── components/
│ │ ├── AddVehicle.jsx
│ │ └── SearchBook.jsx
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css
├── package.json
└── vite.config.js




---

## ⚙️ Quick Start (Local)

### 1. Backend

```bash
cd backend
cp .env.example .env
# edit .env → add your MongoDB Atlas URI
npm install
npm run dev     # or: node server.js
2. Frontend
bash
Copy
Edit
cd frontend
npm install
npm run dev     # launches http://localhost:5173
🔗 API Reference
1. Add Vehicle
POST /api/vehicles
Body (JSON):

json
Copy
Edit
{ "name": "Tata Ace", "capacityKg": 500, "tyres": 4 }
2. Search Available
GET /api/vehicles/available
Query Params:

makefile
Copy
Edit
?capacityRequired=500
&fromPincode=400001
&toPincode=400021
&startTime=2025-06-22T10:00:00
Response:

json
Copy
Edit
{
  "vehicles": [
    { "_id":"…","name":"…","capacityKg":…,"tyres":…,"available":true },
    { "_id":"…","name":"…","capacityKg":…,"tyres":…,"available":false,"nextAvailableTime":"…"}
  ],
  "estimatedRideDurationHours": 2
}
3. Book Vehicle
POST /api/bookings
Body (JSON):

json
Copy
Edit
{
  "vehicleId":"…",
  "fromPincode":"400001",
  "toPincode":"400021",
  "startTime":"2025-06-22T10:00:00",
  "customerId":"test-customer-123"
}
📄 Sample Vehicles to Add
Name	Capacity (kg)	Tyres
Tata Ace	500	4
Mini Truck	750	4
Mahindra Bolero	1000	6
Loader Rickshaw	300	3
Dumper Truck	3000	10

📍 Sample Pincodes
From	To	Notes
400001	400021	Mumbai area
411001	412105	Pune area

