module.exports = (req, res, next) => {
  if (req.mediaType !== "playlist") return next();

  res.send("Playlist handler coming soon");
};