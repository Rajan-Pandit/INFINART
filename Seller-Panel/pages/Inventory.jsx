import React from 'react';
import Navbar from '../src/components/Navbar/Navbar';
import Sidebar from '../src/components/Sidebar/Sidebar';
import Inventory from '../src/components/Inventory/Inventory'; 

function InventoryFunc() { 
    return (
        <>
            <Navbar />
            <div className="mainpage-container">
                <Sidebar />
                <Inventory /> 
            </div>
        </>
    );
}

export default InventoryFunc;