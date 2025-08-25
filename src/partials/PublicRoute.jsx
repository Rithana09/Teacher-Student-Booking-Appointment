import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function PublicRoute({ children, redirectTo = "/" }) {
  const [state, setState] = useState({ loading: true, loggedIn: false });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setState({ loading: false, loggedIn: !!u });
    });
    return () => unsub();
  }, []);

  if (state.loading) return <div className="p-6">Checking access…</div>;

  if (state.loggedIn) return <Navigate to={redirectTo} replace />;

  return children;
}
