const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const userModel = require("../../models/userModel");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, waid } = req.body;

  if (!name || !email || !password || !waid) {
    res.status(400);
    throw new Error("Credentials (name, email, password, whatsappID) required");
  }

  if (await userModel.exists({ $or: [{ email }, { waid }] })) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await userModel.create({
    userId: uuidv4(),
    name,
    email,
    password: hashedPassword,
    waid,
  });

  if (newUser) {
    res.status(201).json({
      _id: newUser.id,
      userId: newUser.userId,
      name: newUser.name,
      email: newUser.email,
      waid: newUser.waid,
      token: generateToke(newUser.id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Credentials (email, password) required");
  }

  const user = await userModel.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user.id,
      userId: user.userId,
      name: user.name,
      email: user.email,
      waid: user.waid,
      token: generateToke(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const getMe = asyncHandler(async (req, res) => {});

const getUserId = async (waid) => {
  const user = await userModel.findOne({ waid });
  if (user) return user.userId;
  else return null;
};

const generateToke = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = { registerUser, loginUser, getMe, getUserId };
