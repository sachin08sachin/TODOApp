import http from 'http';
import { Server } from 'socket.io';

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://10.31.69.213:3000"],
    methods: ["GET", "POST"]
  }
});

server.listen(4000, () => {
  console.log("Socket.IO server listening on port 4000");
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});
