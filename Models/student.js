const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  Year_Of_Batch: { type: Number, required: true },
  College_ID: { type: Number, required: true },
  Skills: [String],
});

module.exports = mongoose.model("Student", Schema);
