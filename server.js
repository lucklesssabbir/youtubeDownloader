const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

/* View engine */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* Static files */
app.use(express.static(path.join(__dirname, "public")));

/* Body parser */
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.render("index");
});

app.post("/info", (req, res) => {
  const { url } = req.body;

  // Temporary dummy data (replace with yt-dlp output later)
  res.render("info", {
    title: "Sample YouTube Video",
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    url,
    formats: [
      { format_id: "18", ext: "mp4", resolution: "360p" },
      { format_id: "22", ext: "mp4", resolution: "720p" },
      { format_id: "140", ext: "m4a" }
    ]
  });
});

/* Error test route */
app.get("/error", (req, res) => {
  res.status(400).render("error", {
    message: "Test Error Page",
    details: "This is a sample error message."
  });
});

/* Start server */
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});