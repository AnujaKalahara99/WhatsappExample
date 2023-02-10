const axios = require("axios");
const { response } = require("express");
const templateDataHelper = require("./templateDataHelper");

const getAllTamplates = async (req, res) => {
  var config = {
    method: "get",
    url: `https://graph.facebook.com/${process.env.WAAPI_VERSION}/${process.env.WA_ACCOUNT_ID}/message_templates`,
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      "Accept-Encoding": "gzip,deflate,compress",
    },
  };
  return await axios(config)
    .then(function (response) {
      return res
        .status(200)
        .send(
          response.data.data.filter((template) => template.language === "en")
        );
    })
    .catch(function (error) {
      return res
        .status(error.response.status)
        .json({ error: error.response.data.error });
    });
};

const getTamplate = async (req, res) => {
  console.log("GetAllTemplates");
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
      return res
        .status(200)
        .json(templateDataHelper.wtsp2readable(response.data));
    })
    .catch(function (error) {
      return res
        .status(error.response.status)
        .json({ error: error.response.data.error });
    });
};

const createTemplate = async (req, res) => {
  const { template } = req.body;

  const config = {
    method: "post",
    url: `https://graph.facebook.com/${process.env.WAAPI_VERSION}/${process.env.WA_ACCOUNT_ID}/message_templates`,
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    data: templateDataHelper.readable2wtsp(template),
  };

  return await axios(config)
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((error) => {
      res.status(error.response.status).json(error.response.data.error);
    });
};

const editTemplate = (req, res) => {
  return res.status(200).send("edited template successfully");
};

const deleteTemplate = (req, res) => {
  return res.status(200).send("deleted template successfully");
};

module.exports = {
  getAllTamplates,
  getTamplate,
  createTemplate,
  editTemplate,
  deleteTemplate,
};
