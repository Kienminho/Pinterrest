const Utils = require("../../common/Utils");
const _FileService = require("../../common/FileService");
const _Post = require("../../model/Post");
const _User = require("../../model/User");
const _Category = require("../../model/Category");
const _SavePost = require("../../model/SavePost");
const _AIController = require("./AIController");
const _CategoryController = require("./CategoryController");

const HandleGetPostsByCategories = async (req, res) => {
  try {
    const { pageIndex, pageSize } = req.query;
    const currentUser = await _User.findById(req.user.id);
    let posts = []; //nếu category của user rỗng thì lấy tất cả bài viết
    if (currentUser.Category.length === 0) {
      posts = await _Post
        .find({})
        .select("-Category")
        .populate({
          path: "Created",
          select: "UserName Avatar FullName Email",
        })
        .sort({ CreatedAt: -1 });
    } else {
      posts = await _Post
        .find({
          Category: { $in: currentUser.Category },
        })
        .populate({
          select: "-Category",
          path: "Created",
          select: "UserName Avatar FullName Email",
        })
        .sort({ CreatedAt: -1 });
    }
    //phân trang
    const data = posts.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
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
    const posts = await _Post.find({ Created: req.params.id }).populate({
      path: "Created",
      select: "UserName Avatar FullName Email",
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
      "pinterest-417305",
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

const searchPost = async (req, res) => {
  try {
    const { keyword, pageIndex, pageSize } = req.query;
    //search post by title, description and isDeleted== false and return totalRecords to client pagination
    const pipeline = [
      {
        $match: {
          $or: [
            { Title: { $regex: keyword, $options: "i" } },
            { Description: { $regex: keyword, $options: "i" } },
          ],
          IsDeleted: false,
        },
      },
      {
        $lookup: {
          from: "users", // replace with your actual users collection name
          localField: "Created",
          foreignField: "_id",
          as: "Created",
        },
      },
      { $unwind: "$Created" },
      {
        $sort: { CreatedAt: -1 },
      },
      {
        $facet: {
          totalCount: [{ $count: "count" }],
          data: [
            { $skip: (parseInt(pageIndex) - 1) * parseInt(pageSize) },
            { $limit: parseInt(pageSize) },
            {
              $project: {
                Title: 1,
                Description: 1,
                Attachment: 1,
                TotalLike: 1,
                TotalComment: 1,
                IsComment: 1,
                SimilarPosts: 1,
                CreatedAt: 1,
                Created: { _id: 1, UserName: 1, Avatar: 1 },
              },
            },
          ],
        },
      },
      {
        $project: {
          totalCount: { $arrayElemAt: ["$totalCount.count", 0] },
          data: 1,
        },
      },
    ];

    const result = await _Post.aggregate(pipeline);

    const totalCount = result[0]?.totalCount || 0;
    const data = result[0]?.data || [];
    res.json(Utils.createSuccessResponseModel(totalCount, data));
  } catch (error) {
    console.log("PostController -> searchPost: " + error.message);
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

const HandleSavePost = async (req, res) => {
  const { postId, userId } = req.body;
  try {
    const existPost = await _Post.findById(postId);
    if (!existPost) {
      return res
        .status(400)
        .json(Utils.createErrorResponseModel("Bài đăng không tồn tại!"));
    }

    const existUser = await _User.findById(userId);
    if (!existUser) {
      return res
        .status(400)
        .json(Utils.createErrorResponseModel("Người dùng không tồn tại!"));
    }

    const existSavePost = await _SavePost.findOne({
      User: userId,
      Post: postId,
    });
    if (existSavePost) {
      return res
        .status(400)
        .json(Utils.createErrorResponseModel("Bài đăng đã được lưu!"));
    }

    const savePost = new _SavePost({
      User: userId,
      Post: postId,
    });
    await savePost.save();
    res.json(Utils.createSuccessResponseModel(0, true));
  } catch (error) {
    console.log("PostController -> HandleSavePost: " + error.message);
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

const HandleUnSavePost = async (req, res) => {
  const { postId, userId } = req.body;
  try {
    const existSavePost = await _SavePost.findOne({
      User: userId,
      Post: postId,
    });
    if (!existSavePost) {
      return res
        .status(400)
        .json(Utils.createErrorResponseModel("Bài đăng chưa được lưu!"));
    }
    await existSavePost.deleteOne();
    res.json(Utils.createSuccessResponseModel(0, true));
  } catch (error) {
    console.log("PostController -> HandleUnSavePost: " + error.message);
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

//get list save post of user
const HandleGetSavePost = async (req, res) => {
  try {
    const { pageIndex, pageSize } = req.query;

    const countQuery = _SavePost.countDocuments({ User: req.body.id });

    const savePostsQuery = _SavePost
      .find({ User: req.body.id })
      .populate({
        select: "-Category",
        path: "Post",
        populate: {
          path: "Created",
          select: "UserName Avatar FullName Email",
        },
      })
      .sort({ CreatedAt: -1 });

    const totalRecords = await countQuery;
    const data = await savePostsQuery
      .skip((pageIndex - 1) * pageSize)
      .limit(pageSize);
    return res.json(Utils.createSuccessResponseModel(totalRecords, data));
  } catch (error) {
    console.log("PostController -> HandleGetSavePost: " + error.message);
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

module.exports = {
  HandleGetPostsByCategories: HandleGetPostsByCategories,
  HandleGetPostsByUser: HandleGetPostsByUser,
  HandleGetDetailPost: HandleGetDetailPost,
  HandleCreatePost: HandleCreatePost,
  HandleUpdatePost: HandleUpdatePost,
  CreateQuestion: createQuestion,
  SearchPost: searchPost,
  HandleSavePost: HandleSavePost,
  HandleUnSavePost: HandleUnSavePost,
  HandleGetSavePosts: HandleGetSavePost,
};
