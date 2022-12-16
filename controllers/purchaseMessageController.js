const {
  sendMessage,
  getTextMessageData,
  getTemplateMessageData,
} = require("./messageDataHelper");

const sendWhatsappAPI = async (req, res) => {
  const { to, template, message, body_params, header_params } = req.body;
  let data = null;
  if (template && template !== "") {
    data = getTemplateMessageData(to, template, body_params, header_params);
  } else if (message && message !== "") {
    data = getTextMessageData(to, message);
  }

  if (!data)
    returnres.status(500).json({ error: "Use either template or message" });

  await sendMessage(data)
    .then(function (response) {
      return res.sendStatus(200);
    })
    .catch(function (error) {
      return res.status(500).json({ error: error.response.data.error });
    });
};

module.exports = {
  sendMessage: sendWhatsappAPI,
};
