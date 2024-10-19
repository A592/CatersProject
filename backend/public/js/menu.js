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
        const selectedPackageElement = document.querySelector('input[name="package"]:checked');
        const selectedPackage = selectedPackageElement.value;
        const numPeople = parseInt(document.getElementById('numPeople').value, 10);
        const totalPrice = parseFloat(document.getElementById('totalPrice').textContent.replace('$', ''));
        const restaurantId = document.getElementById('restaurantId').value;
    
        // Send the booking details to store in the session
        const response = await fetch('/api/bookings/storeBooking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                packageType: selectedPackage,
                numPeople: numPeople,
                totalPrice: totalPrice,
                restaurantId: restaurantId
            })
        });
    
        // Redirect to payment page after storing the booking
        if (response.ok) {
            window.location.href = '/api/bookings/payment';
        } else {
            console.error('Failed to store booking');
        }
    }
    
    bookButton.addEventListener('click', bookNow);
    
   
});
