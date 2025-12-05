import React, { useEffect, useState } from "react";
import { getTasks, deleteTask } from "../services/taskService";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  Button,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [snack, setSnack] = useState({
    open: false,
    msg: "",
    severity: "success"
  });

  const load = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch {
      setSnack({ open: true, msg: "Failed to load tasks", severity: "error" });
    }
  };

  useEffect(() => {
    load();
  }, []);

  // DELETE FUNCTION
  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      load();
      setSnack({
        open: true,
        msg: "Task deleted successfully!",
        severity: "success"
      });
    } catch {
      setSnack({
        open: true,
        msg: "Failed to delete task",
        severity: "error"
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <div className="flex justify-between mb-5">
          <h1 className="text-2xl font-bold">Task List</h1>
          <Link to="/add-task">
            <Button variant="contained" className="!bg-blue-600">
              Add Task
            </Button>
          </Link>
        </div>

        <TableContainer component={Paper} className="shadow-lg rounded-xl">
          <Table sx={{ minWidth: 650 }}>
            <TableHead className="bg-blue-50">
              <TableRow>
                <TableCell sx={{ fontWeight: 700, fontSize: "15px" }}>
                  ID
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "15px" }}>
                  Title
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "15px" }}>
                  Description
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "15px" }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "15px" }}>
                  Image
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "15px" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {tasks.map((t, i) => (
                <TableRow
                  key={t._id}
                  sx={{
                    "& td": {
                      paddingTop: "14px",
                      paddingBottom: "14px",
                      fontSize: "15px",
                      fontWeight: 400
                    }
                  }}
                >
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{t.title}</TableCell>
                  <TableCell>{t.description}</TableCell>

                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        t.completed ? "bg-green-500" : "bg-gray-500"
                      }`}
                    >
                      {t.completed ? "Completed" : "Pending"}
                    </span>
                  </TableCell>

                  <TableCell>
                    {t.image && (
                      <img
                        src={`${process.env.REACT_APP_API_URL}${t.image}`}
                        className="h-12 w-20 rounded object-cover border"
                      />
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <Link to={`/edit-task/${t._id}`}>
                        <Button variant="contained" className="!bg-blue-600">
                          Edit
                        </Button>
                      </Link>

                      <Button
                        variant="contained"
                        className="!bg-red-500"
                        onClick={() => handleDelete(t._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* SNACKBAR */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ mt: 8 }}
      >
        <Alert severity={snack.severity}>{snack.msg}</Alert>
      </Snackbar>
    </>
  );
}
