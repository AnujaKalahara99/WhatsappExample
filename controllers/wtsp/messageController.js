const axios = require("axios");
const asyncHandler = require("express-async-handler");
const { messageModel, saveMessage } = require("../../models/messageModel");
const {
  updateLastMessage,
  readContact,
} = require("../contacts/contactController");

const {
  getTextMessageData,
  getTemplateMessageData,
} = require("./messageDataHelper");
const { template2DBformat } = require("./templateController");
const { downloadMediaImage } = require("./mediaController");

const sendMessage = async (req, res) => {
  const { to, template, message, body_params, header_params, language } =
    req.body;
  let data = null;
  if (template && template !== "") {
    data = getTemplateMessageData(
      to,
      template,
      body_params,
      header_params,
      language
    );
  } else if (message && message !== "") {
    data = getTextMessageData(to, message);
  }

  if (!to)
    return res
      .status(500)
      .json({ error: "Must have a 'to' : 'phone number (e.g. 94763891917)'" });

  if (!data)
    return res.status(500).json({ error: "Use either template or message" });

  const log = [];
  let logContainsErrors = false;

  for (let i = 0; i < data.length; i++) {
    await sendToWhatsappAPI(data[i])
      .then(async function (response) {
        const wa_id = response.data.messages[0].id;
        const contact = response.data.contacts[0].wa_id;
        let msg = "";
        let footer = "";
        let header = {};
        if (data[i].type === "template") {
          const tempData = await template2DBformat(data[i]);
          msg = tempData.body;
          if (tempData.footer) footer = tempData.footer;
          if (tempData.header) {
            header = tempData.header;
            // header.temp = downloadMediaImage();
          }
        } else {
          msg = data[i].text.body;
        }
        // console.log("Header ", header);
        const messageSaved = await saveMessage(
          req.user._id,
          wa_id,
          contact,
          msg,
          "",
          false,
          header,
          footer
        );
        await updateLastMessage(
          req.user._id,
          contact,
          msg,
          messageSaved.createdAt
        );
        log.push(messageSaved._id);
      })
      .catch(function (error) {
        logContainsErrors = true;
        log.push({
          to: data[i].to,
          error:
            (error.response &&
              error.response.data &&
              error.response.data.error &&
              error.response.data.error.message) ||
            error.toString(),
        });
      });
  }
  if (logContainsErrors) return res.status(500).json(log);
  res.status(200).json(log);
};

const recieveMessage = async (req, res) => {
  const { contact } = req.query;
  const messagesSaved = await messageModel.find({ contact });
  res.status(200).json(messagesSaved);
};

const markMessageRead = asyncHandler(async (req, res) => {
  const { contact } = req.body;
  const { userId } = req.user;
  if (!contact) {
    res.status(500);
    throw new Error("No contact to mark messages read");
  }

  const messagesToRead = await messageModel.find({
    $and: [
      { contact },
      { userId },
      { isRecieved: true },
      { status: { $exists: true, $ne: "read" } },
    ],
  });

  const updatedMessages = [];
  messagesToRead.forEach(async (message) => {
    var config = {
      method: "post",
      url: `https://graph.facebook.com/${process.env.WAAPI_VERSION}/${process.env.PHONE_NUMBER_ID}/messages`,
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: {
        messaging_product: "whatsapp",
        status: "read",
        message_id: message.waid,
      },
    };

    const response = await axios(config);
    const updatedMessage = await messageModel.findByIdAndUpdate(message._id, {
      status: "read",
    });
    updatedMessages.push(updatedMessage);
  });

  const updatedContact = await readContact(userId, contact);

  return res.status(200).json(updatedMessages);
});

async function sendToWhatsappAPI(data) {
  var config = {
    method: "post",
    url: `https://graph.facebook.com/${process.env.WAAPI_VERSION}/${process.env.PHONE_NUMBER_ID}/messages`,
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    data: data,
  };

  return await axios(config);
}

module.exports = { sendMessage, recieveMessage, markMessageRead };
