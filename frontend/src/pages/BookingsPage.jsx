import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import { api } from "../services/api";

function BookingsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await api.get("/appointments/mine");
        setAppointments(response.data.data.appointments || []);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message || "Unable to load bookings",
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const grouped = useMemo(() => {
    const now = new Date();
    return {
      upcoming: appointments.filter(
        (item) => new Date(item.scheduledStart) >= now,
      ),
      past: appointments.filter((item) => new Date(item.scheduledStart) < now),
    };
  }, [appointments]);

  return (
    <section className="space-y-6">
      <Card>
        <h1>Bookings</h1>
        <p className="mt-2 text-sm text-slate-600">
          View upcoming and previous care sessions.
        </p>
      </Card>

      {loading ? <div className="empty-state">Loading bookings...</div> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {!loading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h3>Upcoming</h3>
            <div className="mt-4 space-y-3">
              {grouped.upcoming.length === 0 ? (
                <div className="empty-state">No upcoming bookings</div>
              ) : (
                grouped.upcoming.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-lg border border-slate-200 p-3"
                  >
                    <p className="text-sm font-semibold text-saas-text">
                      {new Date(item.scheduledStart).toLocaleString()}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <Badge status={item.status}>{item.status}</Badge>
                      <Link
                        to={`/chat/${item._id}`}
                        className="text-sm font-medium text-saas-primary"
                      >
                        Open chat
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card>
            <h3>Past</h3>
            <div className="mt-4 space-y-3">
              {grouped.past.length === 0 ? (
                <div className="empty-state">No past bookings</div>
              ) : (
                grouped.past.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-lg border border-slate-200 p-3"
                  >
                    <p className="text-sm font-semibold text-saas-text">
                      {new Date(item.scheduledStart).toLocaleString()}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Status: {item.status}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      ) : null}
    </section>
  );
}

export default BookingsPage;
