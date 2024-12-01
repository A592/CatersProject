// src/components/Home.js

import React from 'react';
import './css/styles.css';
import { FaArrowRight } from 'react-icons/fa';

const Home = () => {
  return (
    <div>
      {/* Catering Banner Section */}
      <div className="catering-banner position-relative text-center text-white">
        <img src="/imgs/homepage.jpg" alt="Catering Service Banner" className="img-fluid w-100 banner-image" loading="lazy" />
        <div className="banner-text position-absolute top-50 start-50 translate-middle">
          <p className="lead welcome-text">Welcome to Caters!</p>
          <h1 className="display-4">Your Ultimate Partner for All Event Catering Needs.</h1>
          <a href="/restaurants" className="btn btn-primary btn-lg mt-3" aria-label="Order Now">
            Order Now <FaArrowRight className="ms-2" />
          </a>
        </div>
      </div>

      {/* Special Offers Section */}
      <div className="container my-5">
        <h2 className="text-center mb-5 special-offers-heading">Special Offers</h2>
        <div className="row g-5">
          
          {/* Offer 1 - Discount on Group Bookings */}
          <div className="col-md-4">
            <div className="card offer-card">
              <div className="position-relative">
                <img src="/imgs/homepage.jpg" alt="Discount on Group Bookings" className="card-img-top offer-image" loading="lazy" />
                <div className="offer-overlay d-flex flex-column justify-content-end p-4">
                  <h5 className="offer-title">Discount 50% Wenseday!</h5>
                  <p className="offer-description">Book for more than 10 people and get a 15% discount.</p>
                  <button className="btn btn-order" aria-label="Book Now">
                    Book Now <FaArrowRight className="ms-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Offer 2 - Early Bird Special */}
          <div className="col-md-4">
            <div className="card offer-card">
              <div className="position-relative">
                <img src="/imgs/homepage.jpg" alt="Early Bird Special" className="card-img-top offer-image" loading="lazy" />
                <div className="offer-overlay d-flex flex-column justify-content-end p-4">
                  <h5 className="offer-title">Early Bird Special</h5>
                  <p className="offer-description">Make a reservation before 12 PM and save 10%.</p>
                  <button className="btn btn-order" aria-label="Book Now">
                    Book Now <FaArrowRight className="ms-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Offer 3 - Weekend Gala */}
          <div className="col-md-4">
            <div className="card offer-card">
              <div className="position-relative">
                <img src="/imgs/homepage.jpg" alt="Weekend Gala" className="card-img-top offer-image" loading="lazy" />
                <div className="offer-overlay d-flex flex-column justify-content-end p-4">
                  <h5 className="offer-title">Weekend Gala</h5>
                  <p className="offer-description">Enjoy our exclusive weekend buffet at a reduced price.</p>
                  <button className="btn btn-order" aria-label="Book Now">
                    Book Now <FaArrowRight className="ms-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
