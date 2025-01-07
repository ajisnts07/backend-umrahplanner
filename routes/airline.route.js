const express = require("express");
const router = express.Router();
const {
  indexAirline,
  showAirline,
  storeAirline,
  updateAirline,
  deleteAirline,
} = require("../controllers/airline.controller");

router.get("/", indexAirline);
router.get("/:id", showAirline);
router.post("/", storeAirline);
router.put("/:id", updateAirline);
router.delete("/:id", deleteAirline);

module.exports = router;
