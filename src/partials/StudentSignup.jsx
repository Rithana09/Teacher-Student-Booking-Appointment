import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Loader2 } from 'lucide-react';
import { User, Mail, Lock, Smartphone } from 'lucide-react';
import { Helmet } from "react-helmet";

export default function StudentSignup() {
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', confirmPassword: '', mobile: '', course: '', registerNo: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!formData.fullName.trim()) e.fullName = 'Full name is required';
    if (!formData.registerNo.trim()) e.registerNo = 'Register number is required';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Invalid email';
    if (!formData.password) e.password = 'Password is required';
    else if (formData.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) e.confirmPassword = 'Confirm your password';
    else if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!formData.mobile) e.mobile = 'Mobile is required';
    else if (!/^\d{10}$/.test(formData.mobile)) e.mobile = 'Mobile must be 10 digits';
    if (!formData.course) e.course = 'Please select a course';
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
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        role: 'student',
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        course: formData.course,
        registerNo: formData.registerNo,
        createdAt: new Date().toISOString()
      });
      alert('Student account created!');
      navigate('/appointment');
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Hey Teacher | Student Registration</title>
        <meta name="description" content="This is my page description" />
      </Helmet>

      {/* Background */}
      <div
  className="relative min-h-screen flex items-center justify-center bg-cover bg-center p-4"
  style={{
    backgroundImage: `url('teacher4.avif')`
  }}
>
        {/* Signup Card */}
       {/* Signup Card */}
<div className="relative w-full max-w-md bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl p-8 hover:shadow-blue-300/50 transition-all duration-500">
  {/* Logo */}
  <div className="flex flex-col items-center mb-6">
    <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-4 rounded-full shadow-lg">
      <GraduationCap className="h-8 w-8 text-white" />
    </div>
    <h2 className="text-3xl font-bold text-gray-900 mt-4 tracking-tight">
      Student Signup
    </h2>
    <p className="text-black text-sm text-center mt-1">
      Join today to book and manage your appointments with ease
    </p>
  </div>

  {/* Form */}
  <form onSubmit={handleSignup} className="flex flex-col gap-4">
    {/* Input Fields */}
    {[
      { icon: User, name: "fullName", placeholder: "Full Name", type: "text", error: errors.fullName },
      { icon: User, name: "registerNo", placeholder: "Register Number", type: "text", error: errors.registerNo },
      { icon: Mail, name: "email", placeholder: "Email", type: "email", error: errors.email },
      { icon: Lock, name: "password", placeholder: "Password", type: "password", error: errors.password },
      { icon: Lock, name: "confirmPassword", placeholder: "Confirm Password", type: "password", error: errors.confirmPassword },
      { icon: Smartphone, name: "mobile", placeholder: "Mobile Number", type: "text", error: errors.mobile },
    ].map((field, i) => (
      <div key={i} className="relative">
        <field.icon className="h-5 w-5 text-gray-700 absolute left-3 top-3" />
        <input
          type={field.type}
          name={field.name}
          placeholder={field.placeholder}
          value={formData[field.name]}
          onChange={handleChange}
          className={`pl-10 w-full  px-4 py-3 bg-white/10 border rounded-lg focus:ring-2 focus:outline-none transition backdrop-blur-sm 
            ${field.error ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"}`}
        />
        {field.error && <p className="text-red-500 text-xs mt-1">{field.error}</p>}
      </div>
    ))}

    {/* Course Select */}
    <select
      name="course"
      value={formData.course}
      onChange={handleChange}
      className="w-full px-4 py-3 bg-white/60 border rounded-lg text-gray-700 focus:ring-2 focus:outline-none focus:ring-blue-500 backdrop-blur-sm"
    >
      <option value="">Select Course</option>
      <option value="btech">B.Tech</option>
      <option value="bsc">B.Sc</option>
      <option value="bca">BCA</option>
      <option value="mba">MBA</option>
    </select>
    {errors.course && <p className="text-red-500 text-xs">{errors.course}</p>}

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
