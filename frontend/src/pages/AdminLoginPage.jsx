import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import useAuth from "../hooks/useAuth";

function AdminLoginPage() {
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();
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
    setErrorMessage("");

    try {
      await loginAdmin(formData);
      navigate("/dashboard/admin");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Admin login failed");
    }
  };

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
      <Card className="mx-auto w-full max-w-md">
        <h1>Admin Login</h1>
        <p className="mt-2 text-sm text-slate-600">
          Sign in with administrator credentials.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input
            id="email"
            name="email"
            label="Admin Email"
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
            Login as Admin
          </Button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          Regular user?{" "}
          <Link to="/login" className="text-saas-primary hover:underline">
            Go to Login
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

export default AdminLoginPage;
