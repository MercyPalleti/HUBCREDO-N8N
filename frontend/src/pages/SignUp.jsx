import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { saveToken } from "../utils/auth";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";


export default function SignUp(){
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [err,setErr] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");
      saveToken(data.token);
      nav("/dashboard");
    } catch (err) {
      setErr(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl mb-4">Sign up</h2>
        {err && <div className="text-red-600 mb-2">{err}</div>}
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border mb-3" />
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full p-2 border mb-3" />
        <button className="w-full py-2 bg-blue-600 text-white rounded">Create account</button>
        <p className="mt-3 text-sm">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
      </form>
    </div>
  );
}
