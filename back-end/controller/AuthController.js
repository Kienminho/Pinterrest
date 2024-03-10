const renderLogin = (req, res) => {
  res.render("login", { layout: "authLayout" });
};

module.exports = {
  RenderLogin: renderLogin,
};
