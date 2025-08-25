import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import AppointmentCard from "../partials/AppointmentCard";
import { Helmet } from "react-helmet";
import { BookOpen } from "lucide-react"; // safe & available

export default function TeacherDashboard() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "appointments"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAppointments(data);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Hey Teacher | Teacher Dashboard</title>
        <meta name="description" content="This is my page description" />
      </Helmet>

      {/* Background with overlay */}
      <div
        className="min-h-screen bg-cover bg-center relative px-6 py-10"
        style={{
          backgroundImage: "url('/teacher3.jpg')", 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 to-white/90 backdrop-blur-sm"></div>

        {/* Header Section */}
        <div className="relative z-10 max-w-4xl mx-auto mb-10">
          <div className="flex items-center space-x-4">
            <div className="bg-green-600 p-4 rounded-full shadow-lg">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
                Teacher Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your appointments, confirm student bookings, and stay
                organized every day.
              </p>
            </div>
          </div>
        </div>

        {/* Appointment List */}
        <div className="relative z-10 max-w-3xl mx-auto bg-white/80 rounded-2xl shadow-lg p-6">
          {appointments.length === 0 ? (
            <p className="text-gray-600">No appointments found.</p>
          ) : (
            <div className="space-y-4">
              {appointments.map((appt) => (
                <AppointmentCard key={appt.id} {...appt} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
