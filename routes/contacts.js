const express = require("express");
const { protect: authHandler } = require("../middleware/authmiddleware");
const contactController = require("../controllers/contacts/contactController");
const tagController = require("../controllers/contacts/tagsController");

const router = express.Router();
router.use(express.json());

router.get("/", authHandler, contactController.selectContacts);
router.post("/", authHandler, contactController.createNewContacts);
router.get("/tags", authHandler, tagController.selectTags);
router.post("/tags", authHandler, tagController.createTags);
router.get("/filterByTags", authHandler, contactController.filterByTags);
router.get("/recentMessages", authHandler, contactController.getRecent);

module.exports = router;
