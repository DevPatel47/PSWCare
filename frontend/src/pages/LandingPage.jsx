import { Link } from "react-router-dom";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const testimonials = [
  {
    name: "Priya M.",
    quote:
      "Booking care now takes minutes instead of days. The workflow is incredibly clear.",
  },
  {
    name: "Alex R.",
    quote: "As a PSW, I can manage availability and appointments in one place.",
  },
  {
    name: "Jordan K.",
    quote:
      "Professional interface, reliable communication, and smooth payment steps.",
  },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-xl font-bold text-saas-text">PSWCares</p>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="secondary">Login</Button>
            </Link>
            <Link to="/auth/role">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-saas-primary">
              Trusted homecare platform
            </p>
            <h1>Your Trusted Partner for Quality Care</h1>
            <p className="mt-4 text-base text-slate-600">
              Find verified personal support workers, manage bookings, and stay
              connected with real-time updates.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/psw-search">
                <Button>Find a PSW</Button>
              </Link>
              <Link to="/auth/role">
                <Button variant="secondary">Become a PSW</Button>
              </Link>
            </div>
          </div>
          <Card className="bg-slate-50">
            <h3>How It Works</h3>
            <div className="mt-4 space-y-4">
              <div className="ui-card-muted">
                <p className="text-sm font-semibold text-saas-primary">
                  1. Search
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Browse approved PSWs by service and rate.
                </p>
              </div>
              <div className="ui-card-muted">
                <p className="text-sm font-semibold text-saas-primary">
                  2. Book
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Select service, choose schedule, and confirm payment.
                </p>
              </div>
              <div className="ui-card-muted">
                <p className="text-sm font-semibold text-saas-primary">
                  3. Receive Care
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Track appointments and communicate securely in-app.
                </p>
              </div>
            </div>
          </Card>
        </section>

        <section className="bg-slate-50 py-14">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2>What Families and PSWs Say</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {testimonials.map((item) => (
                <Card key={item.name}>
                  <p className="text-sm text-slate-600">"{item.quote}"</p>
                  <p className="mt-4 text-sm font-semibold text-saas-text">
                    {item.name}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
