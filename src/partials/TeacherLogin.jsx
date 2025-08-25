import React, { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, User } from "lucide-react";
import { Helmet } from "react-helmet";

export default function TeacherLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Email is invalid";
    if (!password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists() || snap.data().role !== "teacher") {
        await signOut(auth);
        alert("Not a teacher account.");
        return;
      }
      navigate("/teacher/appointments");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const goToSignup = () => navigate("/tsignup");

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center px-4"
      style={{
        backgroundImage: "url('/teacher3.jpg')",
      }}
    >
      <Helmet>
        <title>Hey Teacher | Teacher Login</title>
        <meta name="description" content="Teacher login page" />
      </Helmet>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60"></div>

      {/* Centered Content */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col md:flex-row items-center md:items-start gap-10">
        
        {/* Left Side Text */}
        <div className="text-white max-w-md">
          <h1 className="text-4xl font-extrabold mb-4">Welcome Back, Teacher!</h1>
          <p className="text-lg opacity-90">
            Log in to manage your student appointments, confirm bookings, 
            and stay organized with ease.
          </p>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-md bg-white/50 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-white/30 md:ml-10">
    <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
      Teacher Login
    </h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            {/* Email Input */}
            <div className="relative">
              <User className="absolute left-4 top-4 h-5 w-5 text-gray-500" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700 transition ${errors.email ? "border-red-500 focus:ring-red-400" : ""}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-12 pr-12 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700 transition ${errors.password ? "border-red-500 focus:ring-red-400" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500
               to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-2xl
                cursor-pointer font-semibold shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Login"}
            </button>

            {/* Signup Link */}
            <p className="text-center text-sm mt-4 text-gray-700">
              Don’t have an account?{" "}
              <button
                onClick={goToSignup}
                className="text-blue-600 hover:underline font-medium cursor-pointer"
              >
                Sign Up
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
