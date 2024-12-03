// src/components/Dashboard.js

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/dashboard.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from '../context/AuthContext';
import { FaSignOutAlt } from 'react-icons/fa';
import { Navbar, Container, Button, Badge, Form } from 'react-bootstrap';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useContext(AuthContext);
  
  const navigate = useNavigate();

  // Fetch dashboard data when the component mounts
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const data = await response.json();
        if (data.success) {
          setUser(data.user);
          setRestaurants(data.restaurants);
          setOrders(data.orders);
        } else {
          setError(data.message || 'Failed to fetch dashboard data');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Function to toggle restaurant availability
  const toggleAvailability = async (id) => {
    try {
      const response = await fetch(`/dashboard/toggle-availability/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setRestaurants((prevRestaurants) =>
          prevRestaurants.map((restaurant) =>
            restaurant._id === id
              ? { ...restaurant, availability: data.newStatus }
              : restaurant
          )
        );
      } else {
        alert('Failed to update availability');
      }
    } catch (err) {
      console.error('Error toggling availability:', err);
    }
  };

  // Function to update order status
  const updateOrderStatus = async (id, status) => {
    try {
      const response = await fetch(`/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === id ? { ...order, status } : order
          )
        );
      } else {
        alert('Failed to update order status');
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger text-center mt-5">{error}</div>;

  // Separate orders based on their status
  const activeOrders = orders.filter(
    (order) => order.status !== 'Completed' && order.status !== 'Canceled'
  );
  const completedOrders = orders.filter((order) => order.status === 'Completed');
  const canceledOrders = orders.filter((order) => order.status === 'Canceled');

  return (
    <div>
      {/* Top Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
        <Container fluid>
          <Navbar.Brand href="#">
            <img
              src="/imgs/logo.png"
              alt="Logo"
              width="40"
              height="40"
              className="d-inline-block align-top me-2"
            />
            Caters Dashboard
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Form className="d-flex me-auto">
              <Form.Control
                type="search"
                placeholder="Search..."
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
            <div className="d-flex align-items-center">
              <span className="me-2">{user.name}</span>
              <img src="/images/profile.png" alt="User Profile" className="rounded-circle me-3" width="40" height="40" />
              <Button variant="danger" onClick={handleLogout}>
                <FaSignOutAlt className="me-2" /> Logout
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container fluid className="mt-4">
        {/* Welcome Section */}
        <div className="mb-4">
          <h1>Welcome to your Dashboard, {user.name}</h1>
        </div>

        {/* Cards Section */}
        <div className="row mb-4">
          <div className="col-lg-6 col-md-12 mb-3">
            <div className="card text-white bg-primary h-100">
              <div className="card-body d-flex flex-column justify-content-center">
                <h5 className="card-title">Total Orders</h5>
                <p className="card-text display-4">{orders.length}</p>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-12 mb-3">
            <div className="card text-white bg-success h-100">
              <div className="card-body d-flex flex-column justify-content-center">
                <h5 className="card-title">Your Restaurants</h5>
                <p className="card-text display-4">{restaurants.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurants Section */}
        <section id="restaurants" className="mb-5">
          <h2>Your Restaurants</h2>
          {restaurants.length === 0 ? (
            <p>You have no restaurants.</p>
          ) : (
            <div className="table-responsive mt-3">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Cuisine</th>
                    <th>Availability</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {restaurants.map((restaurant, index) => (
                    <tr key={restaurant._id}>
                      <th scope="row">{index + 1}</th>
                      <td>{restaurant.name}</td>
                      <td>{restaurant.cuisine}</td>
                      <td>
                        <Badge bg={restaurant.availability ? 'success' : 'danger'}>
                          {restaurant.availability ? 'Available' : 'Unavailable'}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          variant={restaurant.availability ? 'warning' : 'success'}
                          size="sm"
                          onClick={() => toggleAvailability(restaurant._id)}
                        >
                          {restaurant.availability ? 'Set Unavailable' : 'Set Available'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Active Orders Section */}
        <section id="active-orders" className="mb-5">
          <h2>Active Orders</h2>
          {activeOrders.length === 0 ? (
            <p>No active orders.</p>
          ) : (
            <div className="table-responsive mt-3">
              <table className="table table-bordered table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Restaurant</th>
                    <th>Package</th>
                    <th>Number of People</th>
                    <th>Total Price</th>
                    <th>Ordered By</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {activeOrders.map((order, index) => (
                    <tr key={order._id}>
                      <th scope="row">{index + 1}</th>
                      <td>{order.restaurant.name}</td>
                      <td>{order.packageType}</td>
                      <td>{order.numPeople}</td>
                      <td>${order.totalPrice}</td>
                      <td>{order.user.name}</td>
                     
                      <td>
                        <Form.Select
                          size="sm"
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </Form.Select>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Completed Orders Section */}
        <section id="completed-orders" className="mb-5">
          <h2>Completed Orders</h2>
          {completedOrders.length === 0 ? (
            <p>No completed orders.</p>
          ) : (
            <div className="table-responsive mt-3">
              <table className="table table-bordered table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Restaurant</th>
                    <th>Package</th>
                    <th>Number of People</th>
                    <th>Total Price</th>
                    <th>Ordered By</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {completedOrders.map((order, index) => (
                    <tr key={order._id}>
                      <th scope="row">{index + 1}</th>
                      <td>{order.restaurant.name}</td>
                      <td>{order.packageType}</td>
                      <td>{order.numPeople}</td>
                      <td>{order.totalPrice} SAR</td>
                      <td>{order.user.name}</td>
                      <td>
                        <span className="badge bg-success">Completed</span>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Canceled Orders Section */}
        <section id="canceled-orders" className="mb-5">
          <h2>Canceled Orders</h2>
          {canceledOrders.length === 0 ? (
            <p>No canceled orders.</p>
          ) : (
            <div className="table-responsive mt-3">
              <table className="table table-bordered table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Restaurant</th>
                    <th>Package</th>
                    <th>Number of People</th>
                    <th>Total Price</th>
                    <th>Ordered By</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {canceledOrders.map((order, index) => (
                    <tr key={order._id}>
                      <th scope="row">{index + 1}</th>
                      <td>{order.restaurant.name}</td>
                      <td>{order.packageType}</td>
                      <td>{order.numPeople}</td>
                      <td>${order.totalPrice}</td>
                      <td>{order.user.name}</td>
                      <td>
                        <span className="badge bg-danger">Canceled</span>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </Container>
    </div>
  );
};

export default Dashboard;
