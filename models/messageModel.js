const mongoose = require("mongoose");

const messageModel = mongoose.Schema(
  {
    index: { type: Number, required: true },
    contact: { type: String, required: true },
    recieved: { type: Boolean, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Messages", messageModel);
