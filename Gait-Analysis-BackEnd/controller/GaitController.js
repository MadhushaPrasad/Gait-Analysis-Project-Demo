const GaitModal = require("../model/GaitModel");

//addGait function
const addGait = (req, res) => {
	console.log(req.body);
	const {
		Gait_Details
	} = req.body;

	const mongooseRes = new GaitModal({
		Gait_Details
	});
	mongooseRes.save().then((result) => {
		res
			.status(200)
			.json({
				message: "Gait added successfully",
				result: {
					data: result,
					response: true,
				},
			})
			.catch((err) => {
				console.log("err", err);
				res.status(400).json(err);
			});
	});
};

//getAll Client Details
const getAllGait = (req, res) => {
	// console.log("getAllGait", req);
	GaitModal.find((err, data) => {
		if (err) {
			res.status(500).json({
				message: "Error in getting all gait",
				error: err,
			});
		} else {
			res.status(200).json({
				message: "All gait details",
				data: data,
			});
		}
	});
};

// get a single client
const getGaitByID = (req, res) => {
	console.log(req.params.id);
	GaitModal.findById(req.params.id, (err, data) => {
		console.log(data);
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(data);
		}
	});
};

//update a client
const updateGait = (req, res) => {
	GaitModal.findByIdAndUpdate(
		req.body._id,
		{
			$set: req.body,
		},
		(err, data) => {
			if (err) {
				res.status(500).json({
					message: "Error in updating gait",
					error: err,
				});
			} else {
				res.status(200).json({
					message: "gait updated successfully",
					result: {
						data: data,
						response: true,
					},
				});
			}
		}
	);
};

//delete a client
const deleteGait = (req, res) => {
	GaitModal.findByIdAndDelete(req.params.id, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(data);
		}
	});
};

module.exports = {
	addGait: addGait,
	getAllGait: getAllGait,
	getGaitByID: getGaitByID,
	updateGait: updateGait,
	deleteGait: deleteGait,
};
