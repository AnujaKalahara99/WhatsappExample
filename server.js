const express = require("express");
const cors = require("cors");
const websocket = require("ws");
const http = require("http");
require("dotenv").config();

const sendMessageRouter = require("./routes/sendMessage");
const webhooksRouter = require("./routes/webhooks");

const app = express();

app.use(cors());
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log("Listening on PORT ", process.env.PORT);
});

const server = http.createServer(app);
const wsServer = new websocket.server({ server });

app.use("/api/message", sendMessageRouter);

app.use("/api/webhooks", webhooksRouter);

app.get("/", (req, res) => {
  res.json({ message: "HELLLLOO" });
});

wsServer.on("request", (req) => {
  console.log("Connected with ", req.origin);
  const connection = req.accept(null, req.origin);
  connection.on("message", (message) => {
    console.log("Recieved message ", message);
  });
});
