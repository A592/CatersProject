// src/components/Menu.js

import './css/menu.css';
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Flatpickr from 'react-flatpickr';
import Swal from 'sweetalert2';
import 'flatpickr/dist/flatpickr.min.css';
import { AuthContext } from '../context/AuthContext';
const riyadhDistricts = [
  'Al Olaya',
  'Al Malaz',
  'Al Nakheel',
  'Al Murabba',
  'Al Hamra',
  'Diplomatic Quarter',
  'Al Sahafa',
  'Al Rabwa',
  'Al Mursalat',
  'Al Diriyah',
];
const Menu = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [includeEquipment, setIncludeEquipment] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [district, setDistrict] = useState('');
  const [streetName, setStreetName] = useState('');
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [numPeople, setNumPeople] = useState(5);
  const [dateTime, setDateTime] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);


  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch(`/restaurants/${restaurantId}/menu`, {
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
          setRestaurant(data.restaurant);
          setPackages(data.packages);
        } else {
          setError(data.message || 'Failed to fetch menu data.');
        }
      } catch (err) {
        console.error('Error fetching menu data:', err);
        setError('An error occurred while fetching menu data.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, [restaurantId]);


  useEffect(() => {
    const equipmentCost = includeEquipment ? numPeople * 30 : 0;
    if (selectedPackage && numPeople > 0) {
      setTotalPrice(selectedPackage.price * numPeople + equipmentCost);
    } else {
      setTotalPrice(equipmentCost);
    }
  }, [selectedPackage, numPeople, includeEquipment]);


  const handlePackageChange = (pkg) => setSelectedPackage(pkg);


  const handleConfirmBooking = async () => {
    if (!selectedPackage) {
      setError('Please select a package.');
      return;
    }
    if (!user) {
      Swal.fire({
        title: 'Error',
        text: 'You need to login',
        icon: 'error',
      });
      navigate('/auth/sign-in');
      return;
    }
    if (numPeople < 5) {
      setError('Number of people must be at least 5.');
      return;
    }

    if (!dateTime) {
      setError('Please select a date and time.');
      return;
    }

    try {
      
      const bookingResponse = await fetch('/api/bookings/storeBooking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          packageType: selectedPackage.name,
          numPeople,
          totalPrice,
          restaurantId: restaurant._id,
          dateTime,
          includeEquipment,
          district,
          streetName,
        }),
      });

      const bookingData = await bookingResponse.json();

      if (!bookingData.success) {
        setError(bookingData.message || 'Failed to store booking.');
        return;
      }


      const checkoutResponse = await fetch('/api/bookings/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const checkoutData = await checkoutResponse.json();

      if (checkoutData.url) {
        window.location.href = checkoutData.url; // Redirect to Stripe
      } else {
        setError('Failed to initiate payment.');
      }
    } catch (error) {
      console.error('Error during booking or payment:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">{error}</div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning text-center">Restaurant not found.</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {/* Restaurant Information */}
      <h1 className="text-center mb-4">Menu for {restaurant.name}</h1>
      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            {restaurant.image && (
              <div className="col-md-4 text-center">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="img-fluid rounded-circle mb-3 restaurant-image"
                />
              </div>
            )}
            <div className={restaurant.image ? 'col-md-8' : 'col-md-12'}>
              <h4>{restaurant.name}</h4>
              <p>
                <strong>Cuisine:</strong> {restaurant.cuisine}
              </p>
              <p>
                <strong>Address:</strong> {restaurant.address}
              </p>
              <p>
                <strong>Contact:</strong> {restaurant.contact}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Packages */}
      <div className="row justify-content-center">
        {packages.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-warning text-center">
              No packages available for this restaurant.
            </div>
          </div>
        ) : (
          packages.map((pkg) => (
            <div className="col-md-6 col-lg-4 mb-4 d-flex align-items-stretch" key={pkg._id}>
              <div
                className={`card h-100 package-card ${selectedPackage && selectedPackage._id === pkg._id ? 'border-primary' : ''
                  }`}
              >
                <img src={pkg.image} alt={pkg.name} className="card-img-top package-image" />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{pkg.name}</h5>
                  <p className="card-text text-black">{pkg.description}</p>
                  <p>
                    <strong>Price:</strong> SAR{pkg.price}
                  </p>
                  <div className="mt-auto">
                    <button
                      className={`btn btn-outline-primary btn-block ${selectedPackage && selectedPackage._id === pkg._id ? 'active' : ''
                        }`}
                      onClick={() => handlePackageChange(pkg)}
                    >
                      {selectedPackage && selectedPackage._id === pkg._id ? 'Selected' : 'Select Package'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Booking Section */}
      {selectedPackage && (
        <div className="row justify-content-center mt-5">
          <div className="col-md-8 col-lg-6">
            <div className="card">
              <div className="card-header">
                <h4 className="mb-0">Booking Details</h4>
              </div>
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger text-center">{error}</div>
                )}
                <div className="form-group">
                  <label htmlFor="numPeople">Number of People:</label>
                  <div className="input-group number-input-group">
                    <div className="input-group-prepend">
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setNumPeople(Math.max(5, numPeople - 1))}
                      >
                        -
                      </button>
                    </div>
                    <input
                      type="number"
                      id="numPeople"
                      className="form-control text-center"
                      value={numPeople}
                      min="5"
                      required
                      onChange={(e) => setNumPeople(Number(e.target.value))}
                    />
                    <div className="input-group-append">
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setNumPeople(numPeople + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={includeEquipment}
                      onChange={() => setIncludeEquipment(!includeEquipment)}
                    />
                    {' '}
                    Include Equipment (Chairs, Tables): 30 SAR per person
                  </label>
                </div>
                <div className="form-group">
                  <label htmlFor="dateTime">Date and Time:</label>
                  <Flatpickr
                    id="dateTime"
                    className="form-control"
                    options={{
                      enableTime: true,
                      dateFormat: 'Y-m-d H:i',
                    }}
                    value={dateTime}
                    onChange={(selectedDates, dateStr) => setDateTime(dateStr)}
                  />
                </div>

                {/* Riyadh District and Street Name */}
                <div className="form-group">
                  <label>Riyadh District</label>
                  <select
                    className="form-control"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  >
                    <option value="">Select District</option>
                    {riyadhDistricts.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Street Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter street name"
                    value={streetName}
                    onChange={(e) => setStreetName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <p className="h5">
                    <strong>Total Price:</strong> SAR{totalPrice}
                  </p>
                </div>

                <button
                  onClick={handleConfirmBooking}
                  className="btn btn-primary btn-block"
                  disabled={!selectedPackage || !dateTime || !district || !streetName}
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
