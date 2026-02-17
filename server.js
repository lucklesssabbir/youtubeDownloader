const express = require("express");
const path = require("path");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Ensure downloads folder exists
const downloadsDir = path.join(__dirname, "downloads");
if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir);

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

// Info route - fetch video info
app.post("/info", (req, res) => {
  const videoUrl = req.body.url;

  // Simple YouTube URL validation
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  if (!youtubeRegex.test(videoUrl)) return res.redirect("/error");

  // Fetch video info using yt-dlp
  exec(`yt-dlp -J "${videoUrl}"`, (err, stdout) => {
    if (err) return res.redirect("/error");

    try {
      const info = JSON.parse(stdout);

      // Prepare formats (filter mp4/m4a)
      const formats = info.formats
        .filter(f => f.ext === "mp4" || f.ext === "m4a")
        .map(f => ({
          format_id: f.format_id,
          ext: f.ext,
          resolution: f.format || null
        }));

      res.render("info", {
        title: info.title,
        thumbnail: info.thumbnail,
        url: videoUrl,
        formats
      });
    } catch (parseErr) {
      return res.redirect("/error");
    }
  });
});

// Download route
app.post("/download", (req, res) => {
  const { url, format } = req.body;
  if (!url || !format) return res.redirect("/error");

  // Filename
  const ext = format.includes("m4a") ? "m4a" : "mp4";
  const fileName = `video_${Date.now()}.${ext}`;
  const filePath = path.join(downloadsDir, fileName);

  // Download command
  const cmd = `yt-dlp -f ${format} -o "${filePath}" "${url}"`;

  exec(cmd, (err) => {
    if (err) return res.redirect("/error");

    // Send file to client
    res.download(filePath, fileName, (downloadErr) => {
      if (downloadErr) console.log(downloadErr);
    });
  });
});

// Error page
app.get("/error", (req, res) => {
  res.status(400).render("error", {
    message: "Oops! Something went wrong.",
    details: "Invalid URL or page not found."
  });
});

// Catch-all redirect to /error
app.use((req, res) => {
  res.redirect("/error");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});