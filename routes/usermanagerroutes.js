const express = require("express");

const router = express.Router();

const {
  getUserAll,
  deactivateUser,
  ApproveUser,
  updateUser,
  deleteUser,
} = require("../controllers/user/userManagerController");

const { protect, isAdmin } = require("../middleware/authmiddleware");

router.route("/deactivate").put(protect, isAdmin, deactivateUser);
router.route("/approve").put(protect, isAdmin, ApproveUser);
router.route("/").get(protect, isAdmin, getUserAll);
router.route("/:id").put(protect, isAdmin, updateUser);
router.route("/:id").delete(protect, isAdmin, deleteUser);

module.exports = router;
