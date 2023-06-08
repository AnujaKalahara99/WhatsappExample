const express = require("express");

const router = express.Router();

const {
  registeruser,
  loginuser,
  getme,
  getBalance,
} = require("../controllers/user/userController");

const { protect } = require("../middleware/authmiddleware");

router.post("/", registeruser);
router.post("/login", loginuser);
router.get("/me", protect, getme);
router.get("/balance", protect, getBalance);

module.exports = router;
