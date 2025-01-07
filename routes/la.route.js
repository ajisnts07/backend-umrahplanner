const express = require("express");
const router = express.Router();
const {
  indexLa,
  showLa,
  storeLa,
  updateLa,
  deleteLa,
} = require("../controllers/la.controller");

router.get("/", indexLa);
router.get("/:id", showLa);
router.post("/", storeLa);
router.put("/:id", updateLa);
router.delete("/:id", deleteLa);

module.exports = router;
