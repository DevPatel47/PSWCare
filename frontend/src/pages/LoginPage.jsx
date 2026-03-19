import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import useAuth from "../hooks/useAuth";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const user = await login(formData);
      navigate(`/dashboard/${user.role}`);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
      <Card className="mx-auto w-full max-w-md">
        <h1>Login</h1>
        <p className="mt-2 text-sm text-slate-600">
          Access your secure PSWCares workspace.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>

        <div className="mt-4 flex items-center justify-between text-sm">
          <Link
            to="/forgot-password"
            className="text-saas-primary hover:underline"
          >
            Forgot password?
          </Link>
          <Link
            to="/admin/login"
            className="text-slate-600 hover:text-saas-text"
          >
            Admin login
          </Link>
        </div>

        <div className="mt-2 flex items-center justify-end text-sm">
          <Link to="/auth/role" className="text-slate-600 hover:text-saas-text">
            Create account
          </Link>
        </div>

        {errorMessage ? (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}
      </Card>
    </section>
  );
}

export default LoginPage;
