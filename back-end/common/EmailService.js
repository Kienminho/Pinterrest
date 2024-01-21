const nodemailer = require("nodemailer");

const sendMail = async (email, code, username) => {
  const html = `<h1>Chào ${username}</h1>
  <p> Mã xác minh tài khoản của bạn là: ${code} </p>
  <p> Mã xác minh có hiệu lực trong 5 phút.</p>`;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "Hopkien1609@gmail.com", // Email người gửi
      pass: "vptxiuwznddhfzdl", // Mật khẩu email người gửi
    },
  });
  // Cấu hình nội dung email
  const mailOptions = {
    from: "Hopkien1609@gmail.com", // Email người gửi
    to: email, // Email người nhận
    subject: "Xác thực người dùng", // Tiêu đề email
    html: html, // Nội dung email
  };
  // Gửi email
  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return false;
    } else {
      console.log("Email sent: " + info.response);
      return true;
    }
  });
};

module.exports = {
  sendMail: sendMail,
};
