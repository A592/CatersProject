// src/components/SignIn.js

import './css/sign.css'; 
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation after login
import { signIn } from '../utils/api'; // Import the signIn function
import { AuthContext } from '../context/AuthContext';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const credentials = { email, password };
      const { data, status } = await signIn(credentials);
      console.log(data.user);
      if (status === 200) {
        login(data.user);
        if (data.user.role === 'user') {
          navigate('/');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Sign In to Your Account</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSignIn}>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                  Sign In
                </button>
              </form>
              <p className="mt-3 text-center">
                Don't have an account? <a href="/auth/sign-up">Sign Up</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;  
