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
    const contact = await createContactDB(3, element.wtsp, element);
    log[i] = contact ? contact : "Not Saved Error";
  });
  return res.status(200).json(log);
};

const updateContact = async (req, res) => {};

const selectContacts = asyncHandler(async (req, res) => {
  const { userID } = req.params;
  const { filters } = req.query;

  console.log(req.params);
  if (!userID) {
    res.status(500);
    throw new Error("No UserId");
  }
  const response = await selectContactsDB(userID, filters);
  return res
    .status(200)
    .json({ selected: response.selected, nonSelected: response.deselected });
});

const deleteContact = async () => {};

const updateLastMessage = async (userId, wtsp, msgId) => {
  const contact = await updateLastMessageDB(3, wtsp, msgId, new Date());
  return contact;
};

module.exports = {
  createNewContacts,
  updateContact,
  selectContacts,
  deleteContact,
  updateLastMessage,
};
