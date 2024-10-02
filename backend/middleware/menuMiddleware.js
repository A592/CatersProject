document.addEventListener('DOMContentLoaded', function () {
    const vipRadio = document.getElementById('vip');
    const normalRadio = document.getElementById('normal');
    const numPeople = document.getElementById('numPeople');
    const totalPriceDisplay = document.getElementById('totalPrice');
    const bookButton = document.querySelector('button');

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
    }

    vipRadio.addEventListener('click', updatePrice);
    normalRadio.addEventListener('click', updatePrice);
    numPeople.addEventListener('change', updatePrice);

    bookButton.addEventListener('click', function() {
        alert('Booking successful!');
    });
});
