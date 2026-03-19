import { useEffect, useState } from "react";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { api } from "../services/api";

function AdminPanelPage() {
  const [profiles, setProfiles] = useState([]);
  const [rejectionReason, setRejectionReason] = useState("");
  const [message, setMessage] = useState("");

  const loadProfiles = async () => {
    const response = await api.get("/psw-profiles/admin/pending");
    setProfiles(response.data.data.profiles || []);
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const updateApproval = async (profileId, status) => {
    await api.patch(`/psw-profiles/${profileId}/approval`, {
      status,
      rejectionReason,
    });
    await loadProfiles();
    setMessage(`Profile ${status} successfully`);
    if (status === "approved") {
      setRejectionReason("");
    }
  };

  return (
    <section className="space-y-6">
      <Card>
        <h1>PSW Verification Queue</h1>
        <p className="mt-2 text-sm text-slate-600">
          Review pending PSW profiles and update verification status.
        </p>
        <label className="mt-4 block">
          <span className="ui-label">
            Rejection reason (used only when rejecting)
          </span>
          <textarea
            className="ui-input min-h-20"
            value={rejectionReason}
            onChange={(event) => setRejectionReason(event.target.value)}
            placeholder="Provide clear reason for rejection"
          />
        </label>
      </Card>

      {message ? (
        <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </p>
      ) : null}

      <div className="space-y-3">
        {profiles.map((profile) => (
          <Card
            key={profile._id}
            className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="text-base font-semibold text-saas-text">
                {profile.user?.name}
              </p>
              <p className="text-sm text-slate-500">{profile.user?.email}</p>
              <p className="mt-1 text-xs text-slate-500">
                Documents: {(profile.certifications || []).length}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="success"
                onClick={() => updateApproval(profile._id, "approved")}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                onClick={() => updateApproval(profile._id, "rejected")}
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

export default AdminPanelPage;
