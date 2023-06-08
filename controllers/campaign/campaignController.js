const asynchandler = require("express-async-handler");
const campaign = require("../../models/campaignModel");

const getAllCampaigns = asynchandler(async (req, res) => {
  const response = await campaign
    .find({ userId: req.user._id })
    .select("title");
  res.status(200).send(response);
});

const loadCampaign = asynchandler(async (req, res) => {
  const { id } = req.params;
  const response = await campaign.findOne({ _id: id });
  res.status(200).send(response ? response : null);
});

const saveCampaign = asynchandler(async (req, res) => {
  const { title, description, audience } = req.body;

  if (!title || !audience) throw new Error("Either Title or Audience missing");

  const response = await campaign.create({
    title,
    description,
    audience,
    userId: req.user._id,
  });
  res.status(200).send(response);
});

module.exports = {
  getAllCampaigns,
  loadCampaign,
  saveCampaign,
};
