import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../AuthContext";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";
import { Helmet } from "react-helmet";

export default function StudentStatus() {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "appointments"),
          where("studentId", "==", currentUser.uid)
        );

        const querySnapshot = await getDocs(q);
        const appts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAppointments(appts);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [currentUser]);

  if (!currentUser) return <p className="p-6">Please log in to see your appointments.</p>;
  if (loading) return <p className="p-6">Loading appointments...</p>;

  return (
    <div>
      <Helmet>
        <title>Hey Teacher | Student Status</title>
        <meta name="description" content="This is my page description" />
      </Helmet>

      <div
    className="relative min-h-screen flex items-start justify-center p-4 pt-20 bg-cover bg-center"
    style={{ backgroundImage: "url('/teacher6.avif')" }}
  >
    {/* Overlay for readability */}
    <div className="absolute inset-0 bg-black/20" />
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">My Appointment Status</h2>

        {appointments.length === 0 ? (
          <p className="text-gray-600">No appointments found.</p>
        ) : (
          <ul className="space-y-4">
            {appointments.map(appt => (
              <li key={appt.id} className="border rounded-lg p-4 shadow hover:shadow-lg transition bg-white">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-lg font-semibold">{appt.teacherName}</p>
                  <span className="text-sm text-gray-500">{new Date(appt.time).toLocaleString()}</span>
                </div>

                <div className="flex items-center space-x-2">
                  {appt.status === "approved" && (
                    <>
                      <FaCheckCircle className="text-green-600" />
                      <span className="text-green-600 font-medium">Approved</span>
                    </>
                  )}
                  {appt.status === "cancelled" && (
                    <>
                      <FaTimesCircle className="text-red-600" />
                      <span className="text-red-600 font-medium">Cancelled</span>
                    </>
                  )}
                  {appt.status === "pending" && (
                    <>
                      <FaHourglassHalf className="text-yellow-600" />
                      <span className="text-yellow-600 font-medium">Pending</span>
                    </>
                  )}
                </div>

                {appt.notes && (
                  <p className="mt-2 text-gray-700 italic">Notes: {appt.notes}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
    </div>
  );
}
