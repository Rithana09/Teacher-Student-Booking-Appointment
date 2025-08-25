#  Teacher–Student Appointment Booking System

This is a React + Firebase application that allows **students to book appointments with teachers**, and **teachers to manage their appointments**.  

It’s built for simplicity and usability — authentication is handled with **Firebase**, appointment details are stored in **Firestore**, and the UI is designed using **Tailwind CSS**.

---

##  Features

- 👩 **Teacher Module**
  - Teacher signup/login with Firebase Authentication
  - Manage profile and availability
  - View all student appointment requests
  - Approve/Reject bookings

- 🧑 **Student Module**
  - Student signup/login
  - Book an appointment with a teacher
  - View booked appointments
  - Cancel an appointment

-  **Authentication**
  - Firebase Email/Password authentication
  - Context-based Auth handling

-  **Appointments**
  - Real-time database (Firestore) for storing bookings
  - Teachers and Students see only their own related bookings

-  **UI/UX**
  - TailwindCSS for responsive design
  - Background images + overlays for better look
  - React Helmet for SEO-friendly meta tags

---

##  Tech Stack

- **Frontend:** React + Vite  
- **Styling:** Tailwind CSS  
- **Routing:** React Router  
- **Auth & Database:** Firebase (Auth + Firestore)  
- **Icons:** Lucide React  
- **SEO:** React Helmet  

---

## Project Structure
src/
├── partials/ # Reusable components (Header, Forms, Buttons, etc.)
├── pages/ # Pages for Teachers/Students
│ ├── TeacherSignup.jsx
│ ├── TeacherLogin.jsx
│ ├── StudentSignup.jsx
│ ├── StudentLogin.jsx
│ ├── ManageAppointments.jsx
│ ├── Dashboard.jsx
├── firebase.js # Firebase config
├── AuthContext.js # Auth provider (manages current user state)
└── App.jsx # Main app with routes



