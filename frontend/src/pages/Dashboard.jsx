import React, { useEffect, useState } from "react";
import { getToken, removeToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Dashboard(){
  const nav = useNavigate();
  const [user,setUser] = useState(null);
  const [err,setErr] = useState("");

  useEffect(() => {
    async function fetchMe(){
      try {
        const token = getToken();
        if (!token) return nav("/login");
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed");
        setUser(data.user);
      } catch (err) {
        setErr(err.message);
        removeToken();
        nav("/login");
      }
    }
    fetchMe();
  }, []);

  const logout = () => {
    removeToken();
    nav("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded shadow w-full max-w-lg text-center">
        <h2 className="text-xl mb-3">Dashboard</h2>
        {err && <div className="text-red-600 mb-2">{err}</div>}
        {user ? <p>Signed in as <strong>{user.email}</strong></p> : <p>Loading...</p>}
        <button onClick={logout} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">Logout</button>
      </div>
    </div>
  );
}
