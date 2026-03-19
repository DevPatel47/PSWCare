import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import StepProgressBar from "../components/ui/StepProgressBar";
import { api } from "../services/api";

const bookingSteps = [
  "Select Service",
  "Choose Date & Time",
  "Confirm Booking",
];

function BookingPage() {
  const { pswId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [createdAppointmentId, setCreatedAppointmentId] = useState("");
  const [formData, setFormData] = useState({
    serviceType: "Personal Care",
    scheduledStart: "",
    scheduledEnd: "",
    notes: "",
  });
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const submitBooking = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.scheduledStart || !formData.scheduledEnd) {
      setError("Please choose both start and end date/time.");
      return;
    }

    if (new Date(formData.scheduledEnd) <= new Date(formData.scheduledStart)) {
      setError("End time must be after start time.");
      return;
    }

    try {
      const response = await api.post("/appointments", { ...formData, pswId });
      setCreatedAppointmentId(response.data.data.appointment._id);
      setStep(3);
      setSuccess("Booking submitted successfully.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Booking failed");
    }
  };

  const finishBooking = () => {
    setIsRedirecting(true);
    setTimeout(() => {
      navigate("/dashboard/client");
    }, 700);
  };

  return (
    <section className="space-y-6">
      <Card>
        <h1>Book Appointment</h1>
        <p className="mt-2 text-sm text-slate-600">
          Complete the booking workflow in three steps.
        </p>
        <StepProgressBar currentStep={step} steps={bookingSteps} />

        {step === 1 ? (
          <div className="space-y-4">
            <label>
              <span className="ui-label">Service Type</span>
              <select
                className="ui-input"
                value={formData.serviceType}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    serviceType: event.target.value,
                  }))
                }
              >
                <option>Personal Care</option>
                <option>Companionship</option>
                <option>Mobility Support</option>
                <option>Medication Assistance</option>
              </select>
            </label>
            <Button onClick={() => setStep(2)} disabled={!formData.serviceType}>
              Continue to Date & Time
            </Button>
          </div>
        ) : null}

        {step === 2 ? (
          <form className="space-y-4" onSubmit={submitBooking}>
            <Input
              id="scheduledStart"
              label="Start time"
              type="datetime-local"
              value={formData.scheduledStart}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  scheduledStart: event.target.value,
                }))
              }
              required
            />
            <Input
              id="scheduledEnd"
              label="End time"
              type="datetime-local"
              value={formData.scheduledEnd}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  scheduledEnd: event.target.value,
                }))
              }
              required
            />
            <label>
              <span className="ui-label">Notes</span>
              <textarea
                className="ui-input min-h-24"
                value={formData.notes}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    notes: event.target.value,
                  }))
                }
              />
            </label>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="submit">Confirm Booking</Button>
            </div>
          </form>
        ) : null}

        {step === 3 ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Step 3: your booking request has been submitted and is waiting for
              PSW confirmation.
            </p>
            <p className="text-xs text-slate-500">
              Appointment ID: {createdAppointmentId || "not-generated"}
            </p>
            <Button
              variant="success"
              onClick={finishBooking}
              disabled={isRedirecting}
            >
              {isRedirecting ? "Redirecting..." : "Finish Booking"}
            </Button>
          </div>
        ) : null}
      </Card>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </p>
      ) : null}
    </section>
  );
}

export default BookingPage;
