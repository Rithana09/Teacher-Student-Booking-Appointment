import StudentLogin from "../partials/StudentLogin";
import { GraduationCap } from "lucide-react";
import { Helmet } from "react-helmet";

export default function StudentDashboard() {
  return (
    <div>
      <Helmet>
        <title>Hey Teacher | Student Dashboard</title>
        <meta name="description" content="This is my page description" />
      </Helmet>

      {/* Background image container */}
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: "url('/teacher2.jpg')", 
        }}
      >
        {/* Optional overlay to soften background */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>

        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 z-0"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 z-0"></div>

        {/* Header */}
        <div className="relative z-10 flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-4 rounded-full shadow-lg">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mt-5 text-center">
            Welcome to Your Student Dashboard
          </h1>
          <p className="mt-2 text-black text-center max-w-md">
            Seamlessly book and manage your appointments with teachers. Stay updated and never miss a session!
          </p>
        </div>

        {/* Login / Card */}
        <div className="w-full max-w-md relative z-10">
          <StudentLogin />
        </div>
      </div>
    </div>
  );
}
