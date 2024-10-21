document.addEventListener('DOMContentLoaded', function () {
    const packageRadios = document.querySelectorAll('input[name="package"]');
    const numPeopleInput = document.getElementById('numPeople');
    const dateTimeInput = document.getElementById('dateTime');
    const totalPriceDisplay = document.getElementById('totalPrice');
    const bookButton = document.getElementById('bookButton');
    const peopleError = document.getElementById('peopleError');
    const dateTimeError = document.getElementById('dateTimeError');
    let selectedPackagePrice = 0;

    // Initialize Flatpickr for date and time selection
    flatpickr("#dateTime", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        minDate: "today",
        minTime: "09:00",
        maxTime: "21:00",
    });

    function updateTotalPrice() {
        const numPeople = parseInt(numPeopleInput.value, 10);
        if (selectedPackagePrice > 0 && numPeople >= 5 && dateTimeInput.value) {
            const total = selectedPackagePrice * numPeople;
            totalPriceDisplay.textContent = `$${total.toFixed(2)}`;
            bookButton.disabled = false;
        } else {
            totalPriceDisplay.textContent = "$0";
            bookButton.disabled = true;
        }
    }

    function validateInputs() {
        const numPeople = parseInt(numPeopleInput.value, 10);
        peopleError.style.display = numPeople < 5 ? 'block' : 'none';
        dateTimeError.style.display = dateTimeInput.value ? 'none' : 'block';
        updateTotalPrice();
    }

    packageRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            selectedPackagePrice = parseFloat(this.getAttribute('data-price'));
            updateTotalPrice();
        });
    });

    numPeopleInput.addEventListener('input', validateInputs);
    dateTimeInput.addEventListener('change', validateInputs);

    async function bookNow() {
        const selectedPackageElement = document.querySelector('input[name="package"]:checked');
        const selectedPackage = selectedPackageElement.value;
        const numPeople = parseInt(numPeopleInput.value, 10);
        const dateTime = dateTimeInput.value;
        const totalPrice = parseFloat(totalPriceDisplay.textContent.replace('$', ''));
        const restaurantId = document.getElementById('restaurantId').value;

        try {
            const response = await fetch('/api/bookings/storeBooking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    packageType: selectedPackage,
                    numPeople: numPeople,
                    dateTime: dateTime,
                    totalPrice: totalPrice,
                    restaurantId: restaurantId
                })
            });

            if (response.ok) {
                window.location.href = '/api/bookings/payment';
            } else {
                throw new Error('Failed to store booking');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while processing your booking. Please try again.');
        }
    }

    bookButton.addEventListener('click', bookNow);
});