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
