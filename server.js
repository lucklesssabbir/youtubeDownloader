const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// SINGLE ROUTE FILE
const allRoutes = require("./routes/all");
app.use("/", allRoutes);



// CATCH ALL OTHER ROUTES -> ERROR
app.use((req, res) => {
  res.status(404).render("error", {
  errorTitle: "404 Not Found",
  errorMessage: "The page you requested does not exist.",
  errorType: "404"
});
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});