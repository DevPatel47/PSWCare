const Appointment = require("../models/Appointment");
const Message = require("../models/Message");
const { APPOINTMENT_STATUS } = require("../constants");
const { verifyAccessToken } = require("../utils/jwt");

const registerChatHandlers = (io) => {
  io.use((socket, next) => {
    try {
      const authorization = socket.handshake.auth?.token || "";
      const token = authorization.startsWith("Bearer ")
        ? authorization.split(" ")[1]
        : authorization;
      if (!token) {
        return next(new Error("Unauthorized"));
      }

      const payload = verifyAccessToken(token);
      socket.user = { id: payload.sub, role: payload.role };
      return next();
    } catch (error) {
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("appointment:join", async (appointmentId) => {
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        socket.emit("error:chat", "Appointment not found");
        return;
      }

      const isParticipant =
        appointment.client.toString() === socket.user.id ||
        appointment.psw.toString() === socket.user.id;
      if (!isParticipant) {
        socket.emit("error:chat", "Forbidden");
        return;
      }

      if (appointment.status !== APPOINTMENT_STATUS.CONFIRMED) {
        socket.emit("error:chat", "Chat enabled only after confirmation");
        return;
      }

      socket.join(`appointment:${appointmentId}`);
    });

    socket.on("message:send", async ({ appointmentId, content }) => {
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment || appointment.status !== APPOINTMENT_STATUS.CONFIRMED) {
        socket.emit("error:chat", "Chat unavailable for this appointment");
        return;
      }

      const isParticipant =
        appointment.client.toString() === socket.user.id ||
        appointment.psw.toString() === socket.user.id;
      if (!isParticipant || !content || !content.trim()) {
        socket.emit("error:chat", "Invalid message");
        return;
      }

      const message = await Message.create({
        appointment: appointmentId,
        sender: socket.user.id,
        content: content.trim(),
      });

      io.to(`appointment:${appointmentId}`).emit("message:new", {
        id: message._id,
        appointment: appointmentId,
        sender: socket.user.id,
        content: message.content,
        createdAt: message.createdAt,
      });
    });
  });
};

module.exports = {
  registerChatHandlers,
};
