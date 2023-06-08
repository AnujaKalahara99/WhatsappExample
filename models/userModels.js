const mongoose = require("mongoose");

const userschema = mongoose.Schema(
  {
    name: { type: String, required: [true, "Please add a name"] },
    email: {
      type: String,
      required: [true, "Please add a email"],
      unique: true,
    },
    password: { type: String, required: [true, "Please add a password"] },
    waid: { type: String, required: true },
    balance: { type: Number },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", userschema);
