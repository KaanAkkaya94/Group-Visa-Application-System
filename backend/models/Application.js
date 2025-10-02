const mongoose = require("mongoose");

//Application Schema MongoDB
const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  cost: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  countryofresidence: { type: String },
  email: { type: String },
  city: { type: String },
  passportNo: { type: String },
  dateofarrival: { type: Date },
  dateofdeparture: { type: Date },
  status: {
    type: String,
    enum: ["Rejected", "Approval", "Pre-payment", "Pending"],
    default: "Pre-payment",
  },
});

module.exports = mongoose.model("Application", applicationSchema);
