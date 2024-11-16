// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';

import Home from './components/home';
import Dashboard from './components/dashboard';
import Restaurants from './components/restaurants';
import Menu from './components/menu';
import MyOrders from './components/myOrders';
import Payment from './components/payment';
import SignIn from './components/sign-in';
import SignUp from './components/sign-up';
import Header from './components/header';
import Footer from './components/footer';

// Wrapper to conditionally render Header based on path
const Layout = ({ children }) => {
  const location = useLocation();
  
  // Exclude Header on the Dashboard page
  const showHeader = location.pathname !== '/dashboard';

  return (
    <>
      {showHeader && <Header />}
      {children}
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/restaurants/:restaurantId/menu" element={<Menu />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/auth/sign-in" element={<SignIn />} />
            <Route path="/auth/sign-up" element={<SignUp />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
