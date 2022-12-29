const express = require("express");
const cors = require("cors");
const http = require("http");
const websocket = require("websocket");
require("dotenv").config();

const sendMessageRouter = require("./routes/sendMessage");
const webhooksRouter = require("./routes/webhooks");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log("Listening on PORT ", process.env.PORT);
});

app.use("/api/message", sendMessageRouter);

app.use("/api/webhooks", webhooksRouter);

app.get("/", (req, res) => {
  res.json({ message: "HELLLLOO" });
});

const websocketServer = websocket.server;
const wsServer = new websocketServer({ httpServer: server });

wsServer.on("request", (req) => {
  console.log("Connected with ", req.origin);
  const connection = req.accept(null, req.origin);
  connection.on("message", (message) => {
    console.log("Recieved message ", message);
  });
});
