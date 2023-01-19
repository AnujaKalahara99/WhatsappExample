const messageModel = require("../../models/messageModel");

const messageLog = [];

const verify = (req, res) => {
  if (
    req.query["hub.mode"] == "subscribe" &&
    req.query["hub.verify_token"] == process.env.WEBHOOK_TOKEN
  ) {
    res.send(req.query["hub.challenge"]);
  } else {
    res.sendStatus(400);
  }
};

const listenForReplies = async (req, res) => {
  let body = req.body;
  const message = {};

  if (body.object) {
    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0] &&
      body.entry[0].changes[0].value.messages &&
      body.entry[0].changes[0].value.messages[0]
    ) {
      let phone_number_id =
        body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
      let msg_body = body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
      message.from = from;
      message.body = msg_body;
      messageLog.push(message);

      const messageSave = await messageModel.create({
        index: messageModel.count(),
        contact: from,
        recieved: true,
        text: msg_body,
      });

      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }
};

module.exports = { messageLog, verify, listenForReplies };
