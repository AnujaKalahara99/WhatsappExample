const express = require("express");
const cors = require("cors");
require("dotenv").config();

const errorHandler = require("./middleware/errorHandler");
const authHandler = require("./middleware/authHandler");

const wtspRouter = require("./routes/wtsp");
const usersRouter = require("./routes/users");

const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/wtsp", authHandler, wtspRouter);
app.use("/api/users", usersRouter);

app.get("/", (req, res) => {
  res.json({ message: "HELLLLOO" });
});

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log("Listening on PORT ", process.env.PORT);
});
