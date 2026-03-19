require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const connectDatabase = require("./config/db");
const { validateEnvironment } = require("./config/env");
const { registerChatHandlers } = require("./socket/chatSocket");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    validateEnvironment();
    await connectDatabase();

    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
      },
    });

    registerChatHandlers(io);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
