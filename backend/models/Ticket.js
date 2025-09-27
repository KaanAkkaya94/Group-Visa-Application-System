const mongoose = require("mongoose");

//ticket Schema MongoDB
const ticketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ticketNo: { type: String },
  username: { type: String, required: true },
  subject: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["In Progress", "Completion"],
    required: true,
    default: "In Progress",
  },
});

module.exports = mongoose.model("Ticket", ticketSchema);
