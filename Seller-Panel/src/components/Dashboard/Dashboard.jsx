// src/components/Dashboard/Dashboard.jsx
import React, { useEffect } from "react";
import { FaRupeeSign, FaBox, FaShoppingCart, FaUsers } from "react-icons/fa";
import "./Dashboard.css";
import EnchancedTable from "../ProductTable/ProductTable";
import OrderTable from "../OrderTable/OrderTable";
import BarChart from "../Charts/BarChart";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerStats, reset } from "../../Redux/dashboardSlice";

function Dashboard() {
  const dispatch = useDispatch();

  // dashboard state
  const { stats, isLoading, isError, message } = useSelector(
    (state) => state.dashboard
  );

  // Grab the whole auth slice so we can inspect it
  const authState = useSelector((state) => state.auth);
  console.log("🔎 Full auth state (from Redux):", authState);

  // Determine seller & token with graceful fallbacks to localStorage
  const sellerFromRedux = authState?.seller ?? null; // your authSlice stores seller in `seller`
  const tokenFromRedux = authState?.token ?? null;

  const sellerFromLocal =
    localStorage.getItem("sellerData") &&
    JSON.parse(localStorage.getItem("sellerData"));
  const tokenFromLocal = localStorage.getItem("sellerToken");

  const seller = sellerFromRedux || sellerFromLocal || null;
  const token = tokenFromRedux || tokenFromLocal || null;

  // compute id flexibly (supports _id, sellerId, id)
  useEffect(() => {
    const id = seller?._id || seller?.sellerId || seller?.id;
    console.log("Computed seller id:", id, "hasToken:", !!token);

    // If no seller id or no token we don't call API
    if (!id || !token) {
      if (!id) console.warn("No seller id available - dashboard stats won't load.");
      if (!token) console.warn("No auth token available - dashboard stats won't load.");
      // clear any stale stats
      dispatch(reset());
      return;
    }

    // dispatch fetch once we have id + token
    dispatch(fetchSellerStats({ sellerId: id, token }));

    // cleanup on unmount
    return () => {
      dispatch(reset());
    };
  }, [dispatch, seller, token]);

  // If there's no seller available at all, show a friendly message
  if (!seller) {
    return (
      <div className="dashboard-background">
        <div className="dashboard-overview-content">
          <div className="dashboard-welcome-box">
            <div className="dashboard-welcome-text">
              <h1>Welcome, Seller</h1>
              <p>Please log in to view your dashboard statistics.</p>
              <Link to="/login">
                <button className="dashboard-add-btn">Go to Login</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // cards built from stats (falls back to 0)
  const cards = [
    {
      label: "Total Revenue",
      value: `₹${stats?.totalRevenue ?? 0}`,
      trend: "+0%",
      subtext: "from last month",
      icon: <FaRupeeSign />,
    },
    {
      label: "Total Orders",
      value: stats?.totalOrders ?? 0,
      trend: "+0%",
      subtext: "from last month",
      icon: <FaShoppingCart />,
    },
    {
      label: "Total Products",
      value: stats?.totalProducts ?? 0,
      trend: "+0%",
      subtext: "from last month",
      icon: <FaBox />,
    },
    {
      label: "Total Customers",
      value: stats?.totalCustomers ?? 0,
      trend: "+0%",
      subtext: "from last month",
      icon: <FaUsers />,
    },
  ];

  return (
    <div className="dashboard-background">
      <div className="dashboard-overview-content">
        {/* Welcome Box */}
        <div className="dashboard-welcome-box">
          <div className="dashboard-welcome-text">
            <h1>Welcome, {stats?.sellerName || seller?.sellerName || "Seller"}</h1>
            <p>Here's what's happening in your store today. See the statistics at once.</p>
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
          {isLoading ? (
            <p>Loading stats...</p>
          ) : isError ? (
            <p>Error loading dashboard stats: {message}</p>
          ) : (
            cards.map((card) => (
              <div className="dashboard-card-box" key={card.label}>
                <div className="dashboard-card-icon">{card.icon}</div>
                <div className="dashboard-card-label">{card.label}</div>
                <div className="dashboard-card-value">{card.value}</div>
                <div className="dashboard-card-trend">
                  <span className="dashboard-card-trend-up">{card.trend}</span>
                  <span className="dashboard-card-trend-desc">{card.subtext}</span>
                </div>
              </div>
            ))
          )}
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
