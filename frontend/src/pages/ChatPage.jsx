import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import useAuth from "../hooks/useAuth";
import { api, getAccessToken } from "../services/api";

const SOCKET_URL =
  import.meta.env.VITE_API_SOCKET_URL || "http://localhost:5000";

function ChatPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(
    appointmentId || "",
  );
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const socket = useMemo(
    () =>
      io(SOCKET_URL, {
        autoConnect: false,
        auth: {
          token: `Bearer ${getAccessToken()}`,
        },
      }),
    [],
  );

  useEffect(() => {
    const loadConversations = async () => {
      setLoadingConversations(true);
      setErrorMessage("");
      try {
        const response = await api.get("/appointments/mine");
        const appointments = response.data.data.appointments || [];
        setConversations(appointments);

        if (!selectedAppointmentId && appointments.length > 0) {
          setSelectedAppointmentId(appointments[0]._id);
        }
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "Unable to load conversations.",
        );
      } finally {
        setLoadingConversations(false);
      }
    };

    loadConversations();
  }, [selectedAppointmentId]);

  useEffect(() => {
    if (!selectedAppointmentId) {
      return;
    }

    const loadMessages = async () => {
      setLoadingMessages(true);
      setErrorMessage("");
      try {
        const response = await api.get(
          `/messages/appointment/${selectedAppointmentId}`,
        );
        setMessages(response.data.data.messages || []);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "Unable to load messages.",
        );
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();

    socket.connect();
    socket.emit("appointment:join", selectedAppointmentId);
    const onNewMessage = (incoming) => {
      if (incoming.appointment === selectedAppointmentId) {
        setMessages((prev) => [...prev, incoming]);
      }
    };
    socket.on("message:new", onNewMessage);

    return () => {
      socket.off("message:new", onNewMessage);
      socket.disconnect();
    };
  }, [selectedAppointmentId, socket]);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!draft.trim() || !selectedAppointmentId) {
      return;
    }

    socket.emit("message:send", {
      appointmentId: selectedAppointmentId,
      content: draft,
    });
    setDraft("");
  };

  return (
    <section className="space-y-6">
      <Card>
        <h1>Messages</h1>
        <p className="mt-2 text-sm text-slate-600">
          Secure communication between clients and PSWs.
        </p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Card className="p-0">
          <div className="border-b border-slate-200 px-4 py-3 text-sm font-semibold text-saas-text">
            Conversations
          </div>
          <div className="max-h-[520px] overflow-y-auto p-2">
            {loadingConversations ? (
              <p className="p-3 text-sm text-slate-500">
                Loading conversations...
              </p>
            ) : null}
            {!loadingConversations && conversations.length === 0 ? (
              <div className="p-3 text-sm text-slate-500">
                No conversations yet. Once an appointment is confirmed, chat
                appears here.
              </div>
            ) : null}
            {conversations.map((conversation) => (
              <button
                key={conversation._id}
                type="button"
                onClick={() => {
                  setSelectedAppointmentId(conversation._id);
                  navigate(`/chat/${conversation._id}`);
                }}
                className={`mb-2 w-full rounded-lg border px-3 py-2 text-left text-sm ${
                  selectedAppointmentId === conversation._id
                    ? "border-saas-primary bg-blue-50"
                    : "border-slate-200"
                }`}
              >
                <p className="font-medium text-saas-text">
                  {conversation.client?.name ||
                    conversation.psw?.name ||
                    "Appointment"}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(conversation.scheduledStart).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        </Card>

        <Card className="flex min-h-[520px] flex-col">
          {errorMessage ? (
            <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}
          <div className="flex-1 space-y-3 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-4">
            {loadingMessages ? (
              <p className="text-sm text-slate-500">Loading messages...</p>
            ) : null}
            {!loadingMessages &&
            selectedAppointmentId &&
            messages.length === 0 ? (
              <p className="text-sm text-slate-500">
                No messages yet. Start the conversation below.
              </p>
            ) : null}
            {messages.map((message) => {
              const senderId = message.sender?._id || message.sender;
              const mine = senderId === user?.id;
              return (
                <div
                  key={message._id || message.id}
                  className={`flex ${mine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      mine
                        ? "bg-saas-primary text-white"
                        : "bg-white text-slate-700"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              );
            })}
          </div>

          <form className="mt-4 flex gap-3" onSubmit={sendMessage}>
            <input
              className="ui-input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Write a message"
              disabled={!selectedAppointmentId}
            />
            <Button type="submit" disabled={!selectedAppointmentId}>
              Send
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}

export default ChatPage;
