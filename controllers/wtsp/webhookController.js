const { saveMessage, updateMessage } = require("../../models/messageModel");
const { createLog } = require("../../models/logModel");
const { getUserId } = require("../user/userController");

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
    //Create Messsage
    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0] &&
      body.entry[0].changes[0].value.messages &&
      body.entry[0].changes[0].value.messages[0]
    ) {
      let from = body.entry[0].changes[0].value.messages[0].from;
      let msg_body = body.entry[0].changes[0].value.messages[0].text.body;
      let waid = body.entry[0].changes[0].value.messages[0].id;
      let whatsappBusinessId = body.entry[0].id;

      const message = await saveMessage(
        getUserId(whatsappBusinessId),
        waid,
        from,
        msg_body,
        "delivered",
        true
      );
      res.status(200).json(message);
    }
    //Update Message
    else if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0] &&
      body.entry[0].changes[0].value.statuses &&
      body.entry[0].changes[0].value.statuses[0]
    ) {
      let waid = body.entry[0].changes[0].value.statuses[0].id;
      let status = body.entry[0].changes[0].value.statuses[0].status;

      const message = await updateMessage(waid, status);
      res.status(200).json(message);
    } else {
      res.sendStatus(404);
    }
  }
};

module.exports = { verify, listenForReplies };
