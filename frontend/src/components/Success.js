import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/payment.css'; // Add custom styles for success page

const Success = () => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const apiCalled = useRef(false); // Use ref to track if API was already called

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (apiCalled.current) return; // Prevent multiple calls
      apiCalled.current = true; // Mark as called

      try {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');

        const response = await fetch('/api/bookings/confirmPayment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
          credentials: 'include',
        });

        const data = await response.json();
        if (data.success) {
          setBookingDetails(data.bookingDetails);
        } else {
          console.error('Payment confirmation failed:', data.message);
          navigate('/failure');
        }
      } catch (error) {
        console.error('Error fetching booking details:', error);
        navigate('/failure');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [navigate]);

  

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!bookingDetails) {
    return null;
  }

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header bg-success text-white text-center">
          <h2>Booking Confirmed!</h2>
        </div>
        <div className="card-body">
          <h4 className="text-center">Thank you for your booking!</h4>
          <p className="text-center">Here are your booking details:</p>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>Package Type</th>
                <td>{bookingDetails.packageType}</td>
              </tr>
              <tr>
                <th>Number of People</th>
                <td>{bookingDetails.numPeople}</td>
              </tr>
              <tr>
                <th>Equipment Cost</th>
                <td>SAR {bookingDetails.equipmentCost.toFixed(2)}</td>
              </tr>
              <tr>
                <th>Total Price</th>
                <td>SAR {bookingDetails.totalPrice.toFixed(2)}</td>
              </tr>
              <tr>
                <th>Event Date</th>
                <td>{new Date(bookingDetails.dateTime).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
          <div className="text-center mt-3">
            <button
              className="btn btn-primary"
              onClick={() => navigate('/my-orders')}
            >
              View My Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
