const mongoose = require("mongoose");

const logSchema = mongoose.Schema(
  {
    log: { type: String, required: true },
  },
  { timestamp: true }
);

const createLog = async (log) => {
  const messageSaved = await logModel.create({
    log,
  });

  return messageSaved;
};

const logModel = mongoose.model("Log", logSchema);

module.exports = { logModel, createLog };
