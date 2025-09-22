import React, { useState } from "react";
import "./Inventory.css";

const mockData = [
  {id:1, name:"PixelMate", category:"Electronics", sku:"AFZM647", incoming:478, stock:595, status:"instock", price:4347},
  {id:2, name:"FusionLink", category:"Electronics", sku:"AFZM622", incoming:418, stock:761, status:"instock", price:5347},
  {id:3, name:"VelvetAura", category:"Apparel", sku:"AFZM655", incoming:471, stock:765, status:"outstock", price:2347},
  {id:4, name:"UrbanFlex Sneakers", category:"Apparel", sku:"AFZM653", incoming:178, stock:65, status:"lowstock", price:9347},
  {id:5, name:"SilkSage Wrap", category:"Wellness", sku:"AFZM699", incoming:473, stock:165, status:"instock", price:4347},
  {id:6, name:"CasaLuxe", category:"Home & Living", sku:"AFZM633", incoming:168, stock:575, status:"lowstock", price:3347},
];

export default function InventoryPage() {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const total = mockData.length;
  const pages = Math.ceil(total / pageSize);

  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const data = mockData.slice(start, end);

  return (
    <div className="inventory-page">
      <div className="header">
        <h1>Inventory</h1>
        <div className="header-actions">
          <button className="btn outline">Import</button>
          <button className="btn outline">Export</button>
          <button className="btn primary">+ Add Product</button>
        </div>
      </div>

      <div className="summary">
        <h2>$10,356,788</h2>
        <div className="meta">
          <span>2379 Products</span>
          <div className="bar">
            <span className="green" style={{width:"60px"}}></span>
            <span className="yellow" style={{width:"20px"}}></span>
            <span className="red" style={{width:"15px"}}></span>
          </div>
        </div>
      </div>

      <div className="controls">
        <div className="search">
          <input placeholder="Search..." />
        </div>
        <div className="filter">5 Sep - 28 Oct 2025</div>
        <div className="filter">Amount Status</div>
        <div className="filter">Status</div>
        <div className="filter">Filter</div>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Product Name</th>
              <th>Category</th>
              <th>SKU</th>
              <th>Incoming</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td><input type="checkbox" /></td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.sku}</td>
                <td>{item.incoming}</td>
                <td>{item.stock}</td>
                <td>
                  <span className={`status ${item.status}`}>
                    {item.status === "instock" ? "In stock" : item.status === "lowstock" ? "Low stock" : "Out of stock"}
                  </span>
                </td>
                <td>${item.price}</td>
                <td>...</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <div>Result {start+1}-{end} of {total}</div>
          <div className="pages">
            <span className="page-btn" onClick={()=>setPage(Math.max(1,page-1))}>Previous</span>
            {[...Array(pages)].map((_,i)=>(
              <span
                key={i}
                className={`page-btn ${page===i+1?"active":""}`}
                onClick={()=>setPage(i+1)}
              >
                {i+1}
              </span>
            ))}
            <span className="page-btn" onClick={()=>setPage(Math.min(pages,page+1))}>Next</span>
          </div>
        </div>
      </div>
    </div>
  );
}