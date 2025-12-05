import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addTask } from "../services/taskService";
import Navbar from "../components/Navbar";
import {
  Card,
  TextField,
  Button,
  Snackbar,
  Alert,
  Checkbox
} from "@mui/material";

export default function AddTask() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    completed: false
  });

  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [snack, setSnack] = useState({
    open: false,
    msg: "",
    severity: "success"
  });

  const validate = () => {
    let err = {};
    if (!form.title.trim()) err.title = "Title is required";
    if (!form.description.trim()) err.description = "Description is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("completed", form.completed);

    if (image) fd.append("image", image);

    try {
      await addTask(fd);
      setSnack({
        open: true,
        msg: "Task added successfully",
        severity: "success"
      });
      setTimeout(() => navigate("/tasks"), 700);
    } catch {
      setSnack({ open: true, msg: "Failed", severity: "error" });
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center pt-20 pb-10 px-4">
        <Card className="px-10 pt-10 pb-6 w-full max-w-xl rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Add Task
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Title */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Title
              </label>
              <TextField
                fullWidth
                size="medium"
                value={form.title}
                error={!!errors.title}
                helperText={errors.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Description
              </label>
              <TextField
                fullWidth
                multiline
                rows={4}
                size="medium"
                value={form.description}
                error={!!errors.description}
                helperText={errors.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            {/* Completed Checkbox */}
            <div className="flex items-center gap-2">
              <Checkbox
                checked={form.completed}
                onChange={(e) =>
                  setForm({ ...form, completed: e.target.checked })
                }
              />
              <span className="text-gray-700 text-md font-medium">
                Mark as Completed
              </span>
            </div>

            {/* Image */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                className="border rounded-lg p-2 w-full"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                className="!border-gray-400 !text-gray-600 !rounded-lg !px-6 !py-2 !min-w-[120px]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                className="!bg-blue-600 !rounded-lg !px-6 !py-2 !min-w-[120px]"
              >
                Save
              </Button>
            </div>
          </form>
        </Card>
      </div>
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ mt: 8 }}
      >
        <Alert severity={snack.severity}>{snack.msg}</Alert>
      </Snackbar>
    </>
  );
}
