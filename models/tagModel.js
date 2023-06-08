const mongoose = require("mongoose");

const tagSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    label: { type: String, required: [true, "Please add title"] },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

const tagModel = mongoose.model("tags", tagSchema);

const selectTagsDB = async (userId, filters) => {
  delete filters["userId"];
  const selected = await tagModel.find({ $and: [{ userId }, filters] });
  const deselected = await tagModel.find({
    $and: [{ userId }, { $nor: [filters] }],
  });
  return { selected, deselected };
};

const createTagsDB = async (userId, label, others) => {
  const existingContact = await tagModel.findOne({ userId, label });
  if (existingContact) return null;
  const tag = await tagModel.create({ userId, label, ...others });
  return tag;
};

module.exports = { tagModel, selectTagsDB, createTagsDB };
