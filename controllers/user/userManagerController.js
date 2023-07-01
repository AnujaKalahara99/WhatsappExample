const asynchandler = require("express-async-handler");
const userModel = require("../../models/userModel");

const getUserAll = asynchandler(async (req, res) => {
  const usermanagerdata = await userModel.find();
  res.status(200).json(usermanagerdata);
});

const updateUser = asynchandler(async (req, res) => {
  const id = req.params.id;
  const userData = req.body;
  delete userData["_id"];
  const user_update = await userModel.findById(id);

  if (!user_update) {
    res.status(400);
    throw new Error("user not found ");
  }

  const response = await userModel.findOneAndUpdate({ _id: id }, userData, {
    new: true,
  });

  res.status(200).json(response);
});

const deactivateUser = asynchandler(async (req, res) => {
  const id = req.body.id;
  const user_deactivate = await userModel.findById(id);

  if (!user_deactivate) {
    res.status(400);
    throw new Error("user not found");
  }

  const response = await userModel.findOneAndUpdate(
    { _id: id },
    { $set: { status: false } },
    { new: true }
  );

  res.status(200).json(response);
});

const ApproveUser = asynchandler(async (req, res) => {
  const id = req.body.id;
  const user_activate = await userModel.findById(id);

  if (!user_activate) {
    res.status(400);
    throw new Error("user not found");
  }

  const response = await userModel.findOneAndUpdate(
    { _id: id },
    { $set: { status: true } },
    { new: true }
  );

  res.status(200).json(response);
});

const deleteUser = asynchandler(async (req, res) => {
  const id = req.params.id;
  const user_delete = await userModel.findById(id);

  if (!user_delete) {
    res.status(400);
    throw new Error("user not found");
  }

  const response = await userModel.findOneAndDelete({ _id: id });
  res.status(200).json(response);
});

module.exports = {
  getUserAll,
  deactivateUser,
  ApproveUser,
  updateUser,
  deleteUser,
};
