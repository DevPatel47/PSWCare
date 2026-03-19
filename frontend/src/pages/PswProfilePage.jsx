import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Tabs from "../components/ui/Tabs";
import { api } from "../services/api";

function PswProfilePage() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("About");
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      setError("");
      try {
        const profileResponse = await api.get(`/psw-profiles/${userId}`);
        setProfile(profileResponse.data.data.profile);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message || "Unable to load profile",
        );
      }
    };

    run();
  }, [userId]);

  if (error) {
    return (
      <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </p>
    );
  }

  if (!profile) {
    return <p className="text-sm text-slate-500">Loading profile...</p>;
  }

  return (
    <section className="space-y-6">
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-full bg-slate-200" />
            <div>
              <h1>{profile.user?.name}</h1>
              <p className="mt-1 text-sm text-slate-600">
                {profile.experienceYears || 0}+ years experience
              </p>
            </div>
          </div>
          <Link to={`/booking/${profile.user?._id}`}>
            <Button>Book Now</Button>
          </Link>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="ui-card-muted">
            <p className="text-xs text-slate-500">Price</p>
            <p className="mt-1 text-xl font-semibold">
              ${profile.hourlyRate}/hour
            </p>
          </div>
          <div className="ui-card-muted">
            <p className="text-xs text-slate-500">Experience</p>
            <p className="mt-1 text-xl font-semibold">
              {profile.experienceYears || 0}+ years
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <Tabs
          tabs={["About", "Services", "Skills", "Certificates", "Availability"]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <div className="mt-4">
          {activeTab === "About" ? (
            <p className="text-sm text-slate-600">
              {profile.bio || "No detailed bio available."}
            </p>
          ) : null}

          {activeTab === "Services" ? (
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
              <li>Elder care</li>
              <li>Mobility support</li>
              <li>Post-hospital assistance</li>
            </ul>
          ) : null}

          {activeTab === "Skills" ? (
            <div className="flex flex-wrap gap-2">
              {(profile.skills || []).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : null}

          {activeTab === "Certificates" ? (
            <p className="text-sm text-slate-600">
              Certificates are available after admin verification.
            </p>
          ) : null}
          {activeTab === "Availability" ? (
            <div className="space-y-2">
              {(profile.availability || []).length === 0 ? (
                <div className="empty-state">No availability added yet.</div>
              ) : (
                (profile.availability || []).map((slot, index) => (
                  <div
                    key={`${slot.day}-${index}`}
                    className="rounded-lg border border-slate-200 p-3 text-sm text-slate-600"
                  >
                    {slot.day}: {slot.startTime} - {slot.endTime}
                  </div>
                ))
              )}
            </div>
          ) : null}
        </div>
      </Card>
    </section>
  );
}

export default PswProfilePage;
