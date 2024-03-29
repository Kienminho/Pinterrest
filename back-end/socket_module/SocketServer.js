const _User = require("../model/User");
const httpServer = require("http").createServer();
const Server = require("socket.io").Server;

//socket
const io = new Server(httpServer, {
  path: "/socket/",
  // cors: {
  //   origin: "*",
  // },
  transports: ["websocket", "polling"],
});

let users = [];
io.on("connection", (socket) => {
  console.log(`A user connected with ${socket.id}`);
  socket.on("join", (userId) => {
    const user = { userId, socketId: socket.id };
    users.push(user);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", async (data) => {
    const receiver = users.find((user) => user.userId === data.receiverId);
    const sender = users.find((user) => user.userId === data.senderId);

    const user = await _User.findById(data.senderId);
    if (receiver) {
      console.log(41);
      io.to(receiver.socketId)
        .to(sender.socketId)
        .emit("getMessage", {
          data,
          user: { id: user._id, name: user.UserName, avatar: user.Avatar },
        });
    } else {
      io.to(sender.socketId).emit("getMessage", {
        data,
        user: { id: user._id, name: user.UserName, avatar: user.Avatar },
      });
    }
  });

  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit("getUsers", users);
    console.log("a user disconnected");
  });
});

module.exports = io;
