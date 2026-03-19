import { api } from "./api";

export const listMyNotificationsRequest = async ({
  unreadOnly = false,
} = {}) => {
  const response = await api.get("/notifications", {
    params: { unreadOnly },
  });
  return response.data.data;
};

export const markNotificationAsReadRequest = async (notificationId) => {
  const response = await api.patch(`/notifications/${notificationId}/read`);
  return response.data.data.notification;
};

export const markAllNotificationsAsReadRequest = async () => {
  await api.patch("/notifications/read-all");
};

export const clearMyNotificationsRequest = async () => {
  await api.delete("/notifications");
};
