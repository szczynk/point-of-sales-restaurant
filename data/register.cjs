/* eslint-disable no-undef */
module.exports = (req, _res, next) => {
  const { path, method } = req;

  const registerPath =
    path === "/users" || path === "/register" || path === "/signup";

  if (method === "POST" && registerPath) {
    req.body.role = "customer";
  }

  next();
};
