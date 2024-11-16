// src/components/Header.js

import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './css/header.css'; // Include custom CSS

const Header = () => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest('.profile-section')
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuOpen]);

  const toggleProfileMenu = () => {
    setProfileMenuOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark custom-navbar">
        <div className="container-fluid">
          {/* Logo on the Left */}
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src="/imgs/logo.png" alt="Logo" width="50" height="50" className="me-2" />
            <span className="logo-text">Caters</span>
          </Link>

          {/* Navbar Toggler for Mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Centered Navigation Links */}
          <div className="collapse navbar-collapse justify-content-center" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className="nav-item mx-3">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item mx-3">
                <Link className="nav-link" to="/about">
                  About Us
                </Link>
              </li>
              <li className="nav-item mx-3">
                <Link className="nav-link" to="/restaurants">
                  Restaurants
                </Link>
              </li>
              <li className="nav-item mx-3">
                <Link className="nav-link" to="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Profile Section or Sign In Button */}
          {user ? (
            <div className="d-flex align-items-center">
              <div className="dropdown" ref={dropdownRef}>
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="profileDropdown"
                  onClick={toggleProfileMenu}
                  aria-haspopup="true"
                  aria-expanded={profileMenuOpen}
                >
                  <img
                    src="/imgs/profile-user.png"
                    alt="Profile"
                    className="rounded-circle"
                    width="50"
                    height="50"
                  />
                </button>
                <ul
                  className={`dropdown-menu dropdown-menu-custom ${profileMenuOpen ? 'show' : ''}`}
                  aria-labelledby="profileDropdown"
                >
                  <li className="dropdown-item-text">
                    <div className="d-flex align-items-center">
                      <img
                        src="/imgs/profile-user.png"
                        alt="Profile"
                        className="rounded-circle me-2"
                        width="60"
                        height="60"
                      />
                      <div>
                        <strong>{user.name}</strong>
                        <br />
                        <small>{user.email}</small>
                      </div>
                    </div>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      View Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/settings">
                      Account Settings
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/my-orders">
                      My Orders
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/switch-account">
                      Switch Account
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/help">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="d-flex">
              <Link to="/auth/sign-in" className="btn btn-outline-light me-2">
                Sign In
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
