import React from "react";
import ResumeUploader from "../components/ResumeUploader";
import "./Home.css";

function Home() {
  return (
    <div className="page home">
      <h2>Upload & Analyze Resume</h2>
      <p>Upload your resume to get AI-driven feedback and insights.</p>
      <ResumeUploader />
    </div>
  );
}

export default Home;
