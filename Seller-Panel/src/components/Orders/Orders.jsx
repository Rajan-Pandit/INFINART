import React, { useState } from "react";
import "./Orders.css";

const mockOrders = [
  { id: "CFFE109283", name: "Choco Chucu", date: "1 Jan 2025", price: "$5.00", customer: "Paistudio", status: "accepted" },
  { id: "CFFE842701", name: "Brocoli Cinno", date: "1 Jan 2025", price: "$8.20", customer: "Azrul Artistik", status: "completed" },
  { id: "CKKE397512", name: "Cinta Kamu", date: "1 Feb 2025", price: "$6.10", customer: "Raihan Rabka", status: "completed" },
  { id: "CKKE650384", name: "Choco Chips", date: "1 Feb 2025", price: "$1.00", customer: "Tyo Ditya", status: "accepted" },
  { id: "CFFE204971", name: "Rumput Laut Latte", date: "1 Feb 2025", price: "$10.00", customer: "Noval Amarul", status: "rejected" },
  { id: "DGHT738620", name: "Pitch Choco", date: "1 Mar 2025", price: "$69.50", customer: "Design Lagi", status: "completed" },
  { id: "CFFE416985", name: "Bening Latte", date: "1 Apr 2025", price: "$3.20", customer: "John Doe", status: "pending" },
];

export default function Orders() {
  const [orders] = useState(mockOrders);
  const [q, setQ] = useState("");

  const filtered = orders.filter((o) =>
    (o.name + o.id + o.customer).toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="orders-page">
      {/* Header */}
      <div className="header">
        <h1>Orders</h1>
        <div className="controls">
          <button className="btn">Add Order +</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats">
        <div className="card">
          <div className="num">10,123</div>
          <div className="label">Total Orders</div>
          <div className="small-chip">▲ 20% This month</div>
        </div>
        <div className="card">
          <div className="num">2,032</div>
          <div className="label">New Orders</div>
          <div className="small-chip">▲ 20.9% This month</div>
        </div>
        <div className="card">
          <div className="num">1,990</div>
          <div className="label">Completed Orders</div>
          <div className="small-chip">▲ 35.9% This month</div>
        </div>
        <div className="card">
          <div className="num">101</div>
          <div className="label">Cancelled Orders</div>
          <div className="small-chip cancelled">↓ 5.6% This month</div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="controls-row">
        <div className="search">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            style={{ opacity: 0.6 }}
          >
            <path
              d="M21 21l-4.35-4.35"
              stroke="#111827"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="11"
              cy="11"
              r="6"
              stroke="#111827"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            placeholder="Search by name, Item ID..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="filter-row">
          <div className="pill">All Status</div>
          <div className="pill">01 May 2025 - 10 Jun</div>
          <div className="pill">More Filters</div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="table-wrap">
        <table className="table" role="table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id}>
                <td>
                  <div className="row-item">
                    <div className="thumb">
                      {o.name.split(" ")[0].slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="name">{o.name}</div>
                      <div className="muted">{o.date}</div>
                    </div>
                  </div>
                </td>
                <td>#{o.id}</td>
                <td>{o.customer}</td>
                <td className="muted">{o.price}</td>
                <td>
                  <div className={`status ${o.status}`}>
                    {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                  </div>
                </td>
                <td>
                  <button className="action-btn">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}