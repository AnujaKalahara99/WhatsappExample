const express = require("express");
const cors = require("cors");
require("dotenv").config();

const wtspRouter = require("./routes/wtsp");
const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.listen(process.env.PORT, () => {
  connectDB();
  console.log("Listening on PORT ", process.env.PORT);
});

app.use("/api/wtsp", wtspRouter);

app.get("/", (req, res) => {
  res.json({ message: "HELLLLOO" });
});
