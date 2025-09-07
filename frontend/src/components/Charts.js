import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Charts({ technicalSkills = [], softSkills = [], rating }) {
  const barData = {
    labels: ["Resume Rating"],
    datasets: [
      {
        label: "Rating /10",
        data: [rating || 0],
        backgroundColor: ["#1976d2"],
      },
    ],
  };

  const pieData = {
    labels: ["Technical Skills", "Soft Skills"],
    datasets: [
      {
        data: [technicalSkills.length, softSkills.length],
        backgroundColor: ["#1976d2", "#ff9800"],
      },
    ],
  };

  return (
    <div style={{ display: "flex", gap: 40, marginTop: 24, flexWrap: "wrap" }}>
      <div style={{ width: 300 }}>
        <Bar data={barData} options={{ indexAxis: "y", responsive: true }} />
      </div>
      <div style={{ width: 300 }}>
        <Pie data={pieData} options={{ responsive: true }} />
      </div>
    </div>
  );
}
