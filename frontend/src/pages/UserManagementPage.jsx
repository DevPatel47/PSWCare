import { useEffect, useState } from "react";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Table from "../components/ui/Table";
import {
  listUsersRequest,
  updateUserStatusRequest,
} from "../services/adminService";

function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState("");

  const loadUsers = async ({
    nextFilter = filter,
    nextSearch = search,
  } = {}) => {
    try {
      setError("");
      setIsLoading(true);
      const params = {};
      if (nextFilter !== "all") {
        params.status = nextFilter;
      }
      if (nextSearch.trim()) {
        params.query = nextSearch.trim();
      }

      const data = await listUsersRequest(params);
      setUsers(data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers({ nextFilter: filter, nextSearch: search });
  }, [filter]);

  const applySearch = () => {
    loadUsers({ nextFilter: filter, nextSearch: search });
  };

  const updateStatus = async (userId, status) => {
    try {
      setUpdatingUserId(userId);
      await updateUserStatusRequest(userId, status);
      await loadUsers({ nextFilter: filter, nextSearch: search });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Failed to update user status",
      );
    } finally {
      setUpdatingUserId("");
    }
  };

  const columns = [
    { key: "name", title: "Name" },
    { key: "email", title: "Email" },
    { key: "role", title: "Role" },
    {
      key: "status",
      title: "Status",
      render: (row) => <Badge status={row.status}>{row.status}</Badge>,
    },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => updateStatus(row.id, "active")}
            disabled={updatingUserId === row.id || row.status === "active"}
          >
            Activate
          </Button>
          <Button
            variant="danger"
            onClick={() => updateStatus(row.id, "banned")}
            disabled={updatingUserId === row.id || row.status === "banned"}
          >
            Ban
          </Button>
        </div>
      ),
    },
  ];

  return (
    <section className="space-y-6">
      <Card>
        <h1>User Management</h1>
        <div className="mt-4 flex flex-col gap-2 md:flex-row">
          <input
            className="ui-input md:max-w-sm"
            placeholder="Search by name or email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Button variant="secondary" onClick={applySearch}>
            Search
          </Button>
        </div>
        <div className="mt-4 flex gap-2">
          {[
            { key: "all", label: "All" },
            { key: "active", label: "Active" },
            { key: "pending", label: "Pending" },
            { key: "banned", label: "Banned" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={`rounded-lg border px-3 py-1.5 text-sm ${filter === item.key ? "border-saas-primary bg-blue-50 text-saas-primary" : "border-slate-300 text-slate-600"}`}
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

      {isLoading ? <div className="empty-state">Loading users...</div> : null}

      {!isLoading && users.length === 0 ? (
        <div className="empty-state">No users found.</div>
      ) : null}

      {!isLoading && users.length > 0 ? (
        <Table columns={columns} rows={users} rowKey="id" />
      ) : null}
    </section>
  );
}

export default UserManagementPage;
