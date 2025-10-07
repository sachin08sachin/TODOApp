'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.ok) {
      window.location.href = '/';
    } else {
      setError('Invalid credentials');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors">
      <form
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm space-y-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-gray-100">
          Login
        </h2>

        {error && (
          <div className="text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400 p-2 rounded mb-4">
            {error}
          </div>
        )}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500
             bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500
               bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          required
        />

        <button
          type="submit"
          className="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition"
        >
          Login
        </button>

        <button
          type="button"
          className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
          onClick={() => router.push('/auth/signup')}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
