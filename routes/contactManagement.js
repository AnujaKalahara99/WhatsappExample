const express = require("express");

const router = express.Router();

const {
  createNewContacts,
  selectContacts,
  deleteContact,
  getAllUniqueTags,
} = require("../controllers/contacts/contactController");

const { protect } = require("../middleware/authmiddleware");

router.route("/").post(protect, createNewContacts);
router.route("/").get(protect, selectContacts);
router.route("/getuniquetags").get(protect, getAllUniqueTags);
router.route("/:id").delete(protect, deleteContact);

module.exports = router;
