// src/components/Payment.js

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './css/payment.css';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expDate: '',
    cvv: '',
  });

  // Fetch booking data from backend
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch('/api/bookings/getBooking', {
          credentials: 'include', // Send cookies
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setBooking(data.booking);
        } else {
          setError(data.message || 'Failed to fetch booking data.');
        }
      } catch (err) {
        console.error('Error fetching booking data:', err);
        setError('An error occurred while fetching booking data.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle payment confirmation
  const handlePayment = async (e) => {
    e.preventDefault();

    if (!booking) {
      Swal.fire({
        title: 'Error',
        text: 'No booking data available.',
        icon: 'error',
      });
      return;
    }

    // Simple validation (you can enhance this)
    if (!formData.cardName || !formData.cardNumber || !formData.expDate || !formData.cvv) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill in all payment details.',
        icon: 'error',
      });
      return;
    }

    try {
      const response = await fetch('/api/bookings/confirmPayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageType: booking.packageType,
          numPeople: booking.numPeople,
          totalPrice: booking.totalPrice,
          restaurantId: booking.restaurantId,
          dateTime: booking.dateTime,
        }),
      });

      const result = await response.json();
      if (result.success) {
        Swal.fire({
          title: 'Payment Confirmed!',
          text: 'Your payment was successful.',
          icon: 'success',
          timer: 5000,
          showConfirmButton: false,
        }).then(() => {
          navigate('/home'); // Redirect to home page
        });
      } else {
        Swal.fire({
          title: 'Payment Failed',
          text: result.message || 'There was an issue with your payment. Please try again.',
          icon: 'error',
        });
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while processing your payment.',
        icon: 'error',
      });
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

  if (!booking) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning text-center">No booking data found.</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Payment Details</h1>
      <div className="row justify-content-center">
        {/* Bill Summary */}
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header">
              <h4 className="mb-0">Bill Summary</h4>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between">
                  <span>Subtotal</span>
                  <span>${(booking.totalPrice - booking.totalPrice * 0.015).toFixed(2)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Tax</span>
                  <span>${(booking.totalPrice * 0.015).toFixed(2)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between font-weight-bold">
                  <span>Total</span>
                  <span>${booking.totalPrice.toFixed(2)}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="col-md-6">
          <form onSubmit={handlePayment}>
            <div className="card">
              <div className="card-header">
                <h4 className="mb-0">Enter Payment Information</h4>
              </div>
              <div className="card-body">
                {/* Name on Card */}
                <div className="form-group">
                  <label htmlFor="cardName">Name on Card</label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    className="form-control"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {/* Card Number */}
                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    className="form-control"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {/* Expiration Date and CVV */}
                <div className="form-group">
                  <div className="row">
                    <div className="col-6">
                      <label htmlFor="expDate">Expiration Date</label>
                      <input
                        type="text"
                        id="expDate"
                        name="expDate"
                        className="form-control"
                        placeholder="MM/YY"
                        value={formData.expDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="cvv">CVV</label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        className="form-control"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                  Pay ${booking.totalPrice.toFixed(2)}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
