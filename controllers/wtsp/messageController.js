const axios = require("axios");

const {
  getTextMessageData,
  getTemplateMessageData,
} = require("./messageDataHelper");

const lastMessageLog = [];
const { messageLog } = require("./webhookController");

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

  for (let i = 0; i < data.length; i++) {
    await sendToWhatsappAPI(data[i])
      .then(function (response) {})
      .catch(function (error) {
        console.log(error);
        errorLog.push({ to: data[i].to, error: error.response.data.error });
      });
  }
  if (errorLog.length !== 0) res.status(500).json(errorLog);
  else res.sendStatus(200);
};

const recieveMessage = (req, res) => {
  if (lastMessageLog.length !== messageLog.length) {
    let sendLog = [];
    for (let i = lastMessageLog.length; i < messageLog.length; i++) {
      sendLog.push(messageLog[i]);
      lastMessageLog.push(messageLog[i]);
    }
    res.status(200).json(sendLog);
  } else {
    res.status(200).json({});
  }
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
