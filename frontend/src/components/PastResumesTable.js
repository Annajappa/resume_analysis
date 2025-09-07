import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import api from "../api";  


export default function PastResumesTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/resumes");
      console.log("History fetched:", data); 
      setRows(
        data.map((r) => ({
          id: r.id,
          file_name: r.file_name || "Untitled",
          uploaded_at: r.uploaded_at
            ? new Date(r.uploaded_at).toLocaleString()
            : "N/A",
          name: r.name || "Unknown",
          email: r.email || "N/A",
          resume_rating: r.resume_rating ?? "N/A",
        }))
      );
    } catch (err) {
      console.error("Failed to fetch resumes:", err);
      setError("Could not load resume history. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "file_name", headerName: "File Name", flex: 1 },
    { field: "uploaded_at", headerName: "Uploaded At", width: 200 },
    { field: "name", headerName: "Candidate Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "resume_rating", headerName: "Rating", width: 120 },
  ];

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Resume History
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      ) : rows.length === 0 ? (
        <Typography mt={2}>No resumes uploaded yet.</Typography>
      ) : (
        <Paper sx={{ height: 500, width: "100%", overflow: "hidden" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableRowSelectionOnClick
          />
        </Paper>
      )}

      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={load}>
          Refresh
        </Button>
      </Box>
    </Box>
  );
}
