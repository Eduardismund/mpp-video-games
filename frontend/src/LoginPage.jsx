import React, {useEffect, useState} from 'react';
import {navigate} from "jsdom/lib/jsdom/living/window/navigation.js"; // Assuming you're using react-router

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [step, setStep] = useState(1);
  const [validationCode, setValidationCode] = useState('');
  const [token, setToken] = useState('');
  const [qrSrc, setQrSrc] = useState(null);

  useEffect(() => {
    const fetchQR = async () => {
      if (token && step === 3) {
        const res = await fetch(`/api/login/mfa-setup/qr`, {
          method: 'POST',
          headers: {'Content-type': 'application/json'},
          body: JSON.stringify({
            token,
          }),
        });
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setQrSrc(url);
      }

    };
    fetchQR();
  }, [token, step]);


  function onLoginSuccess(token, role) {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('role', role);
    setMessage('You are now logged in!');
    setMessageType('success');
    navigate('/home');
  }

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setMessage('Please fill in both fields.');
      setMessageType('error');
      return;
    }

    try {
      const res = await fetch('/api/login/step1', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const {nextStep} = data
        if (nextStep === "SETUP_MFA") {
          setStep(3)
          setToken(data?.token)
          console.log(token)

        } else if (nextStep === "NONE") {
          onLoginSuccess(data?.token, data?.role)
        } else {
          setToken(data?.token)
          setStep(2)
        }

      } else {
        setMessage('Invalid user or password');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Login failed.');
      setMessageType('error');
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    if (!validationCode) {
      setMessage('Please fill in validation field.');
      setMessageType('error');
      return;
    }

    try {
      const res = await fetch('/api/login/step2', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
          validationCode,
          token,
        }),
      });

      if (res.ok) {
        const data = await res.json();

        const {nextStep} = data
        if (nextStep === "NONE") {
          onLoginSuccess(data?.token, data?.role)
        } else {
          setMessage('The validation code is not correct');
          setMessageType('error');
        }

      } else {
        setMessage('Invalid validation code');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Validation failed.');
      setMessageType('error');
    }
  };

  return (
    step === 1 ?
      <div>
        <h2>Login</h2>
        <form onSubmit={handleStep1Submit}>
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
      </div> :
      step === 2 ?
        <div>
          <h2>Login</h2>
          <form onSubmit={handleStep2Submit}>
            <input
              type="text"
              placeholder="Validation Code"
              value={validationCode}
              onChange={(e) => setValidationCode(e.target.value)}
            />
            {message && <div className={messageType}>{message}</div>}
            <button type="submit">Log In</button>
          </form>
        </div> :
        <div>
          <div>
            <h2>Set up MFA</h2>
            <div>
            Step 1: Scan the QR code below:
            </div>
            <img src={qrSrc} alt={"QR CODE"}/>
            <div>
              Step 2: Set up with your application of choice: (Microsoft Authenticator, Google authenticator, etc.)
            </div>
            <div>
              Step 3: Enter the generated OTP
            </div>
            <form onSubmit={handleStep2Submit}>
              <input
                type="text"
                placeholder="Validation Code"
                value={validationCode}
                onChange={(e) => setValidationCode(e.target.value)}
              />
              {message && <div className={messageType}>{message}</div>}
              <button type="submit">Send</button>
            </form>
          </div>

        </div>

  );
}
