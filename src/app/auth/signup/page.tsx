'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Signup.module.css';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      router.push('/auth/login');
    } else {
      setError(data.error || 'Signup failed');
    }
  }

  return (
    <form onSubmit={handleSignup} className={styles.formContainer}>
      <h2 className={styles.heading}>Sign Up</h2>
      {error && <p className={styles.errorText}>{error}</p>}

      <input
        type="text"
        placeholder="Name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={styles.inputField}
      />
      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.inputField}
      />
      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.inputField}
      />
      <input
        type="password"
        placeholder="Confirm password"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className={styles.inputField}
      />

      <button type="submit" className={styles.btnPrimary}>
        Sign Up
      </button>
      <button
        type="button"
        onClick={() => router.push('/auth/login')}
        className={styles.btnSecondary}
      >
        Login
      </button>
    </form>
  );
}
