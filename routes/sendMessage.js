const express = require("express");
const axios = require("axios");
const sendMessageController = require("../controllers/sendMessageController");

const router = express.Router();
router.use(express.json());

router.post("/", sendMessageController);

module.exports = router;
