const express = require("express");
const cors = require("cors");
const websocket = require("ws");
require("dotenv").config();

const sendMessageRouter = require("./routes/sendMessage");
const webhooksRouter = require("./routes/webhooks");

const app = express();

app.use(cors());
app.use(express.json());

const server = app.listen(process.env.PORT, () => {
  console.log("Listening on PORT ", process.env.PORT);
});

const wsServer = new websocket.Server({
  server,
  path: "/api/webhook/messages",
});

app.use("/api/message", sendMessageRouter);

app.use("/api/webhooks", webhooksRouter);

app.get("/", (req, res) => {
  res.json({ message: "HELLLLOO" });
});

wsServer.on("connection", (ws) => {
  console.log("Total Connected WS Clients : ", wsServer.clients.size);
  app.locals.clients = wsServer.clients;
});
