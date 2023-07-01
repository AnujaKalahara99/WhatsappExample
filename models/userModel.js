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
    phoneNumId: { type: String, required: true },
    watoken: { type: String, required: true },
    contactNumber: { type: Number, required: false },
    balance: { type: Number },
    status: { type: Boolean, required: false, default: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", userschema);
