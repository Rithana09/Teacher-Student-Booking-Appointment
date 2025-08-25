import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Users,
  BookOpen,
  Info,
  LogOut,
  User,
} from "lucide-react";
import { FaBars } from "react-icons/fa";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [userName, setUserName] = useState("");

  const menuRef = useRef(null);

  // ✅ Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const snap = await getDoc(doc(db, "users", u.uid));
        if (snap.exists()) {
          const userData = snap.data();
          setRole(userData.role);
          setUserName(userData.fullName || "User");
        } else {
          setRole(null);
          setUserName("");
        }
      } else {
        setRole(null);
        setUserName("");
      }
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setIsOpen(false);
  };

  return (
    <nav className="bg-blue-900 p-4 text-white w-full shadow-md z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-1">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <GraduationCap className="h-7 w-7 text-white" />
          <span className="text-xl md:text-2xl font-bold">HeyTeacher</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 items-center">
          {!user ? (
            <>
              <Link
                to="/student"
                className="flex items-center space-x-1 hover:text-blue-100 transition"
              >
                <Users className="h-5 w-5" />
                <span>Student</span>
              </Link>
              <Link
                to="/tloginin"
                className="flex items-center space-x-1 hover:text-blue-100 transition"
              >
                <BookOpen className="h-5 w-5" />
                <span>Teacher</span>
              </Link>
            </>
          ) : (
            <div className="flex items-center space-x-5">
              {role === "student" && (
                <Link
                  to="/student/status"
                  className="flex items-center bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
                >
                  <Info className="h-5 w-5 mr-1" /> Check Status
                </Link>
              )}
              {role === "teacher" && (
                <Link
                  to="/teacher/appointments"
                  className="flex items-center bg-purple-500 text-white px-3 py-1 rounded-lg hover:bg-purple-600 transition"
                >
                  <BookOpen className="h-5 w-5 mr-1" /> Manage Appointments
                </Link>
              )}
              <span className="flex items-center text-white font-medium">
                <User className="h-5 w-5 mr-2" /> {userName}
              </span>
              <Link to="/" onClick={handleLogout}>
                <button className="flex items-center cursor-pointer bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition">
                  <LogOut className="h-5 w-5 mr-1" /> Logout
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden relative" ref={menuRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none text-2xl"
          >
            <FaBars />
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-lg p-2 space-y-2 border border-gray-100 z-50">
              {!user ? (
                <>
                  <Link
                    to="/student"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-md"
                  >
                    <Users className="h-5 w-5" />
                    <span>Student</span>
                  </Link>
                  <Link
                    to="/tloginin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-md"
                  >
                    <BookOpen className="h-5 w-5" />
                    <span>Teacher</span>
                  </Link>
                </>
              ) : (
                <>
                  <div className="px-4 py-2 border-b border-gray-200">
                    <span className="flex items-center">
                      <User className="h-5 w-5 mr-2" /> {userName}
                    </span>
                  </div>
                  {role === "student" && (
                    <Link
                      to="/student/status"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-md"
                    >
                      <Info className="h-5 w-5 mr-2" /> Check Status
                    </Link>
                  )}
                  {role === "teacher" && (
                    <Link
                      to="/teacher/appointments"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-md"
                    >
                      <BookOpen className="h-5 w-5 mr-2" /> Manage Appointments
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 rounded-md"
                  >
                    <LogOut className="h-5 w-5 mr-2" /> Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
