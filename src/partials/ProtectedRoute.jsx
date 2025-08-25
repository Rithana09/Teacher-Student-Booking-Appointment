import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function ProtectedRoute({ children, requiredRole }) {
  const [state, setState] = useState({ loading: true, allowed: false, user: null });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setState({ loading: false, allowed: false, user: null });
        return;
      }

      if (!requiredRole) {
        setState({ loading: false, allowed: true, user: u });
        return;
      }

      const snap = await getDoc(doc(db, "users", u.uid));
      const role = snap.exists() ? snap.data().role : null;
      setState({ loading: false, allowed: role === requiredRole, user: u });
    });

    return () => unsub();
  }, [requiredRole]);

  if (state.loading) return <div className="p-6">Checking access…</div>;

  if (!state.user) return <Navigate to="/login" replace />;   // Not logged in
  if (!state.allowed) return <Navigate to="/unauthorized" replace />; // Wrong role

  return children;
}
