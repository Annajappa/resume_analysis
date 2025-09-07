import React, { useState } from "react";
import { Button, CircularProgress, Paper, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import api from "../api";

export default function ResumeUploader({ onAnalysis }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF file!");

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);
    try {
      const res = await api.post("https://resume-analysis-1-pz4k.onrender.com/api/upload", formData);
      onAnalysis(res.data); // send data to parent
    } catch (err) {
      console.error(err);
      alert("Upload or analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: "2px dashed #1976d2",
        borderRadius: 4,
        gap: 2,
        maxWidth: 500,
        margin: "0 auto",
      }}
    >
      <CloudUploadIcon sx={{ fontSize: 50, color: "#1976d2" }} />
      <Typography variant="h6" align="center">
        Drag & drop your resume here or click to select
      </Typography>
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="resume-upload"
      />
      <label htmlFor="resume-upload" style={{ width: "100%" }}>
        <Button
          variant="outlined"
          component="span"
          fullWidth
          sx={{ borderColor: "#1976d2", color: "#1976d2" }}
        >
          {file ? file.name : "Select PDF"}
        </Button>
      </label>

      <Button
        variant="contained"
        color="primary"
        startIcon={<CloudUploadIcon />}
        onClick={handleUpload}
        disabled={loading || !file}
        sx={{ width: "100%" }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Upload & Analyze"}
      </Button>
    </Paper>
  );
}
