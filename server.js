const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sendMessageRouter = require("./routes/sendMessage");
const webhooksRouter = require("./routes/webhooks");

const app = express();

app.use(cors());
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log("Listening on PORT ", process.env.PORT);
});

app.use("/api/message", sendMessageRouter);

app.get("/api/webhooks", webhooksRouter);

app.get("/", (req, res) => {
  res.json({ message: "HELLLLOO" });
});
