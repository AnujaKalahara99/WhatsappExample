const axios = require("axios");
const FormData = require("form-data");
const asyncHandler = require("express-async-handler");
const fs = require("fs");

const uploadMedia = asyncHandler(async (req, res) => {
  const formData = new FormData();
  const fileBuffer = fs.createReadStream(req.file.path);
  formData.append("file", fileBuffer);
  formData.append("type", req.file.mimetype);
  formData.append("messaging_product", "whatsapp");

  var config = {
    method: "post",
    url: `https://graph.facebook.com/${process.env.WAAPI_VERSION}/${process.env.PHONE_NUMBER_ID}/media`,
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      ...formData.getHeaders(),
    },
    data: formData,
  };

  const response = await axios(config);
  fs.unlinkSync(req.file.path);
  return res.status(200).json(response.data);
});

//Return byte array, not the media
const getMedia = asyncHandler(async (req, res) => {
  var config = {
    method: "get",
    url: `https://graph.facebook.com/${process.env.WAAPI_VERSION}/${req.params.mediaId}`,
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    },
  };

  const response = await axios(config);
  if (response.status === 200) {
    const mediaResponse = await downloadMedia(response.data.url);
    return res.status(200).send(mediaResponse);
  }
  return res.status(500).json(response.status);
});

const downloadMedia = async (url) => {
  var config = {
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    },
  };

  const response = await axios(config);
  return response;
};

module.exports = { uploadMedia, getMedia };
