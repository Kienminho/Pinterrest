const Utils = require("../common/Utils");
const _Post = require("../model/Post");

const HandleGetPostsByUser = async (req, res) => {
  try {
    const posts = await _Post
      .find({ Created: req.user.id })
      .populate("Created");
    res.json(Utils.createSuccessResponseModel(posts.length, posts));
  } catch (error) {
    console.log("PostController -> HandleGetPostsByUser: " + error.message);
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

const HandleGetDetailPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await _Post.findById(postId).populate("Created");
    res.json(Utils.createSuccessResponseModel(1, post));
  } catch (error) {
    console.log("PostController -> HandleGetDetailPost: " + error.message);
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

const HandleCreatePost = async (req, res) => {
  try {
    const { Title, Description, Attachment } = req.body;
    //validate
    if (!Title || !Description || !Attachment) {
      return res
        .status(400)
        .json(
          Utils.createErrorResponseModel("Vui lòng nhập đầy đủ thông tin!")
        );
    }

    const newPost = req.body;
    newPost.Created = req.user.id;
    const post = new _Post(newPost);
    await post.save();
    res.json(Utils.createSuccessResponseModel(0, true));
  } catch (error) {
    console.log("PostController -> HandleCreatePost: " + error.message);
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

const HandleUpdatePost = async (req, res) => {
  try {
    const { PostId, Title, Description, IsComment = true } = req.body;
    //validate
    if (!Title || !Description) {
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
    existPost.Title = Title;
    existPost.Description = Description;
    existPost.IsComment = IsComment;
    existPost.Updated = req.user.id;
    existPost.UpdateAt = Date.now();
    await existPost.save();
    res.json(Utils.createSuccessResponseModel(0, true));
  } catch (error) {
    console.log("PostController -> HandleCreatePost: " + error.message);
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

module.exports = {
  HandleGetPostsByUser: HandleGetPostsByUser,
  HandleGetDetailPost: HandleGetDetailPost,
  HandleCreatePost: HandleCreatePost,
  HandleUpdatePost: HandleUpdatePost,
};
