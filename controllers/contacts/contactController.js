const axios = require("axios");
const asyncHandler = require("express-async-handler");

const {
  contactModel,
  createContactDB,
  selectContactsDB,
  updateContactDB,
  updateLastMessageDB,
  updateConversationTimeOutDB,
} = require("../../models/contactsModel");
const { getUserId } = require("../user/userController");

const createNewContacts = async (req, res) => {
  const log = [];
  contacts = req.body;

  contacts.forEach(async (element, i) => {
    const contact = await createContactDB(
      req.user._id, //Maybe Problematic
      element.wtsp,
      element
    );
    log[i] = contact ? contact : "Not Saved Error";
  });
  return res.status(200).json(log);
};

const updateContact = async (req, res) => {};

const selectContacts = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const userId = _id.toString();
  const { filters } = req.query;

  if (!userId) {
    res.status(500);
    throw new Error("No UserId");
  }
  const response = await selectContactsDB(userId, filters);
  return res
    .status(200)
    .json({ selected: response.selected, nonSelected: response.deselected });
});

const deleteContact = async () => {};

const updateLastMessage = async (
  userId,
  wtsp,
  msg,
  updateUnreadCount,
  time,
  conversationTimeOut
) => {
  if (!msg && !time) {
    const contact = await updateConversationTimeOutDB(
      userId,
      wtsp,
      conversationTimeOut
    );
    return contact;
  } else {
    const contact = await updateLastMessageDB(
      userId,
      wtsp,
      msg,
      updateUnreadCount,
      time,
      conversationTimeOut
    );
    return contact;
  }
};

const filterByTags = asyncHandler((req, res) => {
  const { contactList, filterTags } = req.query;

  if (!contactList) {
    res.status(500);
    throw new Error("No contacts to filter");
  }

  let filtered = [];
  if (filterTags && filterTags.length !== 0) {
    contactList.forEach((contact) => {
      let found = true;
      filterTags.forEach((tag) => {
        if (contact.tags.indexOf(tag) === -1) {
          found = false;
          return;
        }
      });
      if (found) {
        filtered.push(contact);
      }
    });
  } else {
    filtered = contactList;
  }
  return res.status(200).json(filtered);
});

const getRecent = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const userId = _id.toString();
  const { contact } = req.query;

  if (!userId) {
    res.status(500);
    throw new Error("No UserId");
  }

  let response = { selected: [], deselected: [] };

  if (contact) {
    //Get Specific contact details only
    response = await selectContactsDB(userId, {
      lastMessage: { $exists: true, $ne: "" },
      wtsp: contact,
    });
  } else {
    response = await selectContactsDB(userId, {
      lastMessage: { $exists: true, $ne: "" },
    });
  }
  return res
    .status(200)
    .json({ selected: response.selected, nonSelected: response.deselected });
});

const readContact = async (userId, wtsp) => {
  if (!userId || !wtsp) {
    throw new Error("No UserId or wtsp number to mark read");
  }

  return await contactModel.findOneAndUpdate(
    { userId, wtsp },
    { unreadMessageCount: 0 },
    { new: true }
  );
};

module.exports = {
  createNewContacts,
  updateContact,
  selectContacts,
  deleteContact,
  updateLastMessage,
  filterByTags,
  getRecent,
  readContact,
};
