const express = require("express");
const router = express.Router();

const analyze = require("./analyze");
const singleHandler = require("./single");
const playlistHandler = require("./playlist");
const bothHandler = require("./both");

// homepage
router.get("/", (req, res) => {
  res.render("index");
});

// ONE ENTRY POINT
router.post("/info", analyze, singleHandler, playlistHandler, bothHandler);

module.exports = router;