const RenderDashboard = (req, res) => {
  res.render("dashboard", { layout: "mainLayout" });
};

const RenderUser = (req, res) => {
  res.render("manager-user", { layout: "mainLayout" });
};

module.exports = {
  RenderDashboard: RenderDashboard,
  RenderUser: RenderUser,
};
