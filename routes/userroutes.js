const express = require("express");

const router = express.Router();

const {
  registeruser,
  loginuser,
  getme,
} = require("../controllers/user/userController");

const { protect } = require("../middleware/authmiddleware");

router.post("/", registeruser);
router.post("/login", loginuser);
router.get("/me", protect, getme);

module.exports = router;
