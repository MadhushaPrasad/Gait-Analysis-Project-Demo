const express = require("express");
const router = express.Router();
const {
	addGait,
	updateGait,
	deleteGait,
	getGaitByID,
	getAllGait,
} = require("../controller/GaitController");

router.get("/all", getAllGait);
router.post("/", addGait);
router.put("/", updateGait);
router.delete("/:id", deleteGait);
router.get("/:id", getGaitByID);
module.exports = router;
