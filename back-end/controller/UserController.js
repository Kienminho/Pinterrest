const EmailService = require("../common/EmailService");
const Utils = require("../common/Utils");
const AuthenticateService = require("../common/AuthenticateService");

const _User = require("../model/User");
const _Follow = require("../model/Follow");

/// <summary>
/// Handle register
/// </summary>
const HandleRegister = async (req, res) => {
  try {
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
    console.log("UserController - HandleRegister: " + error.message);
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
    //save refreshToken
    user.RefreshToken = refreshToken;
    await user.save();
    //response
    const userResponse = {
      UserName: user.UserName,
      Email: user.Email,
      AccessToken: accessToken,
      RefreshToken: refreshToken,
    };
    return res
      .status(200)
      .json(Utils.createSuccessResponseModel(1, userResponse));
  } catch (error) {
    console.log("UserController - HandleLogin: " + error.message);
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
    const userExist = await _User.findOne({ Email: req.params.email });
    if (!userExist) {
      return res
        .status(400)
        .json(Utils.createErrorResponseModel("Người dùng không tồn tại."));
    }
    return res.json(Utils.createSuccessResponseModel(1, userExist));
  } catch (error) {
    console.log("UserController - GetUserByEmail: " + error.message);
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
    console.log("UserController - SendMail: " + error.message);
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
      "UserController - GetAccessTokenByRefreshToken: " + error.message
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
    console.log("UserController - ForgotPassword: " + error.message);
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
    const newUser = { ...userExist, ...req.body };
    newUser.UpdateAt = Date.now();

    //save user
    const result = await _User.updateOne({ _id: req.user.id }, newUser);
    return res.json(
      Utils.createSuccessResponseModel(0, result.modifiedCount > 0)
    );
  } catch (error) {
    console.log("UserController - UpdateInfo: " + error.message);
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
    console.log("UserController - HandleFollow: " + error.message);
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
    console.log("UserController - HandleUnFollow: " + error.message);
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

const GetFollowing = async (req, res) => {
  try {
    const { id } = req.user;
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
    console.log("UserController - GetFollowing: " + error.message);
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

const GetFollower = async (req, res) => {
  try {
    const { id } = req.user;
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
    console.log("UserController - GetFollower: " + error.message);
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

module.exports = {
  HandleRegister: HandleRegister,
  HandleLogin: HandleLogin,
  HandleLogout: HandleLogout,
  GetUserByEmail: GetUserByEmail,
  SendMail: SendMail,
  GetAccessTokenByRefreshToken: GetAccessTokenByRefreshToken,
  ForgotPassword: ForgotPassword,
  UpdateInfo: UpdateInfo,
  HandleFollow: HandleFollow,
  HandleUnFollow: HandleUnFollow,
  GetFollowing: GetFollowing,
  GetFollower: GetFollower,
};
