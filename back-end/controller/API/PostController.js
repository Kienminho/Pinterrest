const path = require("path");

const Utils = require("../../common/Utils");
const _FileService = require("../../common/FileService");
const _EmailService = require("../../common/EmailService");
const _Post = require("../../model/Post");
const _User = require("../../model/User");
const _Category = require("../../model/Category");
const _SavePost = require("../../model/SavePost");
const _Follow = require("../../model/Follow");
const _AIController = require("./AIController");
const _CategoryController = require("./CategoryController");
const _FileController = require("./FileController");

const HandleGetPostsByCategories = async (req, res) => {
  try {
    const { pageIndex, pageSize } = req.query;
    const currentUser = await _User.findById(req.user.id);
    let posts = []; //nếu category của user rỗng thì lấy tất cả bài viết
    if (currentUser.Category.length === 0) {
      posts = await _Post
        .find({ IsDeleted: false })
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
          IsDeleted: false,
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
    const posts = await _Post
      .find({ Created: req.params.id, IsDeleted: false })
      .populate({
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
    const { Title, Description, IsComment = true, Attachment } = req.body;
    //validate
    if (!Title || !Attachment) {
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
    console.log(data);

    //response from AI
    const resData = data
      .split("\n")
      .map((item) => item.substring(item.indexOf(".") + 2));
    console.log(resData);
    //add category to post
    const listCategory = await AddCategoryToPost(resData);

    const newPost = req.body;
    newPost.Created = req.user.id;
    newPost.Category = listCategory;
    const post = new _Post(newPost);
    await post.save();

    //send email to follower
    const recipients = await createTemplate(req.user.id, req.user.name, post);
    await _EmailService.sendNotification(recipients);
    res.json(Utils.createSuccessResponseModel(0, true));
  } catch (error) {
    console.log("PostController -> HandleCreatePost: " + error.message);
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

const AdminCreatePost = async (req, res) => {
  try {
    const { File } = req.body;
    const fileSanity = await _FileService.uploadImageToSanity(File.path);
    //upload file to cloud
    const data = {
      name: req.user.name,
      filename: req.body.File.filename,
    };
    //create attachment
    const attachment = await _FileController.createFileAttachment(
      data,
      fileSanity,
      "UPLOAD"
    );
    const ThumbnailPath = fileSanity.url;
    const Attachment = {
      Id: attachment._id,
      Thumbnail: ThumbnailPath,
    };

    req.body.Attachment = Attachment;

    await HandleCreatePost(req, res);
  } catch (error) {
    console.log("PostController -> AdminCreatePost: " + error.message);
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

const HandleUpdatePost = async (req, res) => {
  try {
    const { PostId, Title, Description, IsComment = true } = req.body;
    //validate
    if (!Title || !PostId) {
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

const HandleDeletePost = async (req, res) => {
  try {
    const id = req.params.id;

    const post = await _Post.findById(id);
    if (!post)
      return res
        .status(400)
        .json(Utils.createErrorResponseModel("Bài đăng không tồn tại!"));
    post.IsDeleted = true;
    post.UpdateAt = Date.now();
    post.Updated = req.user.id;
    await post.save();
    res.json(Utils.createSuccessResponseModel(0, true));
  } catch (error) {
    console.log("PostController -> HandleDeletePost: " + error.message);
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

//primary function
//create template send email to follower when user create post
const createTemplate = async (id, userCreatedPost, post) => {
  //get follower list and just get UserName and Email.
  let followerList = await _Follow
    .find({ following: id })
    .populate("follower", "UserName Email");

  //get list follower
  followerList = followerList.map((item) => item.follower);

  const templatePath = path.join(
    __dirname,
    "../..",
    "views",
    "email-template.html"
  );

  let recipients = [];
  //create list template and email to send
  for (const follower of followerList) {
    let content = `<div class="content">
                      <p>Xin chào <strong>${follower.UserName}</strong>,</p>
                      <p><strong>${userCreatedPost}</strong> vừa có một bài đăng mới:</p>
                      <h2>${post.Title}</h2>
                      <img src="${post.Attachment.Thumbnail}" alt="${post.Description}">
                      <p>Xem bài đăng <a href="https://pinterrest.vercel.app/pin/${post._id}" class="link">Tại đây</a>.</p>
                    </div>`;

    let footer = `<div class="footer">
                    <p>Truy cập vào <strong>Pinspired</strong> để xem các bài đăng khác!</p>
                    <a href="https://pinterrest.vercel.app" class="btn">Truy cập ngay</a>
                  </div>`;

    //replace template to @@content and @@footer
    let template = Utils.readAllFile(templatePath);
    template = template.replace("@@content@@", content);
    template = template.replace("@@footer@@", footer);

    recipients.push({ email: follower.Email, content: template });

    return recipients;
  }
};

module.exports = {
  HandleGetPostsByCategories: HandleGetPostsByCategories,
  HandleGetPostsByUser: HandleGetPostsByUser,
  HandleGetDetailPost: HandleGetDetailPost,
  HandleCreatePost: HandleCreatePost,
  AdminCreatePost: AdminCreatePost,
  HandleUpdatePost: HandleUpdatePost,
  HandleDeletePost: HandleDeletePost,
  CreateQuestion: createQuestion,
  SearchPost: searchPost,
  HandleSavePost: HandleSavePost,
  HandleUnSavePost: HandleUnSavePost,
  HandleGetSavePosts: HandleGetSavePost,
};
