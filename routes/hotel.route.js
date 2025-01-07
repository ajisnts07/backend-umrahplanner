const express = require("express");
const router = express.Router();
const {
  indexHotel,
  showHotel,
  storeHotel,
  updateHotel,
  deleteHotel,
} = require("../controllers/hotel.controller");

router.get("/", indexHotel);
router.get("/:id", showHotel);
router.post("/", storeHotel);
router.put("/:id", updateHotel);
router.delete("/:id", deleteHotel);

module.exports = router;
