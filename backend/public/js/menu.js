document.addEventListener('DOMContentLoaded', function () {
    const vipRadio = document.getElementById('vip');
    const normalRadio = document.getElementById('normal');
    const numPeople = document.getElementById('numPeople');
    const totalPriceDisplay = document.getElementById('totalPrice');
    const bookButton = document.getElementById('bookButton');
    const peopleError = document.getElementById('peopleError');
    const restID = document.getElementById('restaurantId').value;

    // Mocked user and restaurant IDs (replace with actual values)
    const userId = '6487d9a9dbd2d0f258b4e344'; // Replace with logged-in user ID
    const restaurantId = restID; // Replace with selected restaurant ID

    // Price calculation logic
    function updatePrice() {
        const vipPrice = 200;
        const normalPrice = 150;
        let num = parseInt(numPeople.value, 10);
        let total = 0;

        if (vipRadio.checked) {
            total = num * vipPrice;
        } else if (normalRadio.checked) {
            total = num * normalPrice;
        }

        totalPriceDisplay.textContent = `$${total}`;
        validateForm();
    }

    // Form validation logic
    function validateForm() {
        const num = parseInt(numPeople.value, 10);
        const isPackageSelected = vipRadio.checked || normalRadio.checked;

        // Validate the number of people
        if (num <= 0 || isNaN(num)) {
            peopleError.style.display = 'block';
            bookButton.disabled = true;
            return false;
        } else {
            peopleError.style.display = 'none';
        }

        // Enable the button if form is valid
        if (isPackageSelected && num > 0) {
            bookButton.disabled = false;
        } else {
            bookButton.disabled = true;
        }
    }

    async function bookNow() {
        const packageType = document.querySelector('input[name="package"]:checked').value;
        const numPeopleValue = parseInt(document.getElementById('numPeople').value, 10);
        const totalPriceValue = parseFloat(document.getElementById('totalPrice').textContent.replace('$', ''));
        
        const restaurantId = document.getElementById('restaurantId').value;  // Get the restaurant ID
    
        const formData = {
            packageType,
            numPeople: numPeopleValue,
            totalPrice: totalPriceValue,
            restaurantId  // Include the restaurant ID
        };
    
        try {
            const response = await fetch('/api/bookings/submitBooking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
    
            const data = await response.json();
    
            // Debugging: Log the response
            console.log('Response from backend:', data);
    
            if (data.success) {
                Swal.fire({
                    title: 'Booking Confirmed!',
                    text: null,
                    icon: 'success',
                    timer: 5000,  // Auto-close after 2 seconds
                    showConfirmButton: false
                }).then(() => {
                    // Redirect to homepage after the alert closes
                    window.location.href = data.redirectUrl;
                });
            } else {
                Swal.fire({
                    title: 'Booking Failed',
                    text: data.message,
                    icon: 'error',
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to book. Please try again.',
                icon: 'error',
            });
        }
    }

    // Event listeners
    vipRadio.addEventListener('click', updatePrice);
    normalRadio.addEventListener('click', updatePrice);
    numPeople.addEventListener('input', updatePrice);

    bookButton.addEventListener('click', bookNow);

    // Initial form validation to disable/enable the button
    validateForm();
});
