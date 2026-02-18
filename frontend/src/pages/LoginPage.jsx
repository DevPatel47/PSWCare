import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      setErrorMessage('Email and password are required.');
      return;
    }

    const normalizedEmail = formData.email.toLowerCase();
    const guessedRole = normalizedEmail.includes('admin')
      ? 'Admin'
      : normalizedEmail.includes('psw')
        ? 'PSW'
        : 'Client';

    login({
      token: 'wireframe-token',
      user: {
        name: 'Wireframe User',
        email: normalizedEmail,
        role: guessedRole
      }
    });

    if (guessedRole === 'Admin') {
      navigate('/dashboard/admin');
      return;
    }

    if (guessedRole === 'PSW') {
      navigate('/dashboard/psw');
      return;
    }

    navigate('/dashboard/client');
  };

  return (
    <section>
      <h1>Login</h1>
      <p>Structure-only login page for Week 5 wireframe.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} />
        </div>
        <button type="submit">Login</button>
      </form>

      {errorMessage ? <p>{errorMessage}</p> : null}
    </section>
  );
}

export default LoginPage;
