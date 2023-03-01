const axios = require("axios");
const asyncHandler = require("express-async-handler");

const {
  contactModel,
  createContact: createContactDB,
  selectContacts: selectContactsDB,
  updateContact: updateContactDB,
  updateLastMessage: updateLastMessageDB,
} = require("../../models/contactsModel");

const createNewContacts = async (req, res) => {
  const log = [];
  contacts = req.body;

  contacts.forEach(async (element, i) => {
    const contact = await createContactDB(
      req.user.userId,
      element.wtsp,
      element
    );
    log[i] = contact ? contact : "Not Saved Error";
  });
  return res.status(200).json(log);
};

const updateContact = async (req, res) => {};

const selectContacts = asyncHandler(async (req, res) => {
  const { userId } = req.user;
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

const updateLastMessage = async (userId, wtsp, msgId) => {
  const contact = await updateLastMessageDB(3, wtsp, msgId, new Date());
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

module.exports = {
  createNewContacts,
  updateContact,
  selectContacts,
  deleteContact,
  updateLastMessage,
  filterByTags,
};
