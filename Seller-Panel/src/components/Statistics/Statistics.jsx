import React from "react";
import "./Statistics.css";
import Barchart from"../Charts/BarChart";

const Statistics = () => {
  // Dummy data
  const stats = [
    { title: "Total Orders", value: 1280 },
    { title: "Total Products", value: 342 },
    { title: "Revenue (₹)", value: 254000 },
    { title: "Average Rating", value: 4.5 },
  ];

  return (
    <div className="stats-page">
      <h1 className="stats-header">Store Statistics</h1>

      <div className="stats-cards">
        {stats.map((stat, index) => (
          <div className="stat-card" key={index}>
            <h2>{stat.value}</h2>
            <p>{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="stats-graph">
        <h2>Monthly Orders</h2>
        <div className="graph-placeholder">
          {/* Later, replace with a chart library */}
          <p>Graph will go here</p>
        </div>
      </div>
      <Barchart></Barchart>
    </div>
  );
};

export default Statistics;