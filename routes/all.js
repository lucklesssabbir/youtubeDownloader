const express = require("express");
const router = express.Router();

// INDEX PAGE
router.get("/", (req, res) => {
  res.render("index"); // your index.ejs
});

// ERROR PAGE
router.get("/error", (req, res) => {
  res.status(404).render("error", { message: "Oops! Page not found." });
});

// SINGLE VIDEO PAGE
router.get("/single", (req, res) => {
  res.render("info"); // placeholder, info.ejs
});

// PLAYLIST PAGE
router.get("/playlist", (req, res) => {
  res.send("Playlist page"); // placeholder
});

// VIDEO + PLAYLIST
router.get("/both", (req, res) => {
  res.send("Video in playlist page"); // placeholder
});

module.exports = router;