# 🏥 DoctorCare - Doctor Appointment Booking System

DoctorCare is a full-stack doctor appointment booking application built using the MERN stack. It allows patients to register and securely log in, manage their profiles, browse available doctors, book appointments, upload medical reports, and view their appointment history.

The application follows a modern client-server architecture with React on the frontend and Node.js/Express on the backend.

---

## 🌐 Live Application

### Frontend
https://doctorcare-eosin-six.vercel.app/

### Backend API
https://doctorcare-mtdf.onrender.com/

---

## ✨ Features

### 🔐 Authentication

- Patient registration
- Secure login
- JWT-based authentication
- Password hashing using bcrypt
- Protected frontend routes
- Protected backend APIs
- Persistent login session
- Logout functionality

### 👤 Patient Profile

- View patient information
- Update profile details
- Update phone number
- Update date of birth
- Update gender
- Update address
- Upload profile picture
- Cloudinary image storage

### 👨‍⚕️ Doctors

- View available doctors
- Doctor specialization
- Qualification
- Experience
- Consultation fee
- Available days
- Available timings
- Doctor details

### 📅 Appointment Booking

- Select doctor
- Select appointment date
- Select appointment time
- Select doctor type
- Add comments
- Upload medical reports
- Store appointment information in MongoDB
- Appointment status management

### 📋 My Appointments

- View booked appointments
- View doctor information
- View appointment date and time
- View appointment status
- View medical reports
- Filter appointments by year
- Cancel appointments

### 🏥 Services

- View available medical services
- Services retrieved from the backend API

### 📱 Responsive Design

- Responsive dashboard
- Mobile-friendly navigation
- Hamburger menu
- Responsive cards
- Responsive forms
- Tailwind CSS based UI

### ☁️ File Uploads

Cloudinary is used for storing:

- Patient profile pictures
- Medical reports

---

## 🛠️ Technologies Used

### Frontend

- React.js
- Vite
- React Router DOM
- Redux Toolkit
- React Redux
- Axios
- Tailwind CSS
- React Icons
- React Hot Toast

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer
- Cloudinary
- CORS
- dotenv

### Testing

- Vitest
- React Testing Library
- jsdom
- User Event

### Deployment

- Vercel - Frontend
- Render - Backend
- MongoDB Atlas - Database
- Cloudinary - File Storage

---

## 🏗️ Application Architecture

`text
                    ┌───────────────────┐
                    │      Patient      │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │ React + Vite      │
                    │ Redux Toolkit     │
                    │ Tailwind CSS      │
                    └─────────┬─────────┘
                              │
                            Axios
                              │
                              ▼
                    ┌───────────────────┐
                    │ Express.js API    │
                    │ JWT Authentication│
                    └───────┬─────┬─────┘
                            │     │
                ┌───────────┘     └───────────┐
                ▼                              ▼
       ┌────────────────┐             ┌────────────────┐
       │ MongoDB Atlas  │             │   Cloudinary   │
       │                │             │                │
       │ Users          │             │ Profile Images │
       │ Doctors        │             │ Medical Reports│
       │ Appointments   │             │                │
       │ Services       │             └────────────────┘
       └────────────────┘


## 📁 Project Structure

`text
doctor-appointment/
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── redux/
│       ├── routes/
│       ├── services/
│       └── utils/
│
└── server/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── uploads/
    └── server.js

## 🔐 Authentication
- User registration with validation
- Secure password hashing
- JWT-based authentication
- Protected routes
- Session verification
- Logout functionality
## 📅 Appointment System
- Patients can:
- Select a doctor
- Choose appointment date and time
- Select doctor type
- Add comments
- Upload medical reports
- View appointments
- Cancel appointments
## ☁️ Cloudinary
- Cloudinary is used to store:
- Profile pictures
- Medical reports
## 🧪 Testing
- The project includes testing using Vitest and React Testing Library.
- 
###29/29 tests passed successfully.
## 🌐 Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- File Storage: Cloudinary
## ▶️ Run Locally
### Clone the repository
- git clone https://github.com/ujjvalpandeytech/doctorcare.git
- cd doctor-appointment
### Frontend
- cd client
- npm install
- npm run dev
### Backend
- Open another terminal:
- cd server
- npm install
- npm run dev
- Create a .env file inside the server folder and add your MongoDB, JWT, and Cloudinary credentials.
    

## 👨‍💻 Author
   -- Ujjval Pandey
   -- MSc Computer Science Student
   -- MERN Stack Developer
