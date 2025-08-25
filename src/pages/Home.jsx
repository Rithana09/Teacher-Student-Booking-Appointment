import { FaCalendarAlt, FaChalkboardTeacher, FaBell, FaUserGraduate } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { Helmet } from "react-helmet";

export default function Home() {
  return (
    <div>
      <Helmet>
        <title>Hey Teacher | Home</title>
        <meta name="description" content="This is my page description" />
      </Helmet>

      {/* Background image container */}
      <div
        className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-cover bg-center"
        style={{
          backgroundImage: "url('/teacher1.jpg')", 
        }}
      >
        {/* White overlay */}
        <div className="bg-white/12
        
        0 rounded-2xl p-10 shadow-lg max-w-5xl w-full">
          {/* Hero Section */}
          <div className="max-w-3xl text-center mx-auto">
            <h1 className="text-3xl md:text-5xl font-semibold text-gray-900 mb-4">
              Welcome to <span className="text-blue-900">HeyTeacher</span>
            </h1>
           <p className="text-white text-base md:text-lg mb-6 leading-relaxed drop-shadow-lg">
  Your smart platform to seamlessly book and manage appointments between{" "}
  <span className="font-medium text-gray-200">students</span> and{" "}
  <span className="font-medium text-gray-200">teachers</span>.
</p>


          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto my-10">
            <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
              <FaCalendarAlt className="text-blue-600 text-4xl mb-3" />
              <h3 className="text-lg font-semibold mb-2">Easy Scheduling</h3>
              <p className="text-gray-500 text-sm">
                Students can book appointments with just a few clicks.
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
              <MdOutlineDashboard className="text-green-600 text-4xl mb-3" />
              <h3 className="text-lg font-semibold mb-2">Teacher Dashboard</h3>
              <p className="text-gray-500 text-sm">
                Teachers can manage availability and confirm bookings.
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
              <FaBell className="text-purple-600 text-4xl mb-3" />
              <h3 className="text-lg font-semibold mb-2">Instant Notifications</h3>
              <p className="text-gray-500 text-sm">
                Stay updated with reminders and alerts for appointments.
              </p>
            </div>
          </div>

          {/* Portals */}
          <div className="flex flex-col md:flex-row gap-6 mt-6 justify-center">
            <a
              href="/student"
              className="flex flex-col items-center justify-center bg-blue-600 text-white px-8 py-6 rounded-2xl shadow-lg hover:bg-blue-700 transition w-60"
            >
              <FaUserGraduate className="text-4xl mb-2" />
              <span className="text-lg font-bold">Student Portal</span>
              <p className="text-sm text-white/80 mt-1">
                Book appointments easily
              </p>
            </a>
            <a
              href="/tloginin"
              className="flex flex-col items-center justify-center bg-green-600 text-white px-8 py-6 rounded-2xl shadow-lg hover:bg-green-700 transition w-60"
            >
              <FaChalkboardTeacher className="text-4xl mb-2" />
              <span className="text-lg font-bold">Teacher Portal</span>
              <p className="text-sm text-white/80 mt-1">
                Manage bookings efficiently
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
