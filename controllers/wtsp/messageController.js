const axios = require("axios");
const { messageModel, saveMessage } = require("../../models/messageModel");
const { updateLastMessage } = require("../contacts/contactController");

const {
  getTextMessageData,
  getTemplateMessageData,
} = require("./messageDataHelper");
const { template2DBformat } = require("./templateController");

const sendMessage = async (req, res) => {
  const { to, template, message, body_params, header_params } = req.body;
  let data = null;
  if (template && template !== "") {
    data = getTemplateMessageData(to, template, body_params, header_params);
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
          if (tempData.header) header = tempData.header;
        } else {
          msg = data[i].text.body;
        }
        const messageSaved = await saveMessage(
          wa_id,
          contact,
          msg,
          "",
          false,
          header,
          footer
        );
        log.push(messageSaved._id);
        //updateLastMessage(3, contact, messageSaved._id);
      })
      .catch(function (error) {
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
  res.status(200).json(log);
};

const recieveMessage = async (req, res) => {
  const { contact, userId } = req.query;
  const messagesSaved = await messageModel.find({ contact });
  res.status(200).json(messagesSaved);
};

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

module.exports = { sendMessage, recieveMessage };
