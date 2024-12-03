

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/payment.css'; 

const Failure = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header bg-danger text-white text-center">
          <h2>Payment Failed</h2>
        </div>
        <div className="card-body text-center">
          <p className="text-center text-danger">
            Something went wrong with your payment. Please try again or contact support if the issue persists.
          </p>
          <div className="mt-3">
            <button
              className="btn btn-primary"
              onClick={() => navigate('/')}
            >
              Back to Home
            </button>
            <button
              className="btn btn-secondary ms-2"
              onClick={() => navigate('/menu')}
            >
              Retry Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Failure;
