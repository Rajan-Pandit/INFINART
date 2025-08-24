import React from 'react';
import Navbar from '../src/components/Navbar/Navbar';
import Dashboard from '../src/components/Dashboard/Dashboard';
import Sidebar from '../src/components/Sidebar/Sidebar';
import './Mainpage.css'; // Import CSS here

function Mainpage() {
    return (
        <>
            <Navbar />
            <div className="mainpage-container">
                <Sidebar />
                <Dashboard />
            </div>
        </>
    );
}

export default Mainpage;
