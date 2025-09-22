import React from 'react';
import Navbar from '../src/components/Navbar/Navbar';
import Sidebar from '../src/components/Sidebar/Sidebar';
import Statistics from '../src/components/Statistics/Statistics';

function StatsPage() { 
    return (
        <>
            <Navbar />
            <div className="mainpage-container">
                <Sidebar />
                <Statistics /> 
            </div>
        </>
    );
}

export default StatsPage;