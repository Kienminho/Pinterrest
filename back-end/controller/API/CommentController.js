const path = require("path");
const Utils = require("../../common/Utils");
const _EmailService = require("../../common/EmailService");
const _User = require("../../model/User");
const _Comment = require("../../model/Comment");
const _Post = require("../../model/Post");

const HandleGetCommentsByPost = async (req, res) => {
  try {
    const postId = req.params.postId;

    // Get all comments of post and sort by createdAt
    let comments = await _Comment
      .find({ postId: postId, parentComment: null })
      .sort({ createdAt: -1 });

    // For each comment, get its replies
    for (let comment of comments) {
      comment.replies = await getCommentReplies(comment);
    }

    res.json(Utils.createSuccessResponseModel(comments.length, comments));
  } catch (error) {
    console.log(
      "CommentController - HandleGetCommentsByPost: " + error.message
    );
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

const HandleCreateComment = async (req, res) => {
  try {
    const { PostId, Content, Attachment } = req.body;
    //validate
    if (!PostId || !Content) {
      return res
        .status(400)
        .json(
          Utils.createErrorResponseModel("Vui lòng nhập đầy đủ thông tin!")
        );
    }

    const existPost = await _Post.findById(PostId);
    if (!existPost) {
      return res
        .status(400)
        .json(Utils.createErrorResponseModel("Bài đăng không tồn tại!"));
    }

    //find user by id
    const currentUser = await _User.findById(req.user.id);

    const author = {
      name: req.user.name,
      avatar: currentUser.Avatar,
      email: currentUser.Email,
      id: req.user.id,
    };

    //create comment
    const comment = new _Comment({
      postId: PostId,
      content: Content,
      author: author,
      attachment: Attachment ?? null,
    });
    await comment.save();

    existPost.TotalComment = existPost.TotalComment + 1;
    await existPost.save();

    res.json(Utils.createSuccessResponseModel(0, true));
  } catch (error) {
    console.log("CommentController - HandleCreateComment: " + error.message);
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

const HandleCreateReply = async (req, res) => {
  try {
    const { PostId, Content, Attachment, ParentCommentId } = req.body;
    //validate
    if (!PostId || !Content || !ParentCommentId) {
      return res
        .status(400)
        .json(
          Utils.createErrorResponseModel("Vui lòng nhập đầy đủ thông tin!")
        );
    }

    const existPost = await _Post.findById(PostId);
    if (!existPost) {
      return res
        .status(400)
        .json(Utils.createErrorResponseModel("Bài đăng không tồn tại!"));
    }

    //find user by id
    const currentUser = await _User.findById(req.user.id);

    const author = {
      name: req.user.name,
      avatar: currentUser.Avatar,
      email: currentUser.Email,
      id: req.user.id,
    };

    //find parent comment
    const parentComment = await _Comment.findById(ParentCommentId);

    //create comment
    const comment = new _Comment({
      postId: PostId,
      content: Content,
      author: author,
      attachments: Attachment ?? null,
      parentComment: parentComment,
    });

    //add reply to parent comment
    parentComment.replies.push(comment);
    existPost.TotalComment += 1;

    await parentComment.save();
    await comment.save();
    await existPost.save();

    //send email notify to parent comment author
    const template = await createTemplateCommentNotify(comment);

    await _EmailService.sendNotification(
      [parentComment.author.email],
      template
    );
    return res.json(Utils.createSuccessResponseModel(0, true));
  } catch (error) {
    console.log("CommentController - HandleCreateComment: " + error.message);
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

//private function
const getCommentReplies = async (comment) => {
  const replies = await _Comment.find({ parentComment: comment._id });
  for (let reply of replies) {
    reply.replies = await getCommentReplies(reply);
  }
  return replies;
};

const createTemplateCommentNotify = async (commentId) => {
  const comment = await _Comment
    .findOne({ _id: commentId })
    .populate("parentComment");

  //find post
  const post = await _Post.findById(comment.postId);

  let content = `<div class="content">
                    <p>Xin chào ${comment.parentComment.author.name},</p>
                    <p>Bình luận của bạn về bài đăng "${post.Title}" đã nhận được phản hồi</p>
                    <p>${comment.content}</p>
                    <p>Xem <a href="https://pinterrest.vercel.app/pin/${post._id}" class="link">Tại đây</a>.</p>
                  </div>`;
  let footer = `<div class="footer">
                  <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi</p>
                </div>`;

  //replace template to @@content and @@footer
  const templatePath = path.join(
    __dirname,
    "../..",
    "views",
    "email-template.html"
  );
  let template = Utils.readAllFile(templatePath);
  template = template.replace("@@content@@", content);
  template = template.replace("@@footer@@", footer);
  return template;
};

module.exports = {
  HandleCreateComment: HandleCreateComment,
  HandleCreateReply: HandleCreateReply,
  HandleGetCommentsByPost: HandleGetCommentsByPost,
};
