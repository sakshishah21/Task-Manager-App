import API from "../api/axiosInstance";

// Add Task (with image)
export const addTask = (formData) =>
  API.post("/tasks", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

// Get All Tasks
export const getTasks = () => API.get("/tasks");

// Get Single Task
export const getTaskById = (id) => API.get(`/tasks/${id}`);

// Update Task
export const updateTask = (id, formData) =>
  API.put(`/tasks/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

// Delete Task
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

// Mark as completed / toggle
export const toggleComplete = (id) => API.put(`/tasks/${id}`);
