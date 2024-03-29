const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const contactSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    campaignIds: { type: Array },
    name: { type: String, required: true },
    wtsp: { type: String },
    email: { type: String },
    sms: { type: String },
    tags: { type: Array },
    lastMessage: { type: String },
    lastMessageTime: { type: Date },
    lastConversationTime: { type: Number },
    unreadMessageCount: { type: Number },
  },
  { timestamp: true }
);

const contactModel = mongoose.model("Contact", contactSchema);

const createContactDB = async (userId, wtsp, others) => {
  const existingContact = await contactModel.findOne({ userId, wtsp });
  if (existingContact) return null;
  const contact = await contactModel.create({ userId, wtsp, ...others });
  return contact;
};

const selectContactsDB = asyncHandler(async (userId, filters) => {
  filters = { ...filters, userId };
  delete filters["userId"];
  const selected = await contactModel.find({ $and: [{ userId }, filters] });
  const deselected = await contactModel.find({
    $and: [{ userId }, { $nor: [filters] }],
  });
  return { selected, deselected };
});

const updateContactDB = async (contactId, updateTo) => {
  return await contactModel.findByIdAndUpdate(contactId, { ...updateTo });
};

const updateLastMessageDB = async (
  userId,
  wtsp,
  msg,
  updateUnreadCount = true,
  time
) => {
  const contact = await contactModel.findOne({ $and: [{ userId }, { wtsp }] });
  if (!contact) return null;
  let unreadMessageCount = contact.unreadMessageCount
    ? contact.unreadMessageCount + 1
    : 1;
  if (updateUnreadCount == false)
    unreadMessageCount = contact.unreadMessageCount
      ? contact.unreadMessageCount
      : 0;

  const updatedContact = await contactModel.findOneAndUpdate(
    { userId, wtsp },
    {
      lastMessage: msg,
      lastMessageTime: time,
      unreadMessageCount,
    },
    { new: true }
  );
  return updatedContact;
};

const updateConversationTimeOutDB = async (
  userId,
  wtsp,
  conversationTimeOut
) => {
  const updatedContact = await contactModel.findOneAndUpdate(
    { userId, wtsp },
    {
      lastConversationTime: conversationTimeOut,
    },
    { new: true }
  );
  return updatedContact;
};

module.exports = {
  contactModel,
  createContactDB,
  selectContactsDB,
  updateContactDB,
  updateLastMessageDB,
  updateConversationTimeOutDB,
};
