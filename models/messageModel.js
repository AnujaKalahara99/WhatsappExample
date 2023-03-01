const mongoose = require("mongoose");
const { updateLastMessage } = require("./contactsModel");

const messageSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    waid: { type: String, required: true, unique: true },
    contact: { type: String, required: true },
    isRecieved: { type: Boolean, required: true },
    status: { type: String },
    header: {
      type: { type: String },
      data: { type: String },
    },
    body: { type: String, required: true },
    footer: { type: String },
  },
  { timestamps: true }
);

const messageModel = mongoose.model("Messages", messageSchema);

const saveMessage = async (
  userId,
  waid,
  number,
  msg,
  status,
  recieved,
  header,
  footer
) => {
  const messageSaved = await messageModel.create({
    userId,
    waid,
    contact: number,
    isRecieved: recieved,
    status: status ? status : "",
    header: {
      type: header && header.type ? header.type : "",
      data: header && header.data ? header.data : "",
    },
    body: msg,
    footer: footer ? footer : "",
  });
  return messageSaved;
};

const updateMessage = async (waid, status) => {
  const updated = await messageModel.findOneAndUpdate(
    { waid },
    { status },
    { new: true }
  );
  return updated;
};

module.exports = { messageModel, saveMessage, updateMessage };
