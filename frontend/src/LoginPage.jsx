import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {navigate} from "jsdom/lib/jsdom/living/window/navigation.js"; // Assuming you're using react-router

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setMessage('Please fill in both fields.');
      setMessageType('error');
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        sessionStorage.setItem('token', data?.token);
        sessionStorage.setItem('role', data?.role);
        setMessage('You are now logged in!');
        setMessageType('success');

        // Optionally redirect to home or dashboard
        navigate('/home'); // Adjust route as needed
      } else {
        setMessage('Invalid user or password');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Login failed.');
      setMessageType('error');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {message && <div className={messageType}>{message}</div>}
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}
