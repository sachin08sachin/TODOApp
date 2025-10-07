"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }), 
    });

    const data = await res.json();
    if (res.ok) {
      router.push("/auth/login");
    } else {
      setError(data.error || "Signup failed");
    }
  }

  return (
    <form onSubmit={handleSignup} className="max-w-md mx-auto mt-10 p-4 border rounded space-y-4">
      <h2 className="text-2xl mb-4">Sign Up</h2>
      {error && <p className="text-red-600">{error}</p>}

      <input
        type="text"
        placeholder="Name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <input
        type="password"
        placeholder="Confirm password"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Sign Up
      </button>

      {/* Login Button below Signup */}
      <button 
        type="button" 
        onClick={() => router.push("/auth/login")}
        className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Login
      </button>
    </form>
  );
}
