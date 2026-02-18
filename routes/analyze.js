module.exports = (req, res, next) => {
  let url = req.body.url;

  // 1️⃣ Basic presence check
  if (!url) {
    return res.render("error", {
      errorTitle: "Invalid Input",
      errorMessage: "Please paste a media link.",
      errorType: "invalid_url"
    });
  }

  url = url.trim();

  // 2️⃣ Must be youtube domain
  const isYoutube = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(url);

  if (!isYoutube) {
    return res.render("error", {
      errorTitle: "Unsupported Link",
      errorMessage: "Only valid YouTube links are supported.",
      errorType: "invalid_url"
    });
  }

  // 3️⃣ Extract query parameters safely
  let videoId = null;
  let playlistId = null;

  try {
    const parsed = new URL(url.startsWith("http") ? url : "https://" + url);

    videoId = parsed.searchParams.get("v");
    playlistId = parsed.searchParams.get("list");

    // short link youtu.be/VIDEO_ID
    if (parsed.hostname.includes("youtu.be")) {
      videoId = parsed.pathname.replace("/", "");
    }

  } catch {
    return res.render("error", {
      errorTitle: "Invalid URL",
      errorMessage: "The link format is incorrect.",
      errorType: "invalid_url"
    });
  }

  // 4️⃣ Validate real content existence
  const hasVideo = videoId && videoId.length >= 6;
  const hasPlaylist = playlistId && playlistId.length >= 10;

  if (!hasVideo && !hasPlaylist) {
    return res.render("error", {
      errorTitle: "Incomplete Link",
      errorMessage: "The link does not contain a valid video or playlist.",
      errorType: "invalid_url"
    });
  }

  // 5️⃣ Determine type
  if (hasVideo && hasPlaylist) req.mediaType = "both";
  else if (hasPlaylist) req.mediaType = "playlist";
  else req.mediaType = "single";

  req.mediaUrl = url;

  next();
};