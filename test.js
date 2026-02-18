const { spawn } = require("child_process");

const url = "https://youtu.be/LCVildkk5Wk?si=Zl0W7xMB1SVSrczn";

// Spawn yt-dlp to show formats and basic info
const process = spawn("yt-dlp", [
  "--js-runtimes", "node",  // ensures extraction works
  "-F",                     // show all available formats
  "--print", "title",
  "--print", "duration",
  "--print", "thumbnail",
  url
]);

// Live stdout
process.stdout.on("data", data => {
  process.stdout.write(data.toString());
});

// Live stderr (warnings, network issues)
process.stderr.on("data", data => {
  process.stderr.write(data.toString());
});

// Catch spawn errors
process.on("error", err => {
  console.error("Failed to start process:", err);
});

// On process end
process.on("close", code => {
  console.log("\nYT-DLP process finished with code:", code);
});