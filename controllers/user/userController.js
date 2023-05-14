const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asynchandler = require("express-async-handler");
const user = require("../../models/userModels");

//@desc Register new user
//@route POST /api/users
// @access Public
const registeruser = asynchandler(async (req, res) => {
  const { name, email, password, facebooklink, contactnumberstate, waid } =
    req.body;

  if (
    !name ||
    !email ||
    !password ||
    !facebooklink ||
    !contactnumberstate ||
    !waid
  ) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  //check if user exisit
  const userexist = await user.findOne({ email });

  if (userexist) {
    res.status(400);
    throw new Error("User alredy exist");
  }

  //hash passwword
  const salt = await bcrypt.genSalt(10);
  const hashpassword = await bcrypt.hash(password, salt);

  //create user
  const users = await user.create({
    name,
    email,
    password: hashpassword,
    waid,
    facebooklink,
    contactnumberstate,
  });

  if (users) {
    res.status(201).json({
      _id: users.id,
      name: users.name,
      email: users.email,
      waid: users.waid,
      token: generatetoken(users._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//@desc Authenticate  a user
//@route POST /api/users/login
// @access Public
const loginuser = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  const users = await user.findOne({ email });

  if (users && (await bcrypt.compare(password, users.password))) {
    res.status(201).json({
      _id: users.id,
      name: users.name,
      email: users.email,
      token: generatetoken(users._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//@desc get user data
//@route POST /api/users/me
// @access Private
const getme = asynchandler(async (req, res) => {
  const { _id, name, email } = await user.findById(req.user.id);

  res.status(200).json({
    id: _id,
    name,
    email,
  });
});

// Generate the jwt
const generatetoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const getUserId = async (waid) => {
  return await user.find(waid);
};

module.exports = {
  registeruser,
  loginuser,
  getme,
  getUserId,
};
