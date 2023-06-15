const mongoose = require("mongoose");

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
    lastConversationTime: { type: Date },
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

const selectContactsDB = async (userId, filters) => {
  delete filters["userId"];
  const selected = await contactModel.find({ $and: [{ userId }, filters] });
  const deselected = await contactModel.find({
    $and: [{ userId }, { $nor: [filters] }],
  });
  return { selected, deselected };
};

const updateContactDB = async (contactId, updateTo) => {
  return await contactModel.findByIdAndUpdate(contactId, { ...updateTo });
};

const updateLastMessageDB = async (
  userId,
  wtsp,
  msg,
  updateUnreadCount = true,
  time,
  conversationTimeOut
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

  let updatedContact;
  if (msg) {
    updatedContact = await contactModel.findOneAndUpdate(
      { userId, wtsp },
      {
        lastMessage: msg,
        lastMessageTime: time,
        unreadMessageCount,
        lastConversationTime: conversationTimeOut,
      },
      { new: true }
    );
  } else {
    updatedContact = await contactModel.findOneAndUpdate(
      { userId, wtsp },
      {
        lastMessageTime: time,
        unreadMessageCount,
        lastConversationTime: conversationTimeOut,
      },
      { new: true }
    );
  }
  return updatedContact;
};

module.exports = {
  contactModel,
  createContactDB,
  selectContactsDB,
  updateContactDB,
  updateLastMessageDB,
};
