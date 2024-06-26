const express = require("express");
const dotenv = require("dotenv").config({ path: __dirname + "/../.env" });
const port = process.env.PORT || 5000;
const app = express();
const { db, syncAllTables } = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");

// DB connection and sync test
db.authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log("Error: " + err));
// Sync all defined models to the DB
syncAllTables();

// Request body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/headings", require("./routes/headingsRoute"));
app.use("/api/book", require("./routes/bookRoute"));
app.use("/api/debt", require("./routes/debtRoute"));
app.use("/api/reserve", require("./routes/reserveRoute"));
app.use("/api/bookmark", require("./routes/bookmarkRoute"));

// Static frontend
const path = require("path");
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../", "client", "build", "index.html")
    )
  );
}

// END OF MIDDLEWARE
app.use(errorHandler);

// Port listening
app.listen(port, () => console.log(`Port: ${port}`));
