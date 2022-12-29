const express = require("express");

const router = express.Router();
router.use(express.json());

let messageLog = [{ message: "hoobaa" }];

router.post("/", (req, res) => {
  let body = req.body;
  const message = {};
  console.log("recieved msg");

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
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

router.get("/", (req, res) => {
  if (
    req.query["hub.mode"] == "subscribe" &&
    req.query["hub.verify_token"] == process.env.WEBHOOK_TOKEN
  ) {
    res.send(req.query["hub.challenge"]);
  } else {
    res.sendStatus(400);
  }
});
router.get("/messages", (req, res) => {
  res.status(200).json(messageLog);
});

module.exports = router;
