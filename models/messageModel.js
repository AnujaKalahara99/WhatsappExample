const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    index: { type: Number, required: true, unique: true },
    contact: { type: String, required: true },
    isRecieved: { type: Boolean, required: true },
    text: { type: String, required: true },
    isRead: { type: Boolean, required: true },
    header: { type: Object, required: true },
    body: { type: String, required: true },
    footer: { type: String, required: true },
  },
  { timestamps: true }
);

const messageModel = mongoose.model("Messages", messageSchema);

const saveMessage = async (number, msg, recieved) => {
  const count = await messageModel.count();
  const messageSaved = await messageModel.create({
    index: count,
    contact: number,
    isRecieved: recieved,
    isRead: false,
    header: {},
    body: msg,
    footer: "",
  });

  return messageSaved;
};

module.exports = { messageModel, saveMessage };
