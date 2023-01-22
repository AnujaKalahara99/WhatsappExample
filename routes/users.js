const express = require("express");
const {
  loginUser,
  registerUser,
} = require("../controllers/user/userController");

const router = express.Router();
router.use(express.json());

router.post("/", registerUser);
router.post("/login/", loginUser);

module.exports = router;
