import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Card from "../components/ui/Card";
import { generateDashboardRequest } from "../services/dashboardService";

function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const run = async () => {
      const response = await generateDashboardRequest();
      setDashboard(response);
    };

    run();
  }, []);

  return (
    <section className="space-y-6">
      <Card>
        <h1>Admin Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">
          Platform insights and operational actions.
        </p>
      </Card>

      {dashboard ? (
        <div className="stats-grid">
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Pending Approvals
            </p>
            <p className="mt-2 text-2xl font-semibold text-saas-text">
              {dashboard.stats.pendingApprovals}
            </p>
          </Card>
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Active Appointments
            </p>
            <p className="mt-2 text-2xl font-semibold text-saas-text">
              {dashboard.stats.activeAppointments}
            </p>
          </Card>
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Total Payments
            </p>
            <p className="mt-2 text-2xl font-semibold text-saas-text">
              {dashboard.stats.totalPayments}
            </p>
          </Card>
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Disputes
            </p>
            <p className="mt-2 text-2xl font-semibold text-saas-text">
              {dashboard.stats.openDisputes ?? 0}
            </p>
          </Card>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3>Activity Trend</h3>
          <div className="mt-4 space-y-3">
            {[35, 50, 40, 70].map((value, index) => (
              <div key={index}>
                <div className="mb-1 text-xs text-slate-500">
                  Week {index + 1}
                </div>
                <div className="h-2 rounded-full bg-slate-200">
                  <div
                    className="h-2 rounded-full bg-saas-primary"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3>Admin Actions</h3>
          <div className="mt-3 space-y-2 text-sm">
            <Link
              to="/admin/verification"
              className="block text-saas-primary hover:underline"
            >
              Review PSW verification queue
            </Link>
            <Link
              to="/admin/users"
              className="block text-saas-primary hover:underline"
            >
              Manage users and status
            </Link>
            <Link
              to="/admin/disputes"
              className="block text-saas-primary hover:underline"
            >
              Resolve dispute cases
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
}

export default AdminDashboardPage;
