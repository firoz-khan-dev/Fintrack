const Activity = require("../models/activityModel");

// Add activity
async function addActivity(req, res) {
  try {
    const { type } = req.body;

    const activity = await Activity.create({
      userId: req.user.id,
      type,
    });

    return res.status(201).send({
      success: true,
      message: "Activity added successfully",
      activity,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
  }
}

// Get all activities for admin
async function getAllActivities(req, res) {
  try {
    const activities = await Activity.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      message: "Activities fetched successfully",
      activities,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
  }
}

// to delete activity
async function deleteActivity(req, res) {
  try {
    const { id } = req.params;

    const activity = await Activity.findByIdAndDelete(id);

    if (!activity) {
      return res.status(404).send({
        success: false,
        message: "Activity not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Activity deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      message: "Activity not deleted",
    });
  }
}
module.exports = { addActivity, getAllActivities, deleteActivity };