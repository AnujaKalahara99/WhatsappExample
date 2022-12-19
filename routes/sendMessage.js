const express = require("express");
const axios = require("axios");
const sendMessageController = require("../controllers/sendMessageController");
const getTemplates = require("../controllers/getTemplatesController");

const router = express.Router();
router.use(express.json());

router.post("/", sendMessageController);
router.get("/", getTemplates);

module.exports = router;
