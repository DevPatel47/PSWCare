import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { api } from "../services/api";
import { generateDashboardRequest } from "../services/dashboardService";

function ClientDashboardPage() {
  const [appointments, setAppointments] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsResponse, dashboardResponse] = await Promise.all([
          api.get("/appointments/mine"),
          generateDashboardRequest(),
        ]);
        setAppointments(appointmentsResponse.data.data.appointments || []);
        setDashboard(dashboardResponse);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "Failed to load dashboard",
        );
      }
    };

    fetchData();
  }, []);

  return (
    <section className="space-y-6">
      <Card>
        <h1>Client Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">
          Overview of care bookings, messages, and notifications.
        </p>
      </Card>

      <div className="stats-grid">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Upcoming Booking
          </p>
          <p className="mt-2 text-sm text-saas-text">
            {appointments[0]
              ? new Date(appointments[0].scheduledStart).toLocaleString()
              : "No upcoming booking"}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Upcoming Booking
          </p>
          <p className="mt-2 line-clamp-2 text-sm text-saas-text">
            {appointments.find((item) => item.status !== "cancelled")
              ? new Date(
                  appointments.find((item) => item.status !== "cancelled")
                    .scheduledStart,
                ).toLocaleString()
              : "No upcoming booking"}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Notifications
          </p>
          <p className="mt-2 text-sm text-saas-text">
            Check your latest updates
          </p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Quick Actions
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link
              to="/psw-search"
              className="text-sm font-medium text-saas-primary"
            >
              Find PSW
            </Link>
            <Link
              to="/bookings"
              className="text-sm font-medium text-saas-primary"
            >
              View bookings
            </Link>
          </div>
        </Card>
      </div>

      <Card>
        <h3>Booking Status</h3>
        {dashboard ? (
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <div className="ui-card-muted">
              <p className="text-xs uppercase text-slate-500">Pending</p>
              <p className="mt-1 text-xl font-semibold text-saas-text">
                {dashboard.stats.pending}
              </p>
            </div>
            <div className="ui-card-muted">
              <p className="text-xs uppercase text-slate-500">Confirmed</p>
              <p className="mt-1 text-xl font-semibold text-saas-text">
                {dashboard.stats.confirmed}
              </p>
            </div>
            <div className="ui-card-muted">
              <p className="text-xs uppercase text-slate-500">Completed</p>
              <p className="mt-1 text-xl font-semibold text-saas-text">
                {dashboard.stats.completed}
              </p>
            </div>
          </div>
        ) : null}
      </Card>

      {errorMessage ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      <div className="space-y-3">
        {appointments.map((appointment) => (
          <Card
            key={appointment._id}
            className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="text-base font-semibold text-saas-text">
                {appointment.psw?.name}
              </p>
              <p className="text-sm text-slate-500">
                {new Date(appointment.scheduledStart).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge status={appointment.status}>{appointment.status}</Badge>
              {appointment.status === "confirmed" ? (
                <>
                  <Link
                    to={`/chat/${appointment._id}`}
                    className="text-sm font-medium text-saas-primary"
                  >
                    Open Chat
                  </Link>
                </>
              ) : null}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default ClientDashboardPage;
