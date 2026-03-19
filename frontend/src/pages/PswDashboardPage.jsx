import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { api } from "../services/api";
import { generateDashboardRequest } from "../services/dashboardService";
import {
  getMyPswProfileRequest,
  upsertMyPswProfileRequest,
  uploadCertificationRequest,
} from "../services/pswProfileService";

function PswDashboardPage() {
  const [appointments, setAppointments] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [formData, setFormData] = useState({
    bio: "",
    skills: "",
    experienceYears: "",
    hourlyRate: "",
    availabilityJson: "[]",
  });

  const certificationCount = useMemo(
    () => dashboard?.stats?.certifications || 0,
    [dashboard],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsResponse, dashboardResponse, profile] =
          await Promise.all([
            api.get("/appointments/mine"),
            generateDashboardRequest(),
            getMyPswProfileRequest(),
          ]);

        setAppointments(appointmentsResponse.data.data.appointments || []);
        setDashboard(dashboardResponse);

        if (profile) {
          setFormData({
            bio: profile.bio || "",
            skills: (profile.skills || []).join(", "),
            experienceYears: String(profile.experienceYears || 0),
            hourlyRate: String(profile.hourlyRate || ""),
            availabilityJson: JSON.stringify(
              profile.availability || [],
              null,
              2,
            ),
          });
        }
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "Failed to load dashboard",
        );
      }
    };

    fetchData();
  }, []);

  const updateAppointmentStatus = async (appointmentId, status) => {
    setStatusMessage("");
    try {
      await api.patch(`/appointments/${appointmentId}/status`, { status });
      const response = await api.get("/appointments/mine");
      setAppointments(response.data.data.appointments || []);
      setStatusMessage(`Appointment updated to ${status}`);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to update appointment status",
      );
    }
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setStatusMessage("");

    try {
      const availability = JSON.parse(formData.availabilityJson || "[]");
      const skills = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      await upsertMyPswProfileRequest({
        bio: formData.bio,
        skills,
        experienceYears: Number(formData.experienceYears || 0),
        hourlyRate: Number(formData.hourlyRate),
        availability,
      });

      const dashboardResponse = await generateDashboardRequest();
      setDashboard(dashboardResponse);
      setStatusMessage("Profile saved and submitted for approval review");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to save profile",
      );
    }
  };

  const uploadCertification = async () => {
    if (!selectedCertification) {
      setErrorMessage("Select a PDF/JPG/PNG file to upload");
      return;
    }

    setErrorMessage("");
    setStatusMessage("");
    try {
      await uploadCertificationRequest(selectedCertification);
      const dashboardResponse = await generateDashboardRequest();
      setDashboard(dashboardResponse);
      setSelectedCertification(null);
      setStatusMessage("Certification uploaded successfully");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Certification upload failed",
      );
    }
  };

  return (
    <section className="space-y-6">
      <Card>
        <h1>PSW Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">
          Track requests, appointments, and profile verification progress.
        </p>
      </Card>

      <div className="stats-grid">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            New Booking Requests
          </p>
          <p className="mt-2 text-xl font-semibold text-saas-text">
            {dashboard?.stats?.pending || 0}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Availability Summary
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Manage weekly slots in calendar.
          </p>
          <Link
            to="/availability"
            className="mt-2 inline-block text-sm font-medium text-saas-primary"
          >
            Open calendar
          </Link>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Upcoming Appointments
          </p>
          <p className="mt-2 text-xl font-semibold text-saas-text">
            {dashboard?.stats?.confirmed || 0}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Verification Status
          </p>
          <div className="mt-2">
            <Badge status={dashboard?.stats?.approvalStatus}>
              {dashboard?.stats?.approvalStatus || "pending"}
            </Badge>
          </div>
        </Card>
      </div>

      <Card>
        <h3>Operational Summary</h3>
        {dashboard ? (
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <div className="ui-card-muted">
              <p className="text-xs uppercase text-slate-500">Approval</p>
              <p className="mt-1 text-xl font-semibold">
                {dashboard.stats.approvalStatus}
              </p>
            </div>
            <div className="ui-card-muted">
              <p className="text-xs uppercase text-slate-500">Pending</p>
              <p className="mt-1 text-xl font-semibold">
                {dashboard.stats.pending}
              </p>
            </div>
            <div className="ui-card-muted">
              <p className="text-xs uppercase text-slate-500">Confirmed</p>
              <p className="mt-1 text-xl font-semibold">
                {dashboard.stats.confirmed}
              </p>
            </div>
            <div className="ui-card-muted">
              <p className="text-xs uppercase text-slate-500">Certifications</p>
              <p className="mt-1 text-xl font-semibold">{certificationCount}</p>
            </div>
          </div>
        ) : null}
      </Card>

      <Card>
        <h3>Profile Edit</h3>
        <form className="mt-4 space-y-3" onSubmit={saveProfile}>
          <label>
            <span className="ui-label">Bio</span>
            Bio
            <textarea
              className="ui-input min-h-24"
              value={formData.bio}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, bio: event.target.value }))
              }
              placeholder="Write your care experience and specialization"
            />
          </label>

          <label>
            <span className="ui-label">Skills (comma separated)</span>
            <input
              className="ui-input"
              value={formData.skills}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, skills: event.target.value }))
              }
              placeholder="elderly care, wound dressing, mobility support"
            />
          </label>

          <label>
            <span className="ui-label">Experience (years)</span>
            <input
              className="ui-input"
              type="number"
              min="0"
              max="60"
              value={formData.experienceYears}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  experienceYears: event.target.value,
                }))
              }
            />
          </label>

          <label>
            <span className="ui-label">Hourly Rate</span>
            <input
              className="ui-input"
              type="number"
              min="1"
              value={formData.hourlyRate}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  hourlyRate: event.target.value,
                }))
              }
            />
          </label>

          <label>
            <span className="ui-label">Availability JSON</span>
            <textarea
              className="ui-input min-h-28 font-mono text-xs"
              value={formData.availabilityJson}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  availabilityJson: event.target.value,
                }))
              }
            />
          </label>

          <Button type="submit">Save Profile</Button>
        </form>

        <div className="mt-5 space-y-3">
          <h3>Certification Upload</h3>
          <input
            type="file"
            accept="application/pdf,image/jpeg,image/png"
            onChange={(event) =>
              setSelectedCertification(event.target.files?.[0] || null)
            }
          />
          <Button variant="success" onClick={uploadCertification}>
            Upload Certification
          </Button>
        </div>
      </Card>

      {statusMessage ? (
        <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {statusMessage}
        </p>
      ) : null}
      {errorMessage ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      <Card>
        <h3>Upcoming Appointments</h3>
        <div className="mt-4 space-y-3">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="rounded-lg border border-slate-200 p-4"
            >
              <p className="text-base font-semibold text-saas-text">
                Client: {appointment.client?.name}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {new Date(appointment.scheduledStart).toLocaleString()}
              </p>
              <div className="mt-2">
                <Badge status={appointment.status}>{appointment.status}</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {appointment.status === "pending" ? (
                  <Button
                    className="text-xs"
                    onClick={() =>
                      updateAppointmentStatus(appointment._id, "confirmed")
                    }
                  >
                    Confirm
                  </Button>
                ) : null}

                {appointment.status === "confirmed" ? (
                  <Button
                    variant="success"
                    className="text-xs"
                    onClick={() =>
                      updateAppointmentStatus(appointment._id, "completed")
                    }
                  >
                    Mark Completed
                  </Button>
                ) : null}

                {["pending", "confirmed"].includes(appointment.status) ? (
                  <Button
                    variant="secondary"
                    className="text-xs"
                    onClick={() =>
                      updateAppointmentStatus(appointment._id, "cancelled")
                    }
                  >
                    Cancel
                  </Button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

export default PswDashboardPage;
