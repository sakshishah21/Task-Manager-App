import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTaskById, updateTask } from "../services/taskService";
import Navbar from "../components/Navbar";
import {
  Card,
  TextField,
  Button,
  Snackbar,
  Alert,
  Checkbox
} from "@mui/material";

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    completed: false
  });

  const [existingImage, setExistingImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [errors, setErrors] = useState({});

  const [snack, setSnack] = useState({
    open: false,
    msg: "",
    severity: "success"
  });

  useEffect(() => {
    getTaskById(id).then((res) => {
      const t = res.data;
      setForm({
        title: t.title,
        description: t.description,
        completed: t.completed ?? false
      });
      setExistingImage(t.image);
    });
  }, [id]);

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
    if (newImage) fd.append("image", newImage);

    try {
      await updateTask(id, fd);
      setSnack({
        open: true,
        msg: "Task updated successfully",
        severity: "success"
      });
      setTimeout(() => navigate("/tasks"), 700);
    } catch {
      setSnack({ open: true, msg: "Update failed", severity: "error" });
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
        <Card className="w-full max-w-xl rounded-2xl shadow-2xl p-10 bg-white">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Edit Task
          </h2>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {/* Title */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Task Title
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
            {existingImage && (
              <div className="mt-1">
                <label className="block mb-1 font-medium text-gray-700">
                  Image
                </label>
                <img
                  src={`${process.env.REACT_APP_API_URL}${existingImage}`}
                  className="h-28 w-40 rounded-lg object-cover border shadow-sm"
                  alt="existing-preview"
                />
              </div>
            )}

            {/* Completed Checkbox */}
            <div className="flex items-center gap-2 mt-2">
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

            {/* New Image Upload */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Upload New Image
              </label>
              <input
                type="file"
                accept="image/*"
                className="border rounded-lg p-2 w-full"
                onChange={(e) => setNewImage(e.target.files[0])}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outlined"
                className="!border-gray-400 !text-gray-600 !rounded-lg !px-6 !py-2 !min-w-[120px]"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                type="submit"
                className="!bg-blue-600 !rounded-lg !px-6 !py-2 !min-w-[120px]"
              >
                Update
              </Button>
            </div>
          </form>
        </Card>
      </div>
      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ mt: 8 }}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert severity={snack.severity}>{snack.msg}</Alert>
      </Snackbar>
    </>
  );
}
