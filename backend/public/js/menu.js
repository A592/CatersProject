document.addEventListener('DOMContentLoaded', function () {
    const packageRadios = document.querySelectorAll('input[name="package"]');
    const numPeopleInput = document.getElementById('numPeople');
    const totalPriceDisplay = document.getElementById('totalPrice');
    const bookButton = document.getElementById('bookButton');
    let selectedPackagePrice = 0;

    // Function to update the total price based on selected package and number of people
    function updateTotalPrice() {
        const numPeople = parseInt(numPeopleInput.value, 10);
        if (selectedPackagePrice > 0 && numPeople > 0) {
            const total = selectedPackagePrice * numPeople;
            totalPriceDisplay.textContent = `$${total}`;
            bookButton.disabled = false;
        } else {
            totalPriceDisplay.textContent = "$0";
            bookButton.disabled = true;
        }
    }

    // Event listener for package selection
    packageRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            selectedPackagePrice = parseFloat(this.getAttribute('data-price'));
            updateTotalPrice();
        });
    });

    // Event listener for number of people input
    numPeopleInput.addEventListener('change', function () {
        updateTotalPrice();
    });
    async function bookNow() {
        const selectedPackageElement = document.querySelector('input[name="package"]:checked');  // Get selected package
        if (!selectedPackageElement) {
            Swal.fire({
                title: 'Select a Package',
                text: 'Please choose a package before proceeding.',
                icon: 'warning',
            });
            return;  // Stop the function if no package is selected
        }
    
        const selectedPackage = selectedPackageElement.value;  // Get package value from the selected radio button
        const numPeople = parseInt(document.getElementById('numPeople').value, 10);  // Number of people input
        const totalPrice = parseFloat(document.getElementById('totalPrice').textContent.replace('$', ''));  // Total price calculation
    
        const restaurantId = document.getElementById('restaurantId').value;  // Restaurant ID
        
        const bookingData = {
            packageType: selectedPackage,  // Package type
            numPeople: numPeople,  // Number of people
            totalPrice: totalPrice,  // Total price
            restaurantId: restaurantId  // Restaurant ID
        };
        
        try {
            const response = await fetch('/api/bookings/submitBooking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookingData)  // Send booking data to backend
            });
    
            const result = await response.json();
    
            // Debugging: Log the response from the server
            console.log('Response from backend:', result);
    
            if (result.success) {
                Swal.fire({
                    title: 'Booking Confirmed!',
                    text: 'Your booking has been successfully confirmed.',
                    icon: 'success',
                    timer: 5000,  // Auto-close after 5 seconds
                    showConfirmButton: false
                }).then(() => {
                    // Redirect to the homepage after confirmation
                    window.location.href = result.redirectUrl;
                });
            } else {
                Swal.fire({
                    title: 'Booking Failed',
                    text: result.message,
                    icon: 'error',
                    timer: 5000,  // Auto-close after 5 seconds
                    showConfirmButton: false
                }).then(() => {
                    // Redirect to the sign in after confirmation
                    window.location.href = result.redirectUrl;
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error',
                text: 'There was an issue processing your booking. Please try again.',
                icon: 'error',
            });
        }
    }
    

    bookButton.addEventListener('click', bookNow);
});

