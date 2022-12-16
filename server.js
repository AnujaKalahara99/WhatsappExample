const express = require("express");
require("dotenv").config();

const sendMessage = require("./routes/sendMessage");
const purchaseMessage = require("./routes/purchaseMessage");

const app = express();
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log("Listening on PORT ", process.env.PORT);
});

app.use("/api/message", sendMessage);
app.use("/api/purchmessage", purchaseMessage);

app.get("/", (req, res) => {
  res.json({ message: "HELLLLOO" });
});
