const asyncHandler = require("express-async-handler");
const {
  tagModel,
  selectTagsDB,
  createTagsDB,
} = require("../../models/tagModel");

const createTags = asyncHandler(async (req, res) => {
  const tags = req.body;
  const log = [];

  tags.forEach(async (element, i) => {
    const tag = await createTagsDB(req.user._id, element.label, {
      description: element.description,
    });
    log.push(tag);
  });
  return res.status(200).json(log);
});

const updateTags = async (req, res) => {};

const selectTags = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const userId = _id.toString();
  let { filters } = req.query;
  if (!filters) filters = {};

  if (!userId) {
    res.status(500);
    throw new Error("No UserId");
  }
  const response = await selectTagsDB(userId, filters);
  return res
    .status(200)
    .json({ selected: response.selected, nonSelected: response.deselected });
});

const deleteTags = async () => {};

module.exports = {
  createTags,
  updateTags,
  selectTags,
  deleteTags,
};
