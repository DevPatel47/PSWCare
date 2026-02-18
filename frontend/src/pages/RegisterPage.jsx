import { useState } from 'react';

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Client'
  });

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // This is intentionally layout-only for Week 5.
    alert('Wireframe form submitted. API integration is next phase.');
  };

  return (
    <section>
      <h1>Register</h1>
      <p>Structure-only registration page for Week 5 wireframe.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="role">Role</label>
          <select id="role" name="role" value={formData.role} onChange={handleChange}>
            <option value="Client">Client</option>
            <option value="PSW">PSW</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
    </section>
  );
}

export default RegisterPage;
