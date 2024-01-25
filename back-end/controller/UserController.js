const EmailService = require("../common/EmailService");
const Utils = require("../common/Utils");
const AuthenticateService = require("../common/AuthenticateService");

const User = require("../model/User");

/// <summary>
/// Handle register
/// </summary>
const HandleRegister = async (req, res) => {
  try {
    const newUser = req.body;
    //check email exist
    const userExist = await User.findOne({ Email: newUser.Email });
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
    const user = new User(newUser);
    await user.save();
    res.json(Utils.createSuccessResponseModel());
  } catch (error) {
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
    const user = await User.findOne({ Email: Email, IsDeleted: false });
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
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

/// <summary>
/// Handle logout
/// </summary>
const HandleLogout = async (req, res) => {
  const user = await User.findById(req.user.id);
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
  const userExist = await User.findOne({ Email: req.params.email });
  if (!userExist) {
    return res
      .status(400)
      .json(Utils.createErrorResponseModel("Người dùng không tồn tại."));
  }
  return res.json(Utils.createSuccessResponseModel(1, userExist));
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
    const user = await User.findById(req.user.id);
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
    const user = await User.findOne({ Email: email, IsDeleted: false });
    if (!user) {
      return res
        .status(400)
        .json(Utils.createErrorResponseModel("Người dùng không tồn tại."));
    }

    if (Utils.validatePassword(newPassword, user.Password)) {
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
};
