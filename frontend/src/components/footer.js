import React from 'react';
import './css/footer.css'; 
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa'; 

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4">
      <div className="container text-md-left">
        <div className="row text-md-left">
          
          {/* About Caters Section */}
          <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="mb-4 font-weight-bold">About Caters</h5>
            <p>Your trusted catering service connecting restaurants and hotels across the country.</p>
          </div>
          
          {/* Quick Links Section */}
          <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
            <h5 className="mb-4 font-weight-bold">Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/about" className="text-white text-decoration-none">About Us</a>
              </li>
              <li>
                <a href="/contact" className="text-white text-decoration-none">Contact Us</a>
              </li>
              <li>
                <a href="/terms" className="text-white text-decoration-none">Terms of Service</a>
              </li>
            </ul>
          </div>
          
          {/* Social Media Section */}
          <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="mb-4 font-weight-bold">Follow Us</h5>
            <div className="d-flex">
              <a href="https://www.facebook.com" className="me-3 text-white social-icon" aria-label="Facebook">
                <FaFacebookF size={24} />
              </a>
              <a href="https://www.twitter.com" className="me-3 text-white social-icon" aria-label="Twitter">
                <FaTwitter size={24} />
              </a>
              <a href="https://www.instagram.com" className="me-3 text-white social-icon" aria-label="Instagram">
                <FaInstagram size={24} />
              </a>
            </div>
          </div>
          
        </div>
        
        <hr className="mb-4" style={{ borderColor: '#ffffff' }} />
        
        <div className="row align-items-center">
          <div className="col-md-7 col-lg-8">
            <p className="text-center text-md-start">
              © 2024 Caters Catering Services. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
