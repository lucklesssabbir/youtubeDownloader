module.exports = (req, res, next) => {
  if (req.mediaType !== "both") return next();

  res.send("Video inside playlist handler");
};