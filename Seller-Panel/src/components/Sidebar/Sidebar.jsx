import React, { useState } from 'react';
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

  const toggleProductDropdown = () => {
    setProductDropdownOpen(!isProductDropdownOpen);
  };

  return (
    <div className="sidebar">
      <div>
        <div className="sidebar-header">
          <FiHome size={20} />
          <h2>STORE NAME</h2>
        </div>

        <div className="sidebar-nav">
          <div className="nav-item">
            <MdOutlineDashboard size={18} />
            Dashboard
          </div>
          <div className="nav-item">
            <FiBarChart2 size={18} />
            Statistics
          </div>
          <div className="nav-item">
            <FiShoppingCart size={18} />
            Orders
          </div>

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
              <div className="dropdown-item">All Products</div>
              <div className="dropdown-item">Add Product</div>
            </div>
          )}

          <div className="nav-item">
            <FiPackage size={18} />
            Inventory
          </div>

          <div className="nav-item">
            <FiSettings size={18} />
            Settings
          </div>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="user-info">
          <FaUserCircle size={28} />
          <div className="user-info-text">
            <strong>STORE NAME</strong>
            <br />
            <small>storename@example.com</small>
          </div>
        </div>
        <div className="sign-out-btn">
          <FiLogOut size={16} />
          Sign Out
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
