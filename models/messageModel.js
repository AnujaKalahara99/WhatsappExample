const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    index: { type: Number, required: true, unique: true },
    waid: { type: String, required: true, unique: true },
    contact: { type: String, required: true },
    isRecieved: { type: Boolean, required: true },
    status: { type: String, required: true },
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

const saveMessage = async (waid, number, msg, status, recieved) => {
  const count = await messageModel.count();
  const updated = await messageModel.findOneAndUpdate(
    { waid },
    { status },
    { new: true }
  );
  if (updated) return updated;
  const messageSaved = await messageModel.create({
    index: count,
    waid,
    contact: number,
    isRecieved: recieved,
    status: status,
    header: { type: "", data: "" },
    body: msg,
    footer: "",
  });
  return messageSaved;
};

module.exports = { messageModel, saveMessage };
