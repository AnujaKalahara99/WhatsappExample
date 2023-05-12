function getTextMessageData(recipients, text) {
  const data = [];
  recipients.forEach((recipient) => {
    data.push({
      messaging_product: "whatsapp",
      preview_url: false,
      recipient_type: "individual",
      to: recipient,
      type: "text",
      text: {
        body: text,
      },
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

module.exports = {
  getTextMessageData: getTextMessageData,
  getTemplateMessageData: getTemplateMessageData,
};
