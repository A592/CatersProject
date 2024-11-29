// src/components/MyOrders.jsx

import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './css/myOrder.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from '../assets/logopdf.png'; // Ensure your logo is placed correctly

const MyOrders = () => {
  const { logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellationError, setCancellationError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/bookings/myOrders', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok && data.success && user) {
          setOrders(data.orders);
        } else if (!user) {
          setError('Unauthorized. Please log in again.');
        } else {
          setError(data.message || 'Failed to fetch orders.');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('An error occurred while fetching orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [logout, navigate,user]);

  const getBase64 = (imgUrl) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        const reader = new FileReader();
        reader.onloadend = function () {
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = reject;
      xhr.open('GET', imgUrl);
      xhr.responseType = 'blob';
      xhr.send();
    });
  };

  const handleGenerateInvoice = async (order) => {
    if (!order.user || !order.user.name || !order.user.email) {
      alert('User information is incomplete for this order.');
      return;
    }

    const doc = new jsPDF();

    try {
      const logoDataUrl = await getBase64(logo);

      // Add Logo (adjusted for a professional look)
      doc.addImage(logoDataUrl, 'PNG', 14, 10, 50, 20); // Adjusted height for better proportion

      // Invoice Title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('INVOICE', 105, 35, null, null, 'center');

      // Invoice Metadata
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const invoiceY = 45;
      doc.text(`Invoice Number: ${order._id}`, 14, invoiceY);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, invoiceY + 6);

      // Customer Information
      doc.text(`Billed To:`, 14, invoiceY + 18);
      doc.text(`${order.user.name}`, 40, invoiceY + 18);
      doc.text(`Email:`, 14, invoiceY + 24);
      doc.text(`${order.user.email}`, 40, invoiceY + 24);

      // Draw a Separator Line
      doc.line(14, invoiceY + 30, 196, invoiceY + 30);

      // Order Details Table (Original Format)
      const tableY = invoiceY + 36;
      const tableColumn = ['Item', 'Details'];
      const tableRows = [];

      tableRows.push(['Package Type', order.packageType]);
      tableRows.push(['Restaurant', order.restaurant.name]);
      tableRows.push(['Number of People', order.numPeople.toString()]);
      tableRows.push(['Event Date & Time', new Date(order.dateTime).toLocaleString()]);
      tableRows.push(['Order Date', new Date(order.createdAt).toLocaleString()]);
      tableRows.push(['Status', order.status]);

      // Add borders to the table
      doc.autoTable({
        startY: tableY,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid', // Use 'grid' theme to add borders
        styles: { fontSize: 12 },
        headStyles: { fillColor: [22, 160, 133] },
        tableLineColor: [0, 0, 0], // Black border
        tableLineWidth: 0.1,
      });
      const taxRate = 0.15;
      const equipmentCost = order.equipmentCost; // Equipment cost is given
       // Tax rate is 15%
      // Calculate the package price (excluding tax)
const packageTotal = ((order.totalPrice - equipmentCost) - (order.totalPrice - equipmentCost)*taxRate).toFixed(2);

// Calculate the tax amount
const tax = (order.totalPrice * taxRate);

// Format the total price for display
const grandTotal = order.totalPrice.toFixed(2);
    // Cost Breakdown Table
    const breakdownY = doc.lastAutoTable.finalY + 10;
    const breakdownColumn = ['Description', 'Amount (USD)'];
    const breakdownRows = [
      ['Package Total', `$${packageTotal}`],
      ['Equipment Cost', `$${equipmentCost - (order.equipmentCost * taxRate)}`],
      ['Tax (15%)', `$${tax}`],
      ['Grand Total', `$${grandTotal}`],
    ];

    doc.autoTable({
      startY: breakdownY,
      head: [breakdownColumn],
      body: breakdownRows,
      theme: 'grid',
      styles: { fontSize: 12 },
      headStyles: { fillColor: [41, 128, 185] },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.1,
    });
      // Footer with Company Information
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Thank you for your business!', 105, pageHeight - 30, null, null, 'center');
      doc.text('Caters', 105, pageHeight - 25, null, null, 'center');
      doc.text(' Riyadh, Saudi Arabia', 105, pageHeight - 20, null, null, 'center');
      doc.text('Phone: (011) 456-7890 | Email: Catersksa@gmail.com', 105, pageHeight - 15, null, null, 'center');

      // Save the PDF
      doc.save(`Invoice_${order._id}.pdf`);
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Failed to generate invoice.');
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await fetch(`/api/bookings/cancel/${orderId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update the order status to 'Canceled'
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: 'Canceled' } : order
          )
        );
      } else {
        setCancellationError(data.message || 'Failed to cancel order.');
      }
    } catch (err) {
      console.error('Error canceling order:', err);
      setCancellationError('An error occurred while canceling the order.');
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
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

  const isCancelable = (orderDateTime) => {
    const eventTime = new Date(orderDateTime);
    const now = new Date();
    const timeDifference = eventTime.getTime() - now.getTime();
    return timeDifference >= 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  };

  const activeOrders = orders.filter(
    (order) =>
      order.status === 'Pending' ||
      order.status === 'Out of Delivery' ||
      order.status === 'In Progress'
  );
  const completedOrders = orders.filter((order) => order.status === 'Completed');

  return (
    <div className="container my-orders-container mt-5">
      <h1 className="text-center mb-4">My Orders</h1>

      {cancellationError && <div className="alert alert-danger">{cancellationError}</div>}

      {/* Active Orders Section */}
      <h2 className="mb-3">Active Orders</h2>
      {activeOrders.length === 0 ? (
        <div className="alert alert-info text-center">
          You have no active orders.
        </div>
      ) : (
        <div className="table-responsive mb-5">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Package</th>
                <th>Restaurant</th>
                <th>Number of People</th>
                <th>Equipment Cost</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Ordered On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order.packageType}</td>
                  <td>{order.restaurant.name}</td>
                  <td>{order.numPeople}</td>
                  <td>{order.equipmentCost}</td>
                  <td>${order.totalPrice.toFixed(2)}</td>
                  <td>
                    <span
                      className={`badge ${
                        order.status === 'Pending'
                          ? 'bg-warning text-dark'
                          : order.status === 'In Progress'
                          ? 'bg-primary'
                          : 'bg-info text-dark'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    {isCancelable(order.dateTime) && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancelOrder(order._id)}
                      >
                        Cancel Order
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Completed Orders Section */}
      <h2 className="mb-3">Completed Orders</h2>
      {completedOrders.length === 0 ? (
        <div className="alert alert-info text-center">
          You have no completed orders.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Package</th>
                <th>Restaurant</th>
                <th>Number of People</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Ordered On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {completedOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order.packageType}</td>
                  <td>{order.restaurant.name}</td>
                  <td>{order.numPeople}</td>
                  <td>${order.totalPrice.toFixed(2)}</td>
                  <td>
                    <span className="badge bg-success">{order.status}</span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleGenerateInvoice(order)}
                    >
                      Generate Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
