const express = require("express");
const messageController = require("../controllers/wtsp/messageController");
const templateController = require("../controllers/wtsp/templateController");
const webhookController = require("../controllers/wtsp/webhookController");

const router = express.Router();
router.use(express.json());

router.post("/messages/", messageController.sendMessage);
router.get("/messages/", messageController.recieveMessage);

router.get("/templates/", templateController.getAllTamplates);
router.get("/templates/:name", templateController.getTamplate);
router.post("/templates/", templateController.createTemplate); //require our validation
router.patch("/templates/:name", templateController.editTemplate); //require our validation
router.delete("/templates/:name", templateController.deleteTemplate);

router.get("/webhook/", webhookController.verify);
router.post("/webhook/", webhookController.listenForReplies);

module.exports = router;
