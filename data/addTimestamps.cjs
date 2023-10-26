/* eslint-disable no-undef */
module.exports = (req, _res, next) => {
  const { method } = req;
  const timestamp = Math.floor(Date.now() / 1000);

  if (method === "POST") {
    req.body.createdAt = timestamp;
  }

  if (["PUT", "PATCH"].includes(method)) {
    req.body.updatedAt = timestamp;
  }

  // Continue to JSON Server router
  next();
};
