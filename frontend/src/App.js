import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ResumeUploader from "./components/ResumeUploader";
import ResumeAnalysis from "./components/ResumeAnalysis";
import ResumeHistory from "./components/ResumeHistory";

export default function App() {
  const [analysis, setAnalysis] = useState(null);

  return (
    <Router>
      <Navbar />
      <div style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <ResumeUploader onAnalysis={setAnalysis} />
                <ResumeAnalysis data={analysis} />
              </>
            }
          />
          <Route path="/history" element={<ResumeHistory />} />
        </Routes>
      </div>
    </Router>
  );
}
