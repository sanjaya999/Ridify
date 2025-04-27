import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import '../../assets/styles/Layout.css';
import { useState, useCallback } from 'react';
import { fetchWalletBalance } from '../../api/wallet';

const Layout = () => {
  const [walletBalance, setWalletBalance] = useState(null);

  // Memoized function to refresh wallet balance
  const refreshWalletBalance = useCallback(async () => {
    try {
      const balance = await fetchWalletBalance();
      setWalletBalance(balance);
    } catch (e) {
      setWalletBalance('--');
    }
  }, []);

  return (
    <div className="layout">
      <Navbar walletBalance={walletBalance} refreshWalletBalance={refreshWalletBalance} />
      <main className="main-content">
        <Outlet context={{ refreshWalletBalance }} />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
