const express = require("express");

const router = express.Router();

const {
  getUserAll,
  deactivateUser,
  ApproveUser,
  updateUser,
  deleteUser,
} = require("../controllers/user/userManagerController");

const { protect } = require("../middleware/authmiddleware");

router.route("/deactivate").put(protect, deactivateUser);
router.route("/approve").put(protect, ApproveUser);
router.route("/").get(protect, getUserAll);
router.route("/:id").put(protect, updateUser);
router.route("/:id").delete(protect, deleteUser);

module.exports = router;
