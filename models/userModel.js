const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    waid: { type: String, required: true, unique: true },
  },
  { timestamp: true }
);

module.exports = mongoose.model("User", userSchema);
