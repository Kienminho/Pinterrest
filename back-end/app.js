require("dotenv").config();
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const helpers = require("./common/Helpers");
const app = express();

//socket
const io = require("./socket_module/SocketServer");

//middleware
app.use(cors());
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
