const express = require("express");
const axios = require("axios");
const router = express.Router();
router.use(express.json());

router.post("/", async (req, res) => {
  var { message, to } = req.body;

  if (!to || to.toString().length !== 11) {
    return res.status(404).json({ error: "No such number exists" });
  }

  if (!message) {
    return res.status(500).json({ error: "Please enter a message" });
  }

  var data = getTextMessageInput(to, message);

  await sendMessage(data)
    .then(function (response) {
      return res.sendStatus(200);
    })
    .catch(function (error) {
      return res.status(500).json({ error: error.response.data.error });
    });
});

async function sendMessage(data) {
  var config = {
    method: "post",
    url: `https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/messages`,
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    data: {
      messaging_product: "whatsapp",
      to: process.env.RECIPIENT_WAID,
      type: "template",
      template: {
        name: "101",
        language: {
          code: "en",
          policy: "deterministic",
        },
      },
    },
  };
  // var config = {
  //   method: "post",
  //   url: `https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/messages`,
  //   headers: {
  //     Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
  //     "Content-Type": "application/json",
  //   },
  //   data: data,
  // };

  return await axios(config);
}

function getTextMessageInput(recipient, text) {
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

module.exports = router;
