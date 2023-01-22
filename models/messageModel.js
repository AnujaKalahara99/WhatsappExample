const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    index: { type: Number, required: true, unique: true },
    contact: { type: String, required: true },
    recieved: { type: Boolean, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const messageModel = mongoose.model("Messages", messageSchema);

const saveMessage = async (number, msg, recieved) => {
  const count = await messageModel.count();
  const messageSaved = await messageModel.create({
    index: count,
    contact: number,
    recieved,
    text: msg,
  });

  return messageSaved;
};

module.exports = { messageModel, saveMessage };
