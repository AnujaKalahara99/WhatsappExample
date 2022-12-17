const axios = require("axios");

async function sendMessage(data) {
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

function getTemplateMessageData(recipient, template, body_param, header_param) {
  const data = {
    messaging_product: "whatsapp",
    to: recipient,
    type: "template",
    template: {
      name: template,
      language: {
        code: "en",
        policy: "deterministic",
      },
      components: [
        {
          type: "header",
          parameters: header_param && mapHeaderParameters(header_param),
        },
        {
          type: "body",
          parameters: body_param && mapBodyParameters(body_param),
        },
      ],
    },
  };
  return data;
}

function getTextMessageData(recipient, text) {
  return JSON.stringify({
    messaging_product: "whatsapp",
    preview_url: false,
    recipient_type: "individual",
    to: recipient,
    type: "text",
    text: {
      body: text,
    },
  });
}

function mapBodyParameters(param) {
  const paramObject = param.map((value) => ({
    type: "text",
    text: value,
  }));
  const json = JSON.stringify(paramObject, null, 2);
  return json;
}

function mapHeaderParameters(param) {
  const paramObject = param.map((value) => {
    const mediaType = Object.keys(value)[0];
    var json = { type: mediaType };
    json[mediaType] = {
      link: "https://www.invoicesimple.com/wp-content/uploads/2022/12/InvoiceSimple-PDF-Template.pdf",
    };
    return json;
  });
  const json = JSON.stringify(paramObject, null, 2);
  return json;
}

module.exports = {
  sendMessage: sendMessage,
  getTextMessageData: getTextMessageData,
  getTemplateMessageData: getTemplateMessageData,
};
