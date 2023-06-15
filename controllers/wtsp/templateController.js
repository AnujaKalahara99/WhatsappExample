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
          response.data.data.filter(
            (template) =>
              (template.language === "en" || template.language === "en_US") &&
              template.status === "APPROVED"
          )
        );
    })
    .catch(function (error) {
      console.log(error);
      return res
        .status(error.response.status)
        .json({ error: error.response.data.error });
    });
};

//Not Refrenced. Also when returning a value only return english language from array of same name templates
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

const template2DBformat = async (templateData) => {
  let headerVar = [];
  let bodyVar = [];

  templateData.template.components.forEach((com) => {
    if (com.type === "header") {
      headerVar = JSON.parse(com.parameters).map((e) =>
        e.text ? e.text : e[e.type].link ? e[e.type].link : e[e.type].id
      );
    } else if (com.type === "body") {
      bodyVar = JSON.parse(com.parameters).map((e) => e.text);
    }
  });
  var config = {
    method: "get",
    url: `https://graph.facebook.com/${process.env.WAAPI_VERSION}/${process.env.WA_ACCOUNT_ID}/message_templates?name=${templateData.template.name}`,
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      "Accept-Encoding": "gzip,deflate,compress",
    },
  };
  try {
    const response = await axios(config);
    const tempData = await templateDataHelper.fillTemplateVariables(
      response.data.data[0].components,
      headerVar,
      bodyVar
    );
    return tempData;
  } catch (error) {
    console.log(
      "Error : " +
        (error.response && error.response.data && error.response.data.error) ||
        error.toString()
    );
  }
};

module.exports = {
  getAllTamplates,
  getTamplate,
  createTemplate,
  editTemplate,
  deleteTemplate,
  template2DBformat,
};
