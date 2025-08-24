import React from "react";
import { ResponsiveBar } from "@nivo/bar";

// Monthly data (dummy)
const data = [
  { month: "Jan", users: 220, sales: 3500 },
  { month: "Feb", users: 90, sales: 2700 },
  { month: "Mar", users: 250, sales: 5000 },
  { month: "Apr", users: 500, sales: 4100 },
  { month: "May", users: 170, sales: 6200 },
  { month: "Jun", users: 140, sales: 4800 },
];

// Light cyan colors
const customColors = {
  users: "#0e6868",    // deeper cyan for users
  sales: "#96e5e5",    // lighter cyan for sales
};

const BarChart = () => {
  return (
    <div style={{ backgroundColor: "#ffffff", borderRadius: "10px", padding: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
      <h3 style={{ textAlign: "center", color: "#0e6868", marginBottom: "20px" }}>
        Total Users & Total Sales (Monthly)
      </h3>

      <div style={{ height: "400px" }}>
        <ResponsiveBar
          data={data}
          keys={["users", "sales"]}
          indexBy="month"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          labelSkipWidth={12}
          labelSkipHeight={12}
          enableLabel={false}
          colors={({ id }) => customColors[id]}
          axisBottom={{
            tickRotation: -15,
            legend: "Month",
            legendPosition: "middle",
            legendOffset: 32,
          }}
          axisLeft={{
            legend: "Count / ₹",
            legendPosition: "middle",
            legendOffset: -40,
          }}
          legends={[
            {
              dataFrom: "keys",
              anchor: "bottom-right",
              direction: "column",
              translateX: 120,
              itemsSpacing: 4,
              itemWidth: 100,
              itemHeight: 20,
              symbolSize: 18,
              effects: [
                {
                  on: "hover",
                  style: {
                    itemTextColor: "#000",
                    itemBackground: "#f0f0f0",
                  },
                },
              ],
            },
          ]}
          animate={true}
          theme={{
            tooltip: {
              container: {
                background: "#ffffff",
                color: "#333",
                fontSize: 13,
                borderRadius: "4px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              },
            },
            labels: {
              text: {
                fill: "#333",
              },
            },
            legends: {
              text: {
                fill: "#333",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default BarChart;
