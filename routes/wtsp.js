const express = require("express");
const authHandler = require("../middleware/authHandler");
const messageController = require("../controllers/wtsp/messageController");
const templateController = require("../controllers/wtsp/templateController");
const webhookController = require("../controllers/wtsp/webhookController");

const router = express.Router();
router.use(express.json());

router.post("/messages/", authHandler, messageController.sendMessage);
router.get("/messages/", authHandler, messageController.recieveMessage);

router.get("/templates/", authHandler, templateController.getAllTamplates);
router.get("/templates/:name", authHandler, templateController.getTamplate);
router.post("/templates/", authHandler, templateController.createTemplate); //require our validation
router.patch("/templates/:name", authHandler, templateController.editTemplate); //require our validation
router.delete(
  "/templates/:name",
  authHandler,
  templateController.deleteTemplate
);

router.get("/webhook/", webhookController.verify);
router.post("/webhook/", webhookController.listenForReplies);

module.exports = router;
