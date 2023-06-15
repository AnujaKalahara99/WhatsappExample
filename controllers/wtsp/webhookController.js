const { saveMessage, updateMessage } = require("../../models/messageModel");
const { createLog } = require("../../models/logModel");
const { getUserId } = require("../user/userController");
const { updateLastMessage } = require("../contacts/contactController");
const { downloadMediaImage } = require("./mediaController");

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
    const userId = await getUserId(body.entry[0].id);
    //Create Messsage
    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0] &&
      body.entry[0].changes[0].value.messages &&
      body.entry[0].changes[0].value.messages[0]
    ) {
      const from = body.entry[0].changes[0].value.messages[0].from;
      const msg_body = body.entry[0].changes[0].value.messages[0].text?.body;
      const header = { type: "", data: "", media: "" };
      const msg_img = body.entry[0].changes[0].value.messages[0].image;
      const msg_doc = body.entry[0].changes[0].value.messages[0].document;
      const waid = body.entry[0].changes[0].value.messages[0].id;
      if (msg_img) {
        header.data = msg_img.id;
        header.type = "image";
        const mediaFile = await downloadMediaImage(msg_img.id);
        header.media = mediaFile.media;
      } else if (msg_doc) {
        header.data = msg_doc.id;
        header.type = "document";
        const mediaFile = await downloadMediaImage(msg_doc.id);
        header.media = mediaFile.media;
      }

      const message = await saveMessage(
        userId,
        waid,
        from,
        msg_body,
        "delivered",
        true,
        header
      );

      const msg_last = header.type ? "#!" + header.type : msg_body;
      await updateLastMessage(userId, from, msg_last, true);

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
      const waid = body.entry[0].changes[0].value.statuses[0].id;
      const status = body.entry[0].changes[0].value.statuses[0].status;
      let conversationTimeOut;
      if (status === "sent") {
        conversationTimeOut =
          body.entry[0].changes[0].value.statuses[0].conversation
            .expiration_timestamp;
      }

      const message = await updateMessage(waid, status, conversationTimeOut);
      res.status(200).json(message);
    } else {
      res.sendStatus(404);
    }
  }
};

module.exports = { verify, listenForReplies };
