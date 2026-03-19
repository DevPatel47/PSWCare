import { useEffect, useState } from "react";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";
import {
  listDisputesRequest,
  resolveDisputeRequest,
} from "../services/adminService";

function DisputeManagementPage() {
  const [disputes, setDisputes] = useState([]);
  const [filter, setFilter] = useState("open");
  const [selected, setSelected] = useState(null);
  const [resolutionNote, setResolutionNote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const loadDisputes = async (nextFilter = filter) => {
    try {
      setError("");
      setIsLoading(true);
      const params = nextFilter === "all" ? {} : { status: nextFilter };
      const data = await listDisputesRequest(params);
      setDisputes(data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Failed to load disputes",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDisputes(filter);
  }, [filter]);

  const updateDispute = async (status) => {
    if (!selected) {
      return;
    }

    try {
      setIsSaving(true);
      await resolveDisputeRequest(selected._id, {
        status,
        resolutionNote,
      });
      setSelected(null);
      setResolutionNote("");
      await loadDisputes(filter);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Failed to update dispute",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="space-y-6">
      <Card>
        <h1>Dispute Management</h1>
        <p className="mt-2 text-sm text-slate-600">
          Review and resolve ongoing service disputes.
        </p>
        <div className="mt-4 flex gap-2">
          {[
            { key: "all", label: "All" },
            { key: "open", label: "Open" },
            { key: "resolved", label: "Resolved" },
            { key: "rejected", label: "Rejected" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={`rounded-lg border px-3 py-1.5 text-sm ${
                filter === item.key
                  ? "border-saas-primary bg-blue-50 text-saas-primary"
                  : "border-slate-300 text-slate-600"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </Card>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {isLoading ? (
        <div className="empty-state">Loading disputes...</div>
      ) : null}

      {!isLoading && disputes.length === 0 ? (
        <div className="empty-state">No disputes found for this status.</div>
      ) : null}

      <div className="space-y-3">
        {disputes.map((dispute) => (
          <Card key={dispute._id} className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-saas-text">{dispute.subject}</p>
              <p className="text-sm text-slate-500">
                {dispute.createdBy?.name || "Unknown user"} | {dispute._id}
              </p>
              <div className="mt-2">
                <Badge status={dispute.status}>{dispute.status}</Badge>
              </div>
            </div>
            <Button variant="secondary" onClick={() => setSelected(dispute)}>
              Open
            </Button>
          </Card>
        ))}
      </div>

      <Modal
        open={Boolean(selected)}
        title="Dispute Detail"
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-700">Case: {selected.subject}</p>
            <p className="text-sm text-slate-700">
              Description: {selected.description}
            </p>
            <p className="text-sm text-slate-700">
              Reported by: {selected.createdBy?.name || "Unknown"}
            </p>
            <p className="text-sm text-slate-700">
              Against: {selected.againstUser?.name || "Not specified"}
            </p>
            <label className="block">
              <span className="ui-label">Resolution note</span>
              <textarea
                className="ui-input min-h-20"
                placeholder="Add optional notes for this decision"
                value={resolutionNote}
                onChange={(event) => setResolutionNote(event.target.value)}
              />
            </label>
            <div className="flex gap-2">
              <Button
                variant="success"
                onClick={() => updateDispute("resolved")}
                disabled={isSaving}
              >
                Resolve
              </Button>
              <Button
                variant="danger"
                onClick={() => updateDispute("rejected")}
                disabled={isSaving}
              >
                Reject Claim
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </section>
  );
}

export default DisputeManagementPage;
