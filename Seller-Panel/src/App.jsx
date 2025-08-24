import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './Store/store';

import Mainpage from '../pages/Mainpage';
import RegisterPage from '../pages/RegisterPage';
import LoginPage from '../pages/LoginPage';
import AddProductPage from '../pages/AddProductPage';
import SellerProfilePage from '../pages/ProfilePage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* ✅ Default route goes to login */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<Mainpage />} /> {/* renamed homepage */}
          <Route path="/addProduct" element={<AddProductPage />} />
          <Route path="/seller/profile" element={<SellerProfilePage />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
