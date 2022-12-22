const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sendMessage = require("./routes/sendMessage");

const app = express();

app.use(cors());
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log("Listening on PORT ", process.env.PORT);
});

app.use("/api/message", sendMessage);

app.get("/", (req, res) => {
  res.json({ message: "HELLLLOO" });
});
