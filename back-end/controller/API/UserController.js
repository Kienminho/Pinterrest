const axios = require("axios");

const EmailService = require("../../common/EmailService");
const Utils = require("../../common/Utils");
const AuthenticateService = require("../../common/AuthenticateService");
const _User = require("../../model/User");
const _Follow = require("../../model/Follow");

const AuthenticateGoogleCallback = async (req, res) => {
  try {
    const access_token = req.body.token;
    if (!access_token)
      return res
        .status(400)
        .json(Utils.createErrorResponseModel("Token không hợp lệ."));
    const user = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const { email, name, picture } = user.data;
    let userExist = await _User.findOne({ Email: email, TypeLogin: "google" });
    if (userExist) {
      if (userExist.FirstLogin) userExist.FirstLogin = false;
      const accessToken = AuthenticateService.generateAccessToken(userExist);
      const refreshToken = AuthenticateService.generateRefreshToken(userExist);
      userExist.RefreshToken = refreshToken;
      if (userExist.Avatar === picture) userExist.Avatar = picture;
      await userExist.save();
      return res.json(
        Utils.createSuccessResponseModel(1, {
          UserName: userExist.UserName,
          Email: userExist.Email,
          Avatar: userExist.Avatar,
          FirstLogin: userExist.FirstLogin,
          AccessToken: accessToken,
          RefreshToken: refreshToken,
        })
      );
    } else {
      userExist = {
        Email: email,
        FullName: name,
        Password: "",
        UserName: Utils.getUserNameByEmail(email),
        Avatar: picture,
        FirstLogin: true,
        TypeLogin: "google",
      };

      const user = new _User(userExist);
      await user.save();
      const accessToken = AuthenticateService.generateAccessToken(user);
      const refreshToken = AuthenticateService.generateRefreshToken(user);
      user.RefreshToken = refreshToken;
      await user.save();
      return res.json(
        Utils.createSuccessResponseModel(1, {
          UserName: user.UserName,
          Email: user.Email,
          Avatar: user.Avatar,
          FirstLogin: user.FirstLogin,
          AccessToken: accessToken,
          RefreshToken: refreshToken,
        })
      );
    }
  } catch (error) {
    console.log("Payload: " + req.body);
    console.log(
      "UserController -> AuthenticateGoogleCallback: " + error.message
    );
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

/// <summary>
/// Handle register
/// </summary>
const HandleRegister = async (req, res) => {
  try {
    const regex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
    if (!regex.test(req.body.Email)) {
      return res
        .status(400)
        .json(
          Utils.createErrorResponseModel(
            "Email không hợp lệ, vui lòng thử lại."
          )
        );
    }
    const newUser = req.body;
    //check email exist
    const userExist = await _User.findOne({ Email: newUser.Email });
    if (userExist) {
      return res
        .status(400)
        .json(
          Utils.createErrorResponseModel(
            `Người dùng có email ${newUser.Email} đã tồn tại.`
          )
        );
    }

    const checkPassword = Utils.checkFormatPassword(newUser.Password);
    if (!checkPassword) {
      return res
        .status(400)
        .json(
          Utils.createErrorResponseModel(
            "Mật khẩu phải có ít nhất 8 ký tự, trong đó có ít nhất 1 chữ hoa, 1 chữ thường và 1 số."
          )
        );
    }
    //hash password
    newUser.Password = Utils.hashPassword(newUser.Password);
    newUser.UserName = Utils.getUserNameByEmail(newUser.Email);
    //create new user
    const user = new _User(newUser);
    await user.save();
    res.json(Utils.createSuccessResponseModel());
  } catch (error) {
    console.log("UserController -> HandleRegister: " + error.message);
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

/// <summary>
/// Handle login
/// </summary>
const HandleLogin = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    //check email exist
    const user = await _User.findOne({ Email: Email, IsDeleted: false });
    if (!user) {
      return res
        .status(400)
        .json(Utils.createErrorResponseModel("Người dùng không tồn tại."));
    }
    //check password
    const isMatch = await Utils.validatePassword(Password, user.Password);
    if (!isMatch) {
      return res
        .status(400)
        .json(
          Utils.createErrorResponseModel(
            "Mật khẩu không chính xác, vui lòng thử lại."
          )
        );
    }

    //create token
    const accessToken = AuthenticateService.generateAccessToken(user);
    const refreshToken = AuthenticateService.generateRefreshToken(user);
    if (!refreshToken === "") user.FirstLogin = false;
    //save refreshToken
    user.RefreshToken = refreshToken;
    await user.save();
    //response
    const userResponse = {
      UserName: user.UserName,
      Email: user.Email,
      Avatar: user.Avatar,
      FirstLogin: user.FirstLogin,
      AccessToken: accessToken,
      RefreshToken: refreshToken,
    };
    //check admin
    if (user.Role === "admin") {
      userResponse.Role = "admin";
    }
    return res
      .status(200)
      .json(Utils.createSuccessResponseModel(1, userResponse));
  } catch (error) {
    console.log("UserController -> HandleLogin: " + error.message);
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

/// <summary>
/// Handle logout
/// </summary>
const HandleLogout = async (req, res) => {
  const user = await _User.findById(req.user.id);
  if (!user) {
    return res
      .status(400)
      .json(Utils.createErrorResponseModel("Người dùng không tồn tại."));
  }
  //save refreshToken
  user.RefreshToken = "";
  await user.save();
  return res.json(Utils.createSuccessResponseModel(1, true));
};

/// <summary>
/// Get user by email
/// </summary>
const GetUserByEmail = async (req, res) => {
  try {
    const userExist = await _User.findOne({ Email: req.body.Email });
    if (!userExist) {
      return res
        .status(400)
        .json(Utils.createErrorResponseModel("Người dùng không tồn tại."));
    }
    return res.json(Utils.createSuccessResponseModel(1, userExist));
  } catch (error) {
    console.log("UserController -> GetUserByEmail: " + error.message);
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

/// <summary>
/// Send mail
/// </summary>
const SendMail = async (req, res) => {
  try {
    const code = Utils.generateVerificationCode();
    const username = Utils.getUserNameByEmail(req.body.Email);
    await EmailService.sendMail(req.body.Email, code, username);

    return res.status(200).json(
      Utils.createSuccessResponseModel(1, {
        code: code,
        username: username,
      })
    );
  } catch (error) {
    console.log("UserController -> SendMail: " + error.message);
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

/// <summary>
/// Get access token by refresh token
/// </summary>
const GetAccessTokenByRefreshToken = async (req, res) => {
  try {
    const user = await _User.findById(req.user.id);
    if (!user) {
      return res
        .status(400)
        .json(Utils.createErrorResponseModel("Người dùng không tồn tại."));
    }
    //create token
    const accessToken = AuthenticateService.generateAccessToken(user);
    return res.json(
      Utils.createSuccessResponseModel(1, { AccessToken: accessToken })
    );
  } catch (error) {
    console.log(
      "UserController -> GetAccessTokenByRefreshToken: " + error.message
    );
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

/// <summary>
/// Forgot password
/// </summary>
const ForgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    //check email exist
    const user = await _User.findOne({ Email: email, IsDeleted: false });
    if (!user) {
      return res
        .status(400)
        .json(Utils.createErrorResponseModel("Người dùng không tồn tại."));
    }

    const checked = await Utils.validatePassword(newPassword, user.Password); // check new password is same old password
    if (checked) {
      return res
        .status(400)
        .json(
          Utils.createErrorResponseModel(
            "Mật khẩu mới không được trùng với mật khẩu cũ."
          )
        );
    }
    //hash password
    user.Password = Utils.hashPassword(newPassword);
    //save user
    await user.save();
    return res.json(Utils.createSuccessResponseModel());
  } catch (error) {
    console.log("UserController -> ForgotPassword: " + error.message);
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

const UpdateInfo = async (req, res) => {
  try {
    const userExist = await _User.findById(req.user.id);
    if (!userExist) {
      return res
        .status(400)
        .json(Utils.createErrorResponseModel("Người dùng không tồn tại."));
    }

    //update info
    const newUser = { ...userExist.toObject(), ...req.body };
    newUser.UpdateAt = Date.now();

    //save user
    const result = await _User.updateOne({ _id: req.user.id }, newUser);
    return res.json(
      Utils.createSuccessResponseModel(0, result.modifiedCount > 0)
    );
  } catch (error) {
    console.log("UserController -> UpdateInfo: " + error.message);
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

const UpdateAvatar = async (req, res) => {
  try {
    const userExist = await _User.findById(req.user.id);
    console.log(req.body.newAvatar);
    userExist.Avatar = req.body.newAvatar;
    await userExist.save();
    return res.json(
      Utils.createSuccessResponseModel(0, "Cập nhật ảnh đại diện thành công.")
    );
  } catch (error) {
    console.log("UserController -> UpdateAvatar: " + error.message);
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

const HandleFollow = async (req, res) => {
  try {
    const { follower, following } = req.body;
    //check user exist
    const followerExist = await _User.findById(follower);
    if (!followerExist) {
      return res
        .status(400)
        .json(Utils.createErrorResponseModel("Người dùng không tồn tại."));
    }
    const followingExist = await _User.findById(following);
    if (!followingExist) {
      return res
        .status(400)
        .json(Utils.createErrorResponseModel("Người dùng không tồn tại."));
    }
    //check follow exist
    const followExist = await _Follow.findOne({
      follower: follower,
      following: following,
    });
    if (followExist) {
      return res
        .status(200)
        .json(
          Utils.createErrorResponseModel("Bạn đã theo dõi người dùng này.")
        );
    }
    //create follow
    const follow = new _Follow({
      follower: follower,
      following: following,
    });
    await follow.save();
    return res.json(Utils.createSuccessResponseModel(0, true));
  } catch (error) {
    console.log("UserController -> HandleFollow: " + error.message);
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

const HandleUnFollow = async (req, res) => {
  try {
    const { id } = req.params;
    //check user exist
    const followExist = await _Follow.findById(id);
    if (!followExist) {
      return res
        .status(400)
        .json(Utils.createErrorResponseModel("Người dùng không tồn tại."));
    }
    //delete follow
    const result = await _Follow.deleteOne({ _id: id });
    return res.json(
      Utils.createSuccessResponseModel(0, result.deletedCount > 0)
    );
  } catch (error) {
    console.log("UserController -> HandleUnFollow: " + error.message);
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

const GetFollowing = async (req, res) => {
  try {
    const id = req.params.id;
    //check user exist
    const userExist = await _User.findById(id);
    if (!userExist) {
      return res
        .status(400)
        .json(Utils.createErrorResponseModel("Người dùng không tồn tại."));
    }
    //get following list
    const followingList = await _Follow
      .find({ follower: id })
      .populate("following");
    return res.json(Utils.createSuccessResponseModel(1, followingList));
  } catch (error) {
    console.log("UserController -> GetFollowing: " + error.message);
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

const GetFollower = async (req, res) => {
  try {
    const id = req.params.id;
    //check user exist
    const userExist = await _User.findById(id);
    if (!userExist) {
      return res
        .status(400)
        .json(Utils.createErrorResponseModel("Người dùng không tồn tại."));
    }
    //get follower list
    const followerList = await _Follow
      .find({ following: id })
      .populate("follower");
    return res.json(Utils.createSuccessResponseModel(1, followerList));
  } catch (error) {
    console.log("UserController -> GetFollower: " + error.message);
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

const SearchUser = async (req, res) => {
  try {
    const { keyword, pageIndex, pageSize } = req.query;
    const query = await _User
      .find({
        UserName: { $regex: keyword, $options: "i" },
        IsDeleted: false,
        Role: "user",
        // Match users with IDs not equal to the logged-in user's ID
        _id: { $ne: req.user.id },
      })
      .select("UserName Avatar Email FullName");

    const data = query.slice((pageIndex - 1) * pageSize, pageSize);
    // const pipeline = [
    //   {
    //     $match: {
    //       UserName: { $regex: keyword, $options: "i" },
    //       IsDeleted: false,
    //       Role: "user",
    //       // Match users with IDs not equal to the logged-in user's ID
    //       _id: { $ne: req.user.id },
    //     },
    //   },
    //   {
    //     $facet: {
    //       totalRecord: [{ $count: "count" }],
    //       userList: [
    //         { $skip: (pageIndex - 1) * pageSize },
    //         { $limit: parseInt(pageSize) },
    //         {
    //           $project: {
    //             UserName: 1,
    //             Avatar: 1,
    //             Email: 1,
    //             FullName: 1,
    //             Gender: 1,
    //             Birthday: 1,
    //             Category: 1,
    //             _id: 1,
    //           },
    //         },
    //       ],
    //     },
    //   },
    // ];

    // const result = await _User.aggregate(pipeline);

    // const totalRecord = result[0]?.totalRecord[0]?.count || 0;
    // const userList = result[0]?.userList || [];

    return res.json(Utils.createSuccessResponseModel(query.length, data));
  } catch (error) {
    console.log("UserController -> SearchUser: " + error.message);
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

module.exports = {
  AuthenticateGoogleCallback: AuthenticateGoogleCallback,
  HandleRegister: HandleRegister,
  HandleLogin: HandleLogin,
  HandleLogout: HandleLogout,
  GetUserByEmail: GetUserByEmail,
  SendMail: SendMail,
  GetAccessTokenByRefreshToken: GetAccessTokenByRefreshToken,
  ForgotPassword: ForgotPassword,
  UpdateInfo: UpdateInfo,
  UpdateAvatar: UpdateAvatar,
  HandleFollow: HandleFollow,
  HandleUnFollow: HandleUnFollow,
  GetFollowing: GetFollowing,
  GetFollower: GetFollower,
  SearchUser: SearchUser,
};
