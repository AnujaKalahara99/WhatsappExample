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

const createNewContacts = asyncHandler(async (req, res) => {
  const log = [];
  contacts = req.body;

  contacts.forEach(async (element, i) => {
    if (!element.name) {
      res.status(400);
      throw new Error("Please add contact name");
    }

    if (!element.wtsp) {
      res.status(400);
      throw new Error("Please add contact number");
    }

    if (!element.tags) {
      res.status(400);
      throw new Error("Please add contact tag");
    }

    const contactdata = await createContactDB(req.user.id, element.wtsp, {
      name: element.name,
      tags: element.tags,
    });
    // const contact = await createContactDB(
    //   req.user._id, //Maybe Problematic
    //   element.wtsp,
    //   element
    // );
    log.push(contactdata);
    // log[i] = contact ? contact : "Not Saved Error";
  });
  return res.status(200).json(log);
});

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

// @desc    Delete contact details
// @route   DELETE /api/contactsmanager/:id
// @access  Private
const deleteContact = asyncHandler(async (req, res) => {
  const Contact_out = await contactModel.findById(req.params.id);

  if (!Contact_out) {
    res.status(400);
    throw new Error("Contact not found");
  }

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  // Make sure the logged in user matches the contact user
  if (Contact_out.userId !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await Contact_out.remove();

  res.status(200).json({ id: req.params.id });
});

const updateLastMessage = async (
  userId,
  wtsp,
  msg,
  updateUnreadCount,
  time
) => {
  const contact = await updateLastMessageDB(
    userId,
    wtsp,
    msg,
    updateUnreadCount,
    time
  );
  return contact;
};

const updateConversationTimeOut = async (userId, wtsp, conversationTimeOut) => {
  const contact = await updateConversationTimeOutDB(
    userId,
    wtsp,
    conversationTimeOut
  );
  return contact;
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

const getAllUniqueTags = asyncHandler(async (req, res) => {
  const contactdata = await contactModel.distinct("tags");
  res.status(200).json(contactdata);
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
  updateConversationTimeOut,
  filterByTags,
  getRecent,
  readContact,
  getAllUniqueTags,
};
