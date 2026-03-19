import { useState } from "react";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setSuccess("If this email exists, a reset link has been sent.");
  };

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
      <Card className="mx-auto w-full max-w-md">
        <h1>Forgot Password</h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter your account email to receive reset instructions.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>
        </form>
        {success ? (
          <p className="mt-4 text-sm text-green-700">{success}</p>
        ) : null}
      </Card>
    </section>
  );
}

export default ForgotPasswordPage;
