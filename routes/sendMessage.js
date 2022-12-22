const express = require("express");
const axios = require("axios");
const sendMessageController = require("../controllers/sendMessageController");
const getAllTemplates = require("../controllers/getTemplatesController");
const getTamplate = require("../controllers/getTemplateController");

const router = express.Router();
router.use(express.json());

router.post("/", sendMessageController);
router.get("/", getAllTemplates);
router.get("/:name", getTamplate);

module.exports = router;
