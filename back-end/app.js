require("dotenv").config();
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helpers = require("./common/Helpers");
const app = express();

// require("./socket_module/SocketServer");

//middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: false,
    helpers: {
      isSuccessEq3: helpers.isSuccessEq3,
    },
  })
);
app.set("view engine", "handlebars");
app.use(express.static("public"));
app.use(cookieParser());

//router API
const userRouter = require("./router/API/UserRouter");
const fileRouter = require("./router/API/FileRouter");
const postRouter = require("./router/API/PostRouter");
const commentRouter = require("./router/API/CommentRouter");
const conversationRouter = require("./router/API/ConversationRouter");
const aiRouter = require("./router/API/AI");
const categoryRouter = require("./router/API/CategoryRouter");
const messageRouter = require("./router/API/MessageRouter");
app.use("/api/user", userRouter);
app.use("/api/file", fileRouter);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/ai", aiRouter);
app.use("/api/category", categoryRouter);
app.use("/api/message", messageRouter);

//router view
//chuyển hướng đến trang login
app.get("/", (req, res) => {
  res.render("waiting");
});
const authRouter = require("./router/AuthRouter");
const adminRouter = require("./router/AdminRouter");
app.use("/auth", authRouter);
app.use("/admin", adminRouter);

app.listen(process.env.PORT, () => {
  console.log("Server is running on: http://localhost:" + process.env.PORT);
});

//socket

const _User = require("./model/User");
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
