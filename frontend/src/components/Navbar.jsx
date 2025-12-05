import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", {
      state: { logoutMsg: "Logged out successfully!" }
    });
  };

  return (
    <AppBar
      position="static"
      elevation={3}
      sx={{
        background: "#1e40af",
        paddingY: 1
      }}
    >
      <Toolbar className="flex justify-between">
        <Box className="flex items-center gap-6">
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", letterSpacing: "0.5px" }}
          >
            Task Manager
          </Typography>

          <Link
            to="/"
            className="text-white hover:opacity-80 transition-all text-md font-medium"
          >
            Dashboard
          </Link>
        </Box>

        {/* RIGHT SIDE */}
        <Box className="flex items-center gap-5">
          {user && (
            <Button
              variant="contained"
              onClick={handleLogout}
              sx={{
                backgroundColor: "#ef4444",
                "&:hover": { backgroundColor: "#dc2626" },
                paddingX: 3,
                paddingY: 1,
                borderRadius: "12px",
                fontWeight: "600",
                textTransform: "none",
                fontSize: "15px"
              }}
            >
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
