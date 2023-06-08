const express = require("express");

const router = express.Router();
router.use(express.json());

const {
  getAllCampaigns,
  loadCampaign,
  saveCampaign,
} = require("../controllers/campaign/campaignController");

const { protect } = require("../middleware/authmiddleware");

router.post("/", protect, saveCampaign);
router.get("/", protect, getAllCampaigns);
router.get("/:id", protect, loadCampaign);

module.exports = router;
