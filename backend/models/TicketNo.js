const mongoose = require("mongoose");

//ticket Schema MongoDB
const ticketNoSchema = new mongoose.Schema({
  ticketNo: { type: String, default: "T00001" },
});

module.exports = mongoose.model("TicketNo", ticketNoSchema);
