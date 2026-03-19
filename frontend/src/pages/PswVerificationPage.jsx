import { useEffect, useState } from "react";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { api } from "../services/api";

function PswVerificationPage() {
  const [profiles, setProfiles] = useState([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");

  const loadProfiles = async () => {
    try {
      setError("");
      setIsLoading(true);
      const response = await api.get("/psw-profiles/admin/pending");
      setProfiles(response.data.data.profiles || []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Failed to load pending profiles",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const updateStatus = async (profileId, nextStatus) => {
    try {
      setUpdatingId(profileId);
      await api.patch(`/psw-profiles/${profileId}/approval`, {
        status: nextStatus,
      });
      setStatus(`Profile ${nextStatus} successfully.`);
      await loadProfiles();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Failed to update profile status",
      );
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <section className="space-y-6">
      <Card>
        <h1>PSW Verification</h1>
        <p className="mt-2 text-sm text-slate-600">
          Review uploaded documents and manage approval workflow.
        </p>
      </Card>

      {status ? <p className="text-sm text-green-700">{status}</p> : null}
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {isLoading ? (
        <div className="empty-state">Loading pending profiles...</div>
      ) : null}

      {!isLoading && profiles.length === 0 ? (
        <div className="empty-state">No pending PSW verifications.</div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {profiles.map((profile) => (
          <Card key={profile._id}>
            <p className="font-semibold text-saas-text">{profile.user?.name}</p>
            <p className="text-sm text-slate-500">{profile.user?.email}</p>
            <p className="mt-2 text-xs text-slate-500">
              Documents: {(profile.certifications || []).length}
            </p>
            <div className="mt-3 space-y-2">
              {(profile.certifications || []).map((certification) => (
                <a
                  key={certification.fileKey}
                  href={certification.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-xs text-saas-primary hover:underline"
                >
                  {certification.fileKey}
                </a>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                variant="success"
                onClick={() => updateStatus(profile._id, "approved")}
                disabled={updatingId === profile._id}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                onClick={() => updateStatus(profile._id, "rejected")}
                disabled={updatingId === profile._id}
              >
                Reject
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default PswVerificationPage;
