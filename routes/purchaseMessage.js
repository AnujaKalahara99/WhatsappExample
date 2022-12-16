const express = require("express");
const axios = require("axios");
const { sendMessage } = require("../controllers/purchaseMessageController");

const router = express.Router();
router.use(express.json());

router.post("/", sendMessage);

module.exports = router;
