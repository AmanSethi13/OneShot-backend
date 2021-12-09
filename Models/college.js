const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  Year_Founded: { type: Number, required: true },
  City: { type: String, required: true },
  State: { type: String, required: true },
  Country: { type: String, required: true },
  Total_Students: { type: Number, required: true },
  Courses: [String],
});

module.exports = mongoose.model("College", Schema);
