const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const GaitSchema = new Schema({
	Gait_Details: { type: String, required: true },
});

const GaitModel = mongoose.model("GaitModel", GaitSchema);
module.exports = GaitModel;
