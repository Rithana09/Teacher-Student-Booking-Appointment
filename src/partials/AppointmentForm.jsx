import { useEffect, useState } from "react";
import { db, auth } from '../firebase';
import { collection, addDoc, onSnapshot, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { User, CalendarCheck } from 'lucide-react';
import { Loader2 } from 'lucide-react';

export default function AppointmentForm() {
  const [student, setStudent] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [teacherId, setTeacherId] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [loading, setLoading] = useState(false);

  // Track logged-in user
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setStudent(u));
    return () => unsub();
  }, []);

  // Load teacher list
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "teachers"), (snap) => {
      setTeachers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!student) return alert("Please login as a student.");
    if (!teacherId || !dateTime) return alert("Please select teacher and date/time.");

    const selectedTeacher = teachers.find(t => t.id === teacherId);
    if (!selectedTeacher) return alert("Selected teacher not found.");

    // Prevent past date selection
    if (new Date(dateTime) < new Date()) {
      return alert("Cannot select past date/time.");
    }

    setLoading(true);
    try {
      const studentDoc = await getDoc(doc(db, "users", student.uid));
      if (!studentDoc.exists()) {
        setLoading(false);
        return alert("Student profile not found.");
      }

      const studentData = studentDoc.data();
      await addDoc(collection(db, "appointments"), {
        studentId: student.uid,
        studentName: studentData.fullName || student.email,
        studentRegNo: studentData.registerNo,
        teacherId: selectedTeacher.id,
        teacherName: selectedTeacher.fullName,
        time: new Date(dateTime).toLocaleString(),
        status: "pending",
        createdAt: serverTimestamp()
      });

      alert("Appointment requested! (pending)");
      setTeacherId("");
      setDateTime("");
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div
    className="relative min-h-screen flex items-start justify-center p-4 pt-20 bg-cover bg-center"
    style={{ backgroundImage: "url('/teacher6.avif')" }}
  >
    {/* Overlay for readability */}
    <div className="absolute inset-0 bg-black/20" />

    {/* Form */}
    <form
      onSubmit={handleSubmit}
      className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-white/30 transition-transform transform hover:-translate-y-2"
    >
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Book an Appointment
      </h2>

      {/* Teacher Dropdown */}
      <div className="relative mb-6">
        <User className="absolute left-4 top-4 h-5 w-5 text-gray-500" />
        <select
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
          className="peer w-full pl-12 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition border-gray-300 bg-white/80 text-gray-700"
        >
          <option value="">Select Teacher</option>
          {teachers.length === 0 && <option disabled>No teachers available</option>}
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.salutation} {t.fullName}
            </option>
          ))}
        </select>
      </div>

      {/* Date Picker */}
      <div className="relative mb-6">
        <CalendarCheck className="absolute left-4 top-4 h-5 w-5 text-gray-500" />
        <input
          type="datetime-local"
          value={dateTime}
          min={new Date().toISOString().slice(0, 16)}
          onChange={(e) => setDateTime(e.target.value)}
          className="peer w-full pl-12 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition border-gray-300 bg-white/80 text-gray-700"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-1/2 flex cursor-pointer  items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-2xl font-semibold shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Book Appointment"}
      </button>
    </form>
  </div>
);

}
