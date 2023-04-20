const express = require("express");
const multer = require("multer");
const path = require("path");
const authHandler = require("../middleware/authHandler");
const messageController = require("../controllers/wtsp/messageController");
const mediaController = require("../controllers/wtsp/mediaController");
const templateController = require("../controllers/wtsp/templateController");
const webhookController = require("../controllers/wtsp/webhookController");

const router = express.Router();
router.use(express.json());

router.post("/messages/", authHandler, messageController.sendMessage);
router.post("/messages/read", authHandler, messageController.markMessageRead);
router.get("/messages/", authHandler, messageController.recieveMessage);

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "/tmp");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});
var upload = multer({ storage: storage }).single("file");

router.get("/media/:mediaId", authHandler, mediaController.getMedia);
router.post("/media", authHandler, upload, mediaController.uploadMedia);

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
