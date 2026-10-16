const contacts = require("../models/contactModel");

// send a message with conact
async function contactMessage(req, res) {
  try {
    const { name, email, subject, message } = req.body;

    // check are fields
    if (!name || !email || !subject || !message) {
      return res
        .status(400)
        .send({ success: false, message: "All fields are required" });
    }

    //create a message
    const contact = await contacts.create({
      name,
      email,
      subject,
      message,
    });

    return res.status(200).send({
      success: true,
      message: "Contact message sent successfully",
      contact,
    });
  } catch (error) {
    console.log("contact error:", error);
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong in contact" });
  }
}

// get all message with contact
async function getAllContactMessage(req, res) {
  try {
    const messages = await contacts.find().sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "fetch all messages successfully",
      messages,
    });
  } catch (error) {
    console.log("error all messages:", error);
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
  }
}

// delete to contact 
async function deleteContactMessage(req, res) {
  try {
    const { id } = req.params;

    const message = await contacts.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).send({
        success: false,
        message: "Contact message not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Contact message deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      message: "Contact message not deleted",
    });
  }
}

module.exports = { contactMessage, getAllContactMessage, deleteContactMessage };
