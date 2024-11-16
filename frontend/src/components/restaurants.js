// src/components/Restaurants.js

import './css/restaurant.css'; 
import React, { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa'; // Importing Font Awesome Shopping Cart Icon

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [cuisineFilter, setCuisineFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch restaurants from the backend
  useEffect(() => {
    setLoading(true);
    fetch(`/restaurants${cuisineFilter ? `?cuisine=${cuisineFilter}` : ''}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setRestaurants(data.restaurants);
        setError(null);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching restaurants:', error);
        setError('Failed to load restaurants. Please try again later.');
        setLoading(false);
      });
  }, [cuisineFilter]); // Refetch when cuisineFilter changes

  const handleFilterChange = (e) => {
    setCuisineFilter(e.target.value);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Our Restaurants</h2>

      {/* Filter Section */}
      <div className="mb-4 d-flex justify-content-center">
        <form id="filterForm" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group d-flex align-items-center">
            <label htmlFor="cuisineSelect" className="me-2 mb-0">Filter by Cuisine:</label>
            <select
              id="cuisineSelect"
              name="cuisine"
              className="form-select filter-select"
              value={cuisineFilter}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="Italian">Italian</option>
              <option value="Indian">Indian</option>
              <option value="Lebanese">Lebanese</option>
              <option value="Japanese">Japanese</option>
              <option value="American">American</option>
            </select>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {/* Loading Indicator */}
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        /* Restaurant List Section */
        <>
          {restaurants.length === 0 ? (
            <p className="text-center">No restaurants available at the moment.</p>
          ) : (
            <div className="row">
              {restaurants.map((restaurant) => (
                <div className="col-sm-12 col-md-6 col-lg-4 mb-4" key={restaurant._id}>
                  <div className="card h-100 shadow-sm restaurant-card">
                    <div className="card-img-top d-flex justify-content-center align-items-center bg-light">
                      <img
                        src={restaurant.picture}
                        alt={restaurant.name}
                        className="restaurant-image"
                        loading="lazy"
                      />
                    </div>
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title text-center">{restaurant.name}</h5>
                      <p className="card-text description-text">
                        <strong>Cuisine:</strong> {restaurant.cuisine}
                      </p>
                      <p className="card-text description-text">
                        <strong>Address:</strong> {restaurant.address}
                      </p>
                      <p className="card-text description-text">
                        <strong>Contact:</strong> {restaurant.contact}
                      </p>
                      <a
                        href={`/restaurants/${restaurant._id}/menu`}
                        className="btn btn-order mt-auto"
                      >
                        <FaShoppingCart className="me-2" /> Order Now
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Restaurants;
