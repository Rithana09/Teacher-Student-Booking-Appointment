import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot, doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../AuthContext";
import { Helmet } from "react-helmet";


export default function ManageAppointments() {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, "appointments"), where("teacherId", "==", currentUser.uid));

    const unsub = onSnapshot(q, async (snapshot) => {
      const appts = await Promise.all(
        snapshot.docs.map(async (d) => {
          const data = d.data();
          let studentDetails = {};

          if (data.studentId) {
            const studentSnap = await getDoc(doc(db, "users", data.studentId));
            if (studentSnap.exists()) studentDetails = studentSnap.data();
          }

          return {
            id: d.id,
            ...data,
            student: studentDetails,
          };
        })
      );

      setAppointments(appts);
      setLoading(false);
    });

    return () => unsub();
  }, [currentUser]);

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    setUpdating(appointmentId);
    try {
      const appointmentRef = doc(db, "appointments", appointmentId);
      await updateDoc(appointmentRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating appointment status:", error);
      alert("Failed to update appointment status");
    } finally {
      setUpdating(null);
    }
  };

  if (!currentUser)
    return <p className="p-6 text-center text-gray-500">Please log in to see your appointments.</p>;
  if (loading) return <p className="p-6 text-center text-gray-500">Loading appointments...</p>;

  return (
    
    <div>
      <Helmet>
        <title>Hey Teacher | Manage Appointments</title>
        <meta name="description" content="This is my page description" />
      </Helmet>
      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Manage Appointments</h2>

        {appointments.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">No appointments available.</p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {appointments.map((appt) => (
              <li
                key={appt.id}
                className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-400">
                    {appt.time ? new Date(appt.time).toLocaleString() : "No date"}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${appt.status === "approved"
                        ? "bg-gray-100 text-gray-800"
                        : appt.status === "cancelled"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-gray-50 text-gray-700"
                      }`}
                  >
                    {appt.status.toUpperCase()}
                  </span>
                </div>

                {/* Student Info */}
                <div className="text-gray-700 mb-4 space-y-1">
                  <p>
                    <span className="font-semibold">Student:</span> {appt.student?.fullName || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span> {appt.student?.email || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Reg No:</span> {appt.student?.registerNo || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Course:</span> {appt.student?.course || "N/A"}
                  </p>
                </div>

                {/* Action Buttons */}
                {appt.status === "pending" && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => updateAppointmentStatus(appt.id, "approved")}
                      disabled={updating === appt.id}
                      className="flex-1 px-4 py-2 bg-gray-800 cursor-pointer hover:bg-gray-900 text-white rounded-xl shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {updating === appt.id ? "Updating..." : "Approve"}
                    </button>
                    <button
                      onClick={() => updateAppointmentStatus(appt.id, "cancelled")}
                      disabled={updating === appt.id}
                      className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 cursor-pointer text-gray-800 rounded-xl shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {updating === appt.id ? "Updating..." : "Cancel"}
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
