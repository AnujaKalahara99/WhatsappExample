const mongoose = require("mongoose");

const campaignschema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: [true, "Please add title"] },
    description: { type: String },
    audience: { type: Array },
    commits: {},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("campaigns", campaignschema);
