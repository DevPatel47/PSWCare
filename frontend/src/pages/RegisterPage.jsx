import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import useAuth from "../hooks/useAuth";

function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get("role") || "client";
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: defaultRole,
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      const user = await register(formData);
      navigate(`/dashboard/${user.role}`);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
      <Card className="mx-auto w-full max-w-md">
        <h1>Create Account</h1>
        <p className="mt-2 text-sm text-slate-600">
          Set up your role-based account in minutes.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input
            id="name"
            name="name"
            label="Name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            id="email"
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <label htmlFor="role">
            <span className="ui-label">Role</span>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="ui-input"
            >
              <option value="client">Client</option>
              <option value="psw">PSW</option>
            </select>
          </label>
          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="text-saas-primary hover:underline">
            Login
          </Link>
        </p>

        {errorMessage ? (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}
      </Card>
    </section>
  );
}

export default RegisterPage;
