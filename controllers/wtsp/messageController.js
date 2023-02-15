const axios = require("axios");
const { messageModel, saveMessage } = require("../../models/messageModel");

const {
  getTextMessageData,
  getTemplateMessageData,
} = require("./messageDataHelper");

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

  const errorLog = [];
  let respon;

  for (let i = 0; i < data.length; i++) {
    await sendToWhatsappAPI(data[i])
      .then(async function (response) {
        respon = response.data;
        if (response.data.type && response.data.type !== "template")
          await saveMessage(response.data.to, response.data.body.text, false);
        else {
          await saveMessage(
            response.data.messages[0].id,
            response.data.contacts[0].input,
            "business message",
            "-",
            false
          );

          //Extra Code needed to get Templates to a text format
        }
      })
      .catch(function (error) {
        errorLog.push({
          to: data[i].to,
          error: error.response.data.error.message,
        });
      });
  }
  if (errorLog.length !== 0) res.status(500).json({ message: errorLog });
  else res.status(200).json(respon);
};

const recieveMessage = async (req, res) => {
  const { lastCheckedIndex } = req.body;

  const messagesSaved = await messageModel.find({
    index: { $gt: lastCheckedIndex },
  });
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
