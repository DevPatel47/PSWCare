function Badge({ status = "pending", children }) {
  const map = {
    active: "status-active",
    approved: "status-active",
    succeeded: "status-active",
    resolved: "status-active",
    pending: "status-pending",
    confirmed: "status-pending",
    open: "status-pending",
    rejected: "status-danger",
    cancelled: "status-danger",
    failed: "status-danger",
    banned: "status-danger",
  };

  return (
    <span className={map[status] || "status-pending"}>
      {children || status}
    </span>
  );
}

export default Badge;
