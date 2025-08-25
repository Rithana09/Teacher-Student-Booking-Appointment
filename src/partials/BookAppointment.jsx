import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { Helmet } from "react-helmet";

export default function BookAppointment() {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [date, setDate] = useState("");

  // Fetch teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      const querySnapshot = await getDocs(collection(db, "teachers"));
      const teacherList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeachers(teacherList);
    };
    fetchTeachers();
  }, []);

  // Save booking
  const handleBook = async () => {
    if (!selectedTeacher || !date) {
      alert("Please select teacher and date");
      return;
    }

    try {
      await addDoc(collection(db, "appointments"), {
        teacher: selectedTeacher,
        date: date,
        createdAt: new Date(),
      });

      alert("Appointment booked successfully!");
      setSelectedTeacher("");
      setDate("");
    } catch (err) {
      console.error("Error booking appointment:", err);
      alert("Failed to book appointment");
    }
  };

  return (
    <div><Helmet>
      <title>Hey Teacher | Book Appointment</title>
      <meta name="description" content="This is my page description" />
    </Helmet>
      <div className="flex justify-center mt-20">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
          <h2 className="text-xl font-bold mb-4">Book an Appointment</h2>

          {/* Dropdown Teachers */}
          <select
            className="border rounded p-2 w-full mb-4"
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
          >
            <option value="">Select Teacher</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>

          {/* Date Picker */}
          <input
            type="datetime-local"
            className="border rounded p-2 w-full mb-4"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          {/* Submit */}
          <button
            onClick={handleBook}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}
