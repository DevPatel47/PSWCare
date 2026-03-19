import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

function RoleSelectionPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("client");

  const continueFlow = () => {
    navigate(`/register?role=${role}`);
  };

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
      <Card className="mx-auto w-full max-w-xl">
        <h1>Select Your Role</h1>
        <p className="mt-2 text-sm text-slate-600">
          Choose how you will use PSWCares.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setRole("client")}
            className={`rounded-lg border p-4 text-left ${
              role === "client"
                ? "border-saas-primary bg-blue-50"
                : "border-slate-200"
            }`}
          >
            <p className="font-semibold text-saas-text">Client</p>
            <p className="mt-1 text-sm text-slate-600">
              Book and manage care services.
            </p>
          </button>
          <button
            type="button"
            onClick={() => setRole("psw")}
            className={`rounded-lg border p-4 text-left ${
              role === "psw"
                ? "border-saas-primary bg-blue-50"
                : "border-slate-200"
            }`}
          >
            <p className="font-semibold text-saas-text">PSW</p>
            <p className="mt-1 text-sm text-slate-600">
              Offer care services and manage bookings.
            </p>
          </button>
        </div>
        <div className="mt-6 flex gap-3">
          <Button onClick={continueFlow}>Continue</Button>
          <Button variant="secondary" onClick={() => navigate("/login")}>
            Login Instead
          </Button>
        </div>
      </Card>
    </section>
  );
}

export default RoleSelectionPage;
