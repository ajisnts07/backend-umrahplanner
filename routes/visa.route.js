const express = require("express");
const router = express.Router();
const {
  indexVisa,
  showVisa,
  storeVisa,
  updateVisa,
  deleteVisa,
} = require("../controllers/visa.controller");

router.get("/", indexVisa);
router.get("/:id", showVisa);
router.post("/", storeVisa);
router.put("/:id", updateVisa);
router.delete("/:id", deleteVisa);

module.exports = router;
