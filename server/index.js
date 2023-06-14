const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
app.use(express.json());

const { db } = require("./db");

const cors = require("cors");
app.use(cors());

const { taskRouter } = require("./routes/taskRoutes");

app.use("/tasks", taskRouter);

app.get("/", (req, res) => {
  res.send({
    message: "Welcome to the Task Manager API",
  });
});

app.listen(port, async () => {
  try {
    await db;
    console.log(`conneected to mongobd`);
  } catch (error) {
    console.log(error);
  }
  console.log(`Server is running on port ${port}`);
});
