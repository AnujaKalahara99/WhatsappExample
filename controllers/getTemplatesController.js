const axios = require("axios");

const getAllTamplates = async (req, res) => {
  var config = {
    method: "get",
    url: `https://graph.facebook.com/${process.env.WAAPI_VERSION}/${process.env.WA_ACCOUNT_ID}/message_templates?limit=3`,
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      "Accept-Encoding": "gzip,deflate,compress",
    },
  };
  return await axios(config)
    .then(function (response) {
      return res.status(200).json(response.data);
    })
    .catch(function (error) {
      return res
        .status(error.response.status)
        .json({ error: error.response.data.error });
    });
};

module.exports = getAllTamplates;
