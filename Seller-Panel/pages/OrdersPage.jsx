import React from 'react';
import Navbar from '../src/components/Navbar/Navbar';
import Sidebar from '../src/components/Sidebar/Sidebar';
import OrderSection from '../src/components/Orders/Orders'; 

function OrdersPage() { 
    return (
        <>
            <Navbar />
            <div className="mainpage-container">
                <Sidebar />
                <OrderSection /> 
            </div>
        </>
    );
}

export default OrdersPage;