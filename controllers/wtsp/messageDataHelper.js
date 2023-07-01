const { downloadMediaImage } = require("./mediaController");

function getTextMessageData(recipients, message) {
  const data = [];
  recipients.forEach((recipient) => {
    data.push({
      messaging_product: "whatsapp",
      preview_url: false,
      recipient_type: "individual",
      to: recipient,
      type: message.type,
      [message.type]:
        message.type === "text" ? message.data : { id: message.data },
    });
  });
  return data;
}

function getTemplateMessageData(
  recipients,
  template,
  body_param,
  header_param,
  language
) {
  const data = [];
  recipients.forEach((recipient, recipientIndex) => {
    data.push({
      messaging_product: "whatsapp",
      to: recipient,
      type: "template",
      template: {
        name: template,
        language: {
          code: language ? language : "en",
          policy: "deterministic",
        },
        components: [
          {
            type: "header",
            parameters:
              header_param && mapHeaderParameters(header_param, recipientIndex),
          },
          {
            type: "body",
            parameters:
              body_param && mapBodyParameters(body_param, recipientIndex),
          },
        ],
      },
    });
  });
  return data;
}

function mapBodyParameters(param, i) {
  const paramObject = param.map((value) => ({
    type: "text",
    text: value.constructor === Array ? (value[i] ? value[i] : "") : value,
  }));
  const json = JSON.stringify(paramObject, null, 2);
  return json;
}

function mapHeaderParameters(param, i) {
  let paramObject = {};

  //check if header param includes a type of media
  if (param.length === 1 && Object.keys(param[0])[0]) {
    media = param[0];
    const mediaType = Object.keys(media)[0];
    const mediaData = { ...media[mediaType] };
    if (mediaType === "IMAGE") delete mediaData["filename"];
    paramObject = [
      {
        type: mediaType.toLowerCase(),
        [mediaType.toLowerCase()]: mediaData,
      },
    ];
  } else {
    paramObject = param.map((value) => ({
      type: "text",
      text: value,
    }));
  }

  const json = JSON.stringify(paramObject, null, 2);
  return json;
}

const msg2DBFormat = async (msg, token) => {
  let msgData = {};
  if (msg.type === "text") msgData.body = msg.text.body;
  else if (msg.type && msg.type !== "") {
    // const media = await downloadMediaImage(msg[msg.type].id);
    // msgData.header = {
    //   type: msg.type,
    //   data: msg[msg.type].id,
    //   media: media ? media : "",
    // };
    const mediaFile = await downloadMediaImage(msg[msg.type].id, token);

    msgData.header = {
      type: msg.type,
      data: msg[msg.type].id,
      media: mediaFile?.media,
      fileName: mediaFile?.fileName,
    };
  }
  return msgData;
};

module.exports = {
  getTextMessageData,
  getTemplateMessageData,
  msg2DBFormat,
};
