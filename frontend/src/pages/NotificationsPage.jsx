import { useEffect, useMemo, useState } from "react";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import {
  clearMyNotificationsRequest,
  listMyNotificationsRequest,
  markAllNotificationsAsReadRequest,
  markNotificationAsReadRequest,
} from "../services/notificationService";

function NotificationsPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMutating, setIsMutating] = useState(false);
  const [activeItemId, setActiveItemId] = useState("");

  const loadNotifications = async () => {
    try {
      setError("");
      const data = await listMyNotificationsRequest();
      const nextItems = (data.notifications || []).map((item) => ({
        id: item._id,
        title: item.title,
        message: item.message,
        read: Boolean(item.readAt),
        createdAt: item.createdAt,
      }));
      setItems(nextItems);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Failed to load notifications",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const unread = useMemo(
    () => items.filter((item) => !item.read).length,
    [items],
  );

  const markRead = async (id) => {
    try {
      setActiveItemId(id);
      await markNotificationAsReadRequest(id);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, read: true } : item)),
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Failed to update notification",
      );
    } finally {
      setActiveItemId("");
    }
  };

  const markAllRead = async () => {
    try {
      setIsMutating(true);
      setError("");
      await markAllNotificationsAsReadRequest();
      setItems((prev) => prev.map((item) => ({ ...item, read: true })));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Failed to mark all as read",
      );
    } finally {
      setIsMutating(false);
    }
  };

  const clearAll = async () => {
    try {
      setIsMutating(true);
      setError("");
      await clearMyNotificationsRequest();
      setItems([]);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Failed to clear notifications",
      );
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <section className="space-y-5">
      <Card>
        <h1>Notifications</h1>
        <p className="mt-2 text-sm text-slate-600">
          You have {unread} unread notifications.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={markAllRead}
            disabled={isMutating || items.length === 0 || unread === 0}
          >
            Mark all as read
          </Button>
          <Button
            variant="secondary"
            onClick={clearAll}
            disabled={isMutating || items.length === 0}
          >
            Clear all
          </Button>
        </div>
      </Card>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {isLoading ? (
        <div className="empty-state">Loading notifications...</div>
      ) : null}

      {!isLoading && items.length === 0 ? (
        <div className="empty-state">No notifications right now.</div>
      ) : null}

      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id} className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm ${item.read ? "text-slate-500" : "text-saas-text"}`}
              >
                {item.title}
              </p>
              <p className="mt-1 text-xs text-slate-500">{item.message}</p>
            </div>
            <Button
              variant="secondary"
              onClick={() => markRead(item.id)}
              disabled={item.read || activeItemId === item.id}
            >
              {item.read ? "Read" : "Mark as read"}
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default NotificationsPage;
