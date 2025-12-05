import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Card, TextField, Button, Snackbar, Alert } from "@mui/material";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [snack, setSnack] = useState({
    open: false,
    msg: "",
    severity: "success"
  });

  const validate = () => {
    let err = {};
    if (!form.name.trim()) err.name = "Name is required";
    if (!form.email.trim()) err.email = "Email is required";
    if (!form.password.trim()) err.password = "Password is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("password", form.password);
      if (image) fd.append("image", image);

      const res = await register(fd);

      setSnack({
        open: true,
        msg: res.message || "Registered successfully!",
        severity: "success"
      });

      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setSnack({
        open: true,
        msg: "Registration failed",
        severity: "error"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="p-10 w-full max-w-lg shadow-xl rounded-3xl border border-gray-300">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium">Name</label>
            <TextField
              placeholder="Enter your name"
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              InputProps={{ style: { borderRadius: "12px", height: "50px" } }}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium">Email</label>
            <TextField
              placeholder="Enter your email"
              fullWidth
              error={!!errors.email}
              helperText={errors.email}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              InputProps={{ style: { borderRadius: "12px", height: "50px" } }}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium">Password</label>
            <TextField
              placeholder="Enter your password"
              type="password"
              fullWidth
              error={!!errors.password}
              helperText={errors.password}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              InputProps={{ style: { borderRadius: "12px", height: "50px" } }}
            />
          </div>

          {/* Image Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              className="border rounded-xl p-3 text-gray-700"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          {/* Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            className="!bg-blue-600 !py-3 !rounded-xl !text-lg"
          >
            Register
          </Button>
        </form>
        <p className="mt-6 text-center text-gray-700 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-purple-600 font-semibold hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ mt: 8 }}
      >
        <Alert severity={snack.severity} variant="filled">
          {snack.msg}
        </Alert>
      </Snackbar>
    </div>
  );
}
