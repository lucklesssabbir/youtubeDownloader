const { spawn } = require("child_process");

module.exports = (req, res, next) => {
  if (req.mediaType !== "single") return next();

  const url = req.mediaUrl;

