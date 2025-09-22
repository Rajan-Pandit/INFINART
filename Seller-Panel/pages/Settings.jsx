import React from 'react';
import Navbar from '../src/components/Navbar/Navbar';
import Sidebar from '../src/components/Sidebar/Sidebar';
import Settings from '../src/components/Settings/SettingsPage'; 

function SettingsFunc() { 
    return (
        <>
            <Navbar />
            <div className="mainpage-container">
                <Sidebar />
                <Settings /> 
            </div>
        </>
    );
}

export default SettingsFunc;