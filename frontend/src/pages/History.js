import React from "react";
import PastResumesTable from "../components/PastResumesTable";
import "./History.css";

function History() {
  return (
    <div className="page history">
      <h2>Past Resume Analysis</h2>
      <PastResumesTable />
    </div>
  );
}

export default History;
