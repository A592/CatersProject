// src/utils/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:6000', // Backend server URL
  withCredentials: true // Include credentials for session-based authentication
});// Update the base URL to match your server

// src/utils/api.js

export const signUp = async (formData) => {
  try {
    const response = await fetch('/auth/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    console.error('Error in signUp:', error);
    throw error;
  }
};

export const signIn = async (credentials) => {
  try {
    const response = await fetch('/auth/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies if your backend uses sessions
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    return { data, status: response.status };
  } catch (error) {
    console.error('Error in signIn:', error);
    throw error;
  }
};
export const logout = () => api.get('/auth/logout');
