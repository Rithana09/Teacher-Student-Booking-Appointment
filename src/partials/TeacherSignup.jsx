import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Loader2, Mail, Lock, User, Phone, Book } from 'lucide-react';
import { Helmet } from "react-helmet";

export default function TeacherSignup() {
  const [formData, setFormData] = useState({
    salutation: 'Mr.',
    fullName: '',
    subject: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    department: '',
    empNo: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!formData.fullName.trim()) e.fullName = 'Full name is required';
    if (!formData.subject.trim()) e.subject = 'Subject is required';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Invalid email';
    if (!formData.password) e.password = 'Password is required';
    else if (formData.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) e.confirmPassword = 'Confirm your password';
    else if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!formData.mobile) e.mobile = 'Mobile is required';
    else if (!/^\d{10}$/.test(formData.mobile)) e.mobile = 'Mobile must be 10 digits';
    if (!formData.department.trim()) e.department = 'Department is required';
    if (!formData.empNo.trim()) e.empNo = 'Employee number is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

      const teacherData = {
        uid: cred.user.uid,
        role: 'teacher',
        ...formData,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'teachers', cred.user.uid), teacherData);
      await setDoc(doc(db, 'users', cred.user.uid), teacherData);

      alert('Teacher account created successfully!');
      navigate('/teacher/appointments');
    } catch (err) {
      console.error('Error creating account:', err);
      alert('Error creating account: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Hey Teacher | Teacher Registration</title>
        <meta name="description" content="Teacher signup page for Hey Teacher app" />
      </Helmet>

      {/* Background with overlay */}
      <div
        className="relative min-h-screen flex items-center justify-center bg-center bg-no-repeat p-4"
        style={{
          backgroundImage: `url('teacher5.jpg')`,
          backgroundSize: "100% auto"
        }}
      >

        {/* Signup card */}

        <div className="relative w-full max-w-md bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl p-8 hover:shadow-blue-300/50 transition-all duration-500">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-4 rounded-full shadow-lg">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mt-4 tracking-tight">
              Teacher Signup
            </h2>
            <p className="text-gray-600 text-sm text-center mt-1">
              Create your account to manage classes and appointments
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="flex flex-col gap-5">
            {/* Salutation + Full Name */}
            <div className="flex gap-2">
              <select
                name="salutation"
                value={formData.salutation}
                onChange={handleChange}
                className="border border-gray-300 px-3 py-2 rounded bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
              >
                <option value="Mr.">Mr.</option>
                <option value="Ms.">Ms.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Dr.">Dr.</option>
                <option value="Prof.">Prof.</option>
              </select>
              <div className="relative flex-1">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-900" />
                <input
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`pl-10 w-full px-4 py-3 bg-white/60 backdrop-blur-sm border rounded-lg focus:ring-2 focus:outline-none transition 
            ${errors.fullName ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"}`}
                />
              </div>
            </div>
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}

            {/* Employee Number */}
            <div className="relative">
              <Book className="absolute left-3 top-3 h-5 w-5 text-gray-900" />
              <input
                name="empNo"
                placeholder="Employee Number"
                value={formData.empNo}
                onChange={handleChange}
                className={`pl-10 w-full px-4 py-3 bg-white/60 backdrop-blur-sm border rounded-lg focus:ring-2 focus:outline-none transition 
          ${errors.empNo ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"}`}
              />
            </div>
            {errors.empNo && <p className="text-red-500 text-xs mt-1">{errors.empNo}</p>}

            {/* Subject */}
            <div className="relative">
              <Book className="absolute left-3 top-3 h-5 w-5 text-gray-900" />
              <input
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                className={`pl-10 w-full px-4 py-3 bg-white/60 backdrop-blur-sm border rounded-lg focus:ring-2 focus:outline-none transition 
          ${errors.subject ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"}`}
              />
            </div>
            {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-900" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={`pl-10 w-full px-4 py-3 bg-white/60 backdrop-blur-sm border rounded-lg focus:ring-2 focus:outline-none transition 
          ${errors.email ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"}`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-900" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`pl-10 w-full px-4 py-3 bg-white/60 backdrop-blur-sm border rounded-lg focus:ring-2 focus:outline-none transition 
          ${errors.password ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"}`}
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-900" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`pl-10 w-full px-4 py-3 bg-white/60 backdrop-blur-sm border rounded-lg focus:ring-2 focus:outline-none transition 
          ${errors.confirmPassword ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"}`}
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}

            {/* Mobile */}
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-900" />
              <input
                name="mobile"
                placeholder="Mobile Number"
                value={formData.mobile}
                onChange={handleChange}
                className={`pl-10 w-full px-4 py-3 bg-white/60 backdrop-blur-sm border rounded-lg focus:ring-2 focus:outline-none transition 
          ${errors.mobile ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"}`}
              />
            </div>
            {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}

            {/* Department */}
            <div className="relative">
              <Book className="absolute left-3 top-3 h-5 w-5 text-gray-900" />
              <input
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                className={`pl-10 w-full px-4 py-3 bg-white/60 backdrop-blur-sm border rounded-lg focus:ring-2 focus:outline-none transition 
          ${errors.department ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"}`}
              />
            </div>
            {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}

            {/* Signup Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 flex items-center cursor-pointer justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-indigo-300/50 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign Up"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
