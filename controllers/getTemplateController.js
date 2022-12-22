const axios = require("axios");

const getTamplate = async (req, res) => {
  var config = {
    method: "get",
    url: `https://graph.facebook.com/${process.env.WAAPI_VERSION}/${process.env.WA_ACCOUNT_ID}/message_templates?name=${req.params.name}`,
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      "Accept-Encoding": "gzip,deflate,compress",
    },
  };
  return await axios(config)
    .then(function (response) {
      return res.status(200).json(RestructureTemplate(response.data));
    })
    .catch(function (error) {
      return res
        .status(error.response.status)
        .json({ error: error.response.data.error });
    });

  function RestructureTemplate(temp) {
    if (!temp || !temp.data[0]) return {};
    var template = { name: temp.data[0].name };
    temp.data[0].components.forEach((element) => {
      if (element.type === "HEADER") {
        template.header = { type: element.format };
      }
      if (element.type === "BODY") {
        template.body = { text: element.text };
      }
      if (element.type === "FOOTER") {
        template.footer = { text: element.text };
      }
    });
    return template;
  }
};

module.exports = getTamplate;
