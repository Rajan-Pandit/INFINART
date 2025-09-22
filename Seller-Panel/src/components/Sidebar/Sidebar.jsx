import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineDashboard } from 'react-icons/md'; 
import {
  FiShoppingCart,
  FiBarChart2,
  FiUser,
  FiLogOut,
  FiHome,
  FiBox,
  FiChevronDown,
  FiChevronUp,
  FiSettings,
  FiPackage
} from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const [isProductDropdownOpen, setProductDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleProductDropdown = () => {
    setProductDropdownOpen(!isProductDropdownOpen);
  };

  const handleSignOut = () => {
    localStorage.removeItem("sellerToken");
    localStorage.removeItem("sellerData");
    navigate("/login"); // redirect to login
  };

  return (
    <div className="sidebar">
      <div>
        <div className="sidebar-header">
          <FiHome size={20} />
          <h2>STORE NAME</h2>
        </div>

        <div className="sidebar-nav">
          <Link to="/home" className="nav-item">
            <MdOutlineDashboard size={18} />
            Overview
          </Link>

          <Link to="/statistics" className="nav-item">
            <FiBarChart2 size={18} />
            Statistics
          </Link>

          <Link to="/orders" className="nav-item">
            <FiShoppingCart size={18} />
            Orders
          </Link>

          {/* Products Dropdown */}
          <div className="nav-item dropdown" onClick={toggleProductDropdown}>
            <div className="nav-item-label">
              <FiBox size={18} />
              Products
            </div>
            {isProductDropdownOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
          </div>

          {isProductDropdownOpen && (
            <div className="dropdown-menu">
              <Link to="/products" className="dropdown-item">All Products</Link>
              <Link to="/products/add" className="dropdown-item">Add Product</Link>
            </div>
          )}

          <Link to="/inventory" className="nav-item">
            <FiPackage size={18} />
            Inventory
          </Link>

          <Link to="/settings" className="nav-item">
            <FiSettings size={18} />
            Settings
          </Link>
        </div>
      </div>

      <div className="sidebar-footer">
        <Link to="/profile" className="user-info">
          <FaUserCircle size={28} />
          <div className="user-info-text">
            <strong>STORE NAME</strong>
            <br />
            <small>storename@example.com</small>
          </div>
        </Link>

        <div className="sign-out-btn" onClick={handleSignOut}>
          <FiLogOut size={16} />
          Sign Out
        </div>
      </div>
    </div>
  );
};

export default Sidebar;