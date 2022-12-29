const {
  sendMessage,
  getTextMessageData,
  getTemplateMessageData,
} = require("./messageDataHelper");

const sendWhatsappAPI = async (req, res) => {
  const { to, template, message, body_params, header_params, messageCount } =
    req.body;
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

  const count = messageCount ? messageCount : 1;
  const messageLog = [];

  for (let i = 0; i < count; i++) {
    await sendMessage(data)
      .then(function (response) {
        messageLog.push(response.data);
      })
      .catch(function (error) {
        return res.status(error.response.status).json({
          error: error.response.data.error,
        });
      });
  }

  console.log("after all sent");
  res.status(200).json(messageLog);
};

module.exports = sendWhatsappAPI;
