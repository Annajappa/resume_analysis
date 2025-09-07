import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Modal,
  Divider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ResumeAnalysis from "./ResumeAnalysis";
import api from "../api";

export default function ResumeHistory() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/resumes");

      // sort by ID ascending
      const sorted = data
        .sort((a, b) => a.id - b.id)
        .map((r, idx) => ({
          id: r.id ?? idx,
          serial: idx + 1,
          ...r,
        }));

      setResumes(sorted);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch resume history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleView = (resume) => {
    setSelectedResume(resume);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedResume(null);
  };

  const columns = [
    { field: "serial", headerName: "S/N", width: 80 },
    { field: "file_name", headerName: "File Name", flex: 1 },
    { field: "name", headerName: "Candidate Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "resume_rating",
      headerName: "Rating",
      width: 120,
      valueGetter: (params) =>
        params.row?.resume_rating ?? "-",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleView(params.row)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom color="#1976d2">
         Resume History
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress />
        </Box>
      ) : resumes.length === 0 ? (
        <Typography mt={2}>No resumes uploaded yet.</Typography>
      ) : (
        <Paper sx={{ height: 500, width: "100%", overflow: "hidden" }}>
          <DataGrid
            rows={resumes}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableRowSelectionOnClick
          />
        </Paper>
      )}

      {/* Modal */}
      <Modal open={modalOpen} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 800 },
            bgcolor: "#fefefe",
            boxShadow: 24,
            p: 4,
            borderRadius: 3,
            maxHeight: "85vh",
            overflowY: "auto",
            border: "2px solid #1976d2",
          }}
        >
          <Typography variant="h6" gutterBottom color="#1976d2">
            {selectedResume?.name || "Candidate Details"}
          </Typography>
          <Divider sx={{ mb: 2, borderColor: "#1976d2" }} />
          {selectedResume && <ResumeAnalysis data={selectedResume} />}
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button variant="contained" color="secondary" onClick={handleClose}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
