const _User = require("../model/User");
const io = require("socket.io")(Number(process.env.PORT_SOCKET), {
  cors: {
    origin: "*",
  },
});

let users = [];
io.on("connection", (socket) => {
  console.log(`A user connected with ${socket.id}`);
  socket.on("join", (userId) => {
    const user = { userId, socketId: socket.id };
    users.push(user);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", (data) => {
    console.log(users);
    console.log("data :>> ", data);
    console.log(data.message);
    const receiver = users.find((user) => user.userId === data.receiverId);
    const sender = users.find((user) => user.userId === data.senderId);

    const user = _User.findById(data.senderId);
    console.log("sender :>> ", sender, receiver);
    if (receiver) {
      console.log(41);
      io.to(receiver.socketId)
        .to(sender.socketId)
        .emit("getMessage", {
          data,
          user: { id: user._id, name: user.UserName, avatar: user.Avatar },
        });
    } else {
      console.log(49);
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