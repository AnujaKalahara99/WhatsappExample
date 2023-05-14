const express = require("express");
const { protect: authHandler } = require("../middleware/authmiddleware");
const contactController = require("../controllers/contacts/contactController");

const router = express.Router();
router.use(express.json());

router.post("/", authHandler, contactController.createNewContacts);
router.get("/filterByTags", authHandler, contactController.filterByTags);
router.get("/recentMessages", authHandler, contactController.getRecent);
router.get("/", authHandler, contactController.selectContacts);

module.exports = router;
