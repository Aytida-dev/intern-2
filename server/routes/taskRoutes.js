const express = require("express");
const taskRouter = express.Router();

const { taskModel } = require("../models/taskModel");


taskRouter.get("/", (req, res) => {
  res.send({
    message: "Task Manager API",
  });
});

taskRouter.get("/all", async (req, res) => {
  try {
    const tasks = await taskModel.find({});
    res.send({
      message: "Tasks fetched successfully",
      tasks,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});

taskRouter.post("/create", async (req, res) => {
  try {
    const task = new taskModel(req.body);
    const createdTask = await task.save();
    res.send({
      message: "Task created successfully",
      task: createdTask,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(500).send({
        message: "Task already exists",
      });
    } else {
      return res.status(500).send({
        message: error.message,
      });
    }
  }
});

taskRouter.put("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedTaskData = req.body;
    delete updatedTaskData._id; // Exclude _id field from the update

    const task = await taskModel.findByIdAndUpdate(id, updatedTaskData, {
      new: true,
    });
    
    res.send({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(500).send({
        message: "Task already exists",
      });
    } else {
      return res.status(500).send({
        message: error.message,
      });
    }
  }
});


taskRouter.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await taskModel.findByIdAndDelete(id);
    res.send({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});

module.exports = { taskRouter };