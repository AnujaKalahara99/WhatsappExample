const mongoose = require("mongoose");

const logSchema = mongoose.Schema(
  {
    log: { type: String, required: true },
  },
  { timestamp: true }
);

const logModel = mongoose.model("Log", logSchema);

const createLog = async (log) => {
  const messageSaved = await logModel.create({
    log: "iuhujnn",
  });

  return messageSaved;
};

module.exports = { logModel, createLog };
