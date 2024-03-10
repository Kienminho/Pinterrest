const Utils = require("../../common/Utils");
const _FileService = require("../../common/FileService");
const _Post = require("../../model/Post");
const _User = require("../../model/User");
const _Category = require("../../model/Category");
const _AIController = require("./AIController");
const _CategoryController = require("./CategoryController");

const HandleGetPostsByCategories = async (req, res) => {
  try {
    const { pageIndex, pageSize } = req.query;
    const currentUser = await _User.findById(req.user.id);
    let posts = []; //nếu category của user rỗng thì lấy tất cả bài viết
    if (currentUser.Category.length === 0) {
      posts = await _Post.find({}).populate("Created");
    } else {
      posts = await _Post
        .find({
          Category: { $in: currentUser.Category },
        })
        .populate({
          path: "Created",
          select: "UserName Avatar",
        })
        .select("-Category");
    }
    //phân trang
    const data = posts
      .slice((pageIndex - 1) * pageSize, pageSize)
      .sort((a, b) => b.CreatedAt - a.CreatedAt);
    res.json(Utils.createSuccessResponseModel(posts.length, data));
  } catch (error) {
    console.log(
      "PostController -> HandleGetPostsByCategories: " + error.message
    );
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

const HandleGetPostsByUser = async (req, res) => {
  try {
    const posts = await _Post.find({ Created: req.user.id }).populate({
      path: "Created",
      select: "UserName Avatar",
    });
    res.json(Utils.createSuccessResponseModel(posts.length, posts));
  } catch (error) {
    console.log("PostController -> HandleGetPostsByUser: " + error.message);
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

const HandleGetDetailPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await _Post.findById(postId).populate({
      path: "Created",
      select: "UserName Avatar",
    });
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

    //get base64 from file path
    const base64 = await _FileService.getBase64FromFile(Attachment.Thumbnail);
    const text = await createQuestion();
    const data = await _AIController.createNonStreamingMultipartContent(
      "appstore-384314",
      "us-central1",
      "gemini-1.0-pro-vision",
      base64,
      "image/jpeg",
      text
    );

    //response from AI
    const resData = data
      .split("\n")
      .map((item) => item.substring(item.indexOf(".") + 2));
    //add category to post
    const listCategory = await AddCategoryToPost(resData);

    const newPost = req.body;
    newPost.Created = req.user.id;
    newPost.Category = listCategory;
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

const createQuestion = async () => {
  const listCategory = await _Category.find({});
  return listCategory
    .map((category) => `${category.Index}.${category.Name}`)
    .join(" ");
};

const AddCategoryToPost = async (listCategory) => {
  let result = [];
  for (const category of listCategory) {
    const existCategory = await _Category.findOne({ Name: category });
    if (!existCategory) {
      const listCategory = [{ Name: category }];
      const newCategory = await _CategoryController.CreateCategory(
        listCategory
      );
      result.push(newCategory.Index);
    } else {
      result.push(existCategory.Index);
    }
  }
  return result;
};

module.exports = {
  HandleGetPostsByCategories: HandleGetPostsByCategories,
  HandleGetPostsByUser: HandleGetPostsByUser,
  HandleGetDetailPost: HandleGetDetailPost,
  HandleCreatePost: HandleCreatePost,
  HandleUpdatePost: HandleUpdatePost,
  createQuestion: createQuestion,
};
