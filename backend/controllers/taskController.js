const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      user: req.user._id,
      title: req.body.title,
      description: req.body.description,
      completed: req.body.completed || false,
      image: req.file ? "/uploads/" + req.file.filename : ""
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to create task" });
  }
};

exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(tasks);
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch task" });
  }
};

exports.updateTask = async (req, res) => {
  const update = req.body;

  if (req.file) update.image = "/uploads/" + req.file.filename;

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    update,
    { new: true }
  );

  res.json(task);
};

exports.deleteTask = async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.json({ message: "Task deleted" });
};
