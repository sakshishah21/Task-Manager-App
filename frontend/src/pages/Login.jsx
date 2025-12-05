import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Card, TextField, Button, Snackbar, Alert } from "@mui/material";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [snack, setSnack] = useState({
    open: false,
    msg: "",
    severity: "success"
  });

  // Show logout message
  useEffect(() => {
    if (location.state?.logoutMsg) {
      setSnack({
        open: true,
        msg: location.state.logoutMsg,
        severity: "success"
      });
    }
  }, [location.state]);

  const validate = () => {
    const err = {};
    if (!form.email.trim()) err.email = "Email is required";
    if (!form.password.trim()) err.password = "Password is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await login(form.email, form.password);

      setSnack({
        open: true,
        msg: "Logged in successfully",
        severity: "success"
      });

      navigate("/");
    } catch (err) {
      setSnack({
        open: true,
        msg: err?.response?.data?.message || "Login failed",
        severity: "error"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <Card className="p-10 w-full max-w-lg shadow-xl rounded-3xl border border-gray-300">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium">Email</label>
            <TextField
              size="medium"
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
              size="medium"
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
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            className="!bg-blue-600 !py-3 !rounded-xl !text-lg"
          >
            Login
          </Button>
        </form>

        {/* Register Link */}
        <p className="mt-6 text-center text-gray-700 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </Card>

      {/* SNACKBAR */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
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
