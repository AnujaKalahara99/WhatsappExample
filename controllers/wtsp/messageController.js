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
  msg2DBFormat,
} = require("./messageDataHelper");
const { template2DBformat } = require("./templateController");
const { expense } = require("../user/userController");

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

  const cost = data.length;
  const costResponse = await expense(req.user._id, cost);
  if (costResponse.error) return res.status(500).json(costResponse.error);

  for (let i = 0; i < data.length; i++) {
    await sendToWhatsappAPI(data[i], req.user.watoken, req.user.phoneNumId)
      .then(async function (response) {
        const wa_id = response.data.messages[0].id;
        const contact = response.data.contacts[0].wa_id;
        let msg = "";
        let footer = "";
        let header = {};
        if (data[i].type === "template") {
          const tempData = await template2DBformat(
            data[i],
            req.user.watoken,
            req.user.waid
          );
          msg = tempData.body;
          if (tempData.footer) footer = tempData.footer;
          if (tempData.header) header = tempData.header;
        } else {
          msgData = await msg2DBFormat(data[i], req.user.watoken);
          msg = msgData.body;
          if (msgData.header) header = msgData.header;
        }

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
          false,
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
  // if (logContainsErrors) return res.status(500).json(log);
  res.status(logContainsErrors === true ? 500 : 200).json(log);
};

const recieveMessage = async (req, res) => {
  const { contact } = req.query;
  const messagesSaved = await messageModel.find({
    contact,
    userId: req.user._id,
  });
  // .sort({ _id: "descending" })
  // .limit(12);
  res.status(200).json(messagesSaved);
};

const markMessageRead = asyncHandler(async (req, res) => {
  const { contact } = req.body;
  userId = req.user._id;
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
      url: `https://graph.facebook.com/${process.env.WAAPI_VERSION}/${req.user.phoneNumId}/messages`,
      headers: {
        Authorization: `Bearer ${req.user.watoken}`,
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

async function sendToWhatsappAPI(data, token, phoneNumId) {
  var config = {
    method: "post",
    url: `https://graph.facebook.com/${process.env.WAAPI_VERSION}/${phoneNumId}/messages`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: data,
  };
  return await axios(config);
}

module.exports = { sendMessage, recieveMessage, markMessageRead };
