const express = require("express");
const authHandler = require("../middleware/authHandler");
const contactController = require("../controllers/contacts/contactController");

const router = express.Router();
router.use(express.json());

router.post("/", authHandler, contactController.createNewContacts);
router.get("/filterByTags", authHandler, contactController.filterByTags);
router.get("/", authHandler, contactController.selectContacts);

module.exports = router;
