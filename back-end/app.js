require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

const io = require("./socket_module/SocketServer");

//middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(cookieParser());

//router
const userRouter = require("./router/UserRouter");
const fileRouter = require("./router/FileRouter");
const postRouter = require("./router/PostRouter");
const commentRouter = require("./router/CommentRouter");
const conversationRouter = require("./router/ConversationRouter");
const aiRouter = require("./router/AI");
const categoryRouter = require("./router/CategoryRouter");
const messageRouter = require("./router/MessageRouter");
app.use("/api/user", userRouter);
app.use("/api/file", fileRouter);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/ai", aiRouter);
app.use("/api/category", categoryRouter);
app.use("/api/message", messageRouter);

app.listen(process.env.PORT, () => {
  console.log("Server is running on: http://localhost:" + process.env.PORT);
});
