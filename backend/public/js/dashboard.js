// public/js/dashboard.js

async function toggleAvailability(restaurantId) {
    try {
        const response = await fetch(`/dashboard/toggle-availability/${restaurantId}`, { method: 'POST' });
        const result = await response.json();
        if (result.success) {
            document.getElementById(`availability-status-${restaurantId}`).textContent = result.newStatus ? 'Available' : 'Unavailable';
        } else {
            alert('Failed to update availability');
        }
    } catch (error) {
        console.error('Error toggling availability:', error);
    }
}
async function updateOrderStatus(orderId) {
    const status = document.getElementById(`status-${orderId}`).value;
    
    try {
        const response = await fetch(`/api/bookings/updateStatus/${orderId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        
        const result = await response.json();
        if (result.success) {
            alert('Order status updated successfully');
        } else {
            alert('Failed to update order status');
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        alert('An error occurred while updating the order status');
    }
}
