// templates/emailTemplates.js

exports.paymentConfirmationEmail = (order,user,restaurant) => {
 
  return `
    <h1>Payment Confirmation</h1>
    <p>Dear ${user.name},</p>
    <p>Thank you for your payment. Your order has been confirmed.</p>
    <h3>Order Details:</h3>
    <ul>
      <li><strong>Order ID:</strong> ${order._id}</li>
      <li><strong>Package:</strong> ${order.packageType}</li>
      <li><strong>Restaurant:</strong> ${restaurant.name}</li>
      <li><strong>Number of People:</strong> ${order.numPeople}</li>
      <li><strong>Total Price:</strong> $${order.totalPrice.toFixed(2)}</li>
      <li><strong>Event Date & Time:</strong> ${new Date(order.dateTime).toLocaleString()}</li>
    </ul>
    <p>If you have any questions, please contact us at catersksa@gmail.com.</p>
    <p>Best regards,<br/>Caters</p>
  `;
};
