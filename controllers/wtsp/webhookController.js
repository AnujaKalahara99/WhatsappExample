const { messageModel, saveMessage } = require("../../models/messageModel");
const { createLog } = require("../../models/logModel");

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
  createLog(JSON.stringify(body));

  if (body.object) {
    if (body.entry && body.entry[0].changes && body.entry[0].changes[0]) {
      let waid, from, msg_body, status;

      if (
        body.entry[0].changes[0].statuses &&
        body.entry[0].changes[0].statuses[0]
      ) {
        waid = body.entry[0].changes[0].statuses[0].id;
        status = body.entry[0].changes[0].statuses[0].status;
      }

      if (
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0]
      ) {
        phone_number_id =
          body.entry[0].changes[0].value.metadata.phone_number_id;
        from = body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
        msg_body = body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload}

        const message = await saveMessage(waid, from, msg_body, status, true);
        res.status(200).json(message);
      } else {
        res.sendStatus(404);
      }
    }
  }
};

module.exports = { verify, listenForReplies };
