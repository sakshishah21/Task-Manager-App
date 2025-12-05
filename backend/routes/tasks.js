const express = require("express");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
} = require("../controllers/taskController");

const router = express.Router();

router.post("/", auth, upload.single("image"), createTask);
router.get("/", auth, getTasks);
router.get("/:id", auth, getTaskById);
router.put("/:id", auth, upload.single("image"), updateTask);
router.delete("/:id", auth, deleteTask);

module.exports = router;
