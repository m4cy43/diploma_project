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

// END OF MIDDLEWARE
app.use(errorHandler);

// Port listening
app.listen(port, () => console.log(`Port: ${port}`));
