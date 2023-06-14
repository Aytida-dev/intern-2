const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  desc: { type: String, required: true },
  status: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  deadline: { type: Date, required: true },
});

const taskModel = mongoose.model("task", taskSchema);
module.exports = { taskModel };
