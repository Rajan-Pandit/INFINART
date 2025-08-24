import React from "react";
import { FaRupeeSign, FaBox, FaShoppingCart, FaUsers } from "react-icons/fa";
import "./Dashboard.css";
import EnchancedTable from "../ProductTable/ProductTable";
import OrderTable from "../OrderTable/OrderTable";
import BarChart from "../Charts/BarChart";
import { Link } from "react-router-dom";

const cards = [
  {
    label: "Total Revenue",
    value: "₹12,450.5",
    trend: "+12.5%",
    subtext: "from last month",
    icon: <FaRupeeSign />,
  },
  {
    label: "Total Orders",
    value: "87",
    trend: "+8.3%",
    subtext: "from last month",
    icon: <FaShoppingCart />,
  },
  {
    label: "Total Products",
    value: "24",
    trend: "+2.1%",
    subtext: "from last month",
    icon: <FaBox />,
  },
  {
    label: "Total Customers",
    value: "156",
    trend: "+15.7%",
    subtext: "from last month",
    icon: <FaUsers />,
  },
];

function Dashboard() {
  return (
    <div className="dashboard-background">
      <div className="dashboard-overview-content">
        {/* Welcome Box */}
        <div className="dashboard-welcome-box">
          <div className="dashboard-welcome-text">
            <h1>Welcome, Shiv</h1>
            <p>Here's what's happening on your store today. See the statistics at once.</p>
            <Link to="/addProduct">
  <button className="dashboard-add-btn">
    <span className="add-icon">＋</span> Add Product
  </button>
</Link>
          </div>
          <div className="dashboard-welcome-image">
            <img
              src="https://cdni.iconscout.com/illustration/premium/thumb/mobile-shop-6772181-5619359.png"
              alt="Dashboard Illustration"
            />
          </div>
        </div>

        {/* Cards */}
        <div className="dashboard-cards-row">
          {cards.map((card) => (
            <div className="dashboard-card-box" key={card.label}>
              <div className="dashboard-card-icon">{card.icon}</div>
              <div className="dashboard-card-label">{card.label}</div>
              <div className="dashboard-card-value">{card.value}</div>
              <div className="dashboard-card-trend">
                <span className="dashboard-card-trend-up">{card.trend}</span>
                <span className="dashboard-card-trend-desc">{card.subtext}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table Sections */}
      <div className="dashboard-table-section">
        <EnchancedTable />
      </div>
      <div className="dashboard-table-section">
        <OrderTable />
      </div>
       <div className="dashboard-charts-section">
      <h2>Statistics</h2>
      <div className="dashboard-chart-barchart">
        <BarChart />
      </div>
    </div>
    </div>
          
  );
}

export default Dashboard;
