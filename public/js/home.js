/* eslint-disable */
document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.querySelector('.search-btn');
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  if (tabButtons.length > 0) {
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');

        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(tab => (tab.style.display = 'none'));

        button.classList.add('active');
        document.getElementById(targetTab).style.display = 'block';
      });
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', async () => {
      const fromCity = document.getElementById('from_city').value.trim();
      const toCity = document.getElementById('to_city').value.trim();
      const departureDate = document.getElementById('departure_Date').value;
      const guests = document.getElementById('guests').value;
      const days = document.getElementById('days').value;
      const rating = document.getElementById('rating').value;

      if (
        !fromCity ||
        !toCity ||
        !departureDate ||
        !guests ||
        !days ||
        !rating
      ) {
        showAlert('Please fill in all fields.', 'error');
        return;
      }

      try {
        searchBtn.textContent = 'GENERATING PLAN...';
        searchBtn.classList.add('loading');

        const response = await fetch('/api/itinerary/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fromCity,
            toCity,
            departureDate,
            guests,
            days,
            rating
          })
        });

        if (!response.ok) throw new Error('Failed to fetch data');

        const data = await response.json();
        console.log('API Response:', data);

        displayFlights(data.flights);
        displayHotels(data.hotel);
        displayItinerary(data.itinerary);

        showAlert('Itinerary generated successfully!', 'success');
      } catch (error) {
        console.error('Error:', error.message);
        showAlert('Failed to generate itinerary.', 'error');
      } finally {
        searchBtn.textContent = 'GENERATE PLAN';
        searchBtn.classList.remove('loading');
      }
    });
  }
});

function showAlert(message, type) {
  const alertBox = document.createElement('div');
  alertBox.textContent = message;
  alertBox.classList.add(
    'alert',
    type === 'error' ? 'alert-error' : 'alert-success'
  );
  document.body.appendChild(alertBox);
  setTimeout(() => alertBox.remove(), 3000);
}

function displayFlights(flights) {
  const flightsContainer = document.getElementById('tab1');
  flightsContainer.innerHTML = '<h3>Flights</h3>';

  const flightList = document.createElement('div');
  flightList.classList.add('flight-list');

  flights.split('\n\n').forEach(flight => {
    if (flight.trim() !== '') {
      const flightCard = document.createElement('div');
      flightCard.classList.add('flight-card');
      flightCard.innerHTML = `<p>${flight.replace(/\n/g, '<br>')}</p>`;
      flightList.appendChild(flightCard);
    }
  });

  flightsContainer.appendChild(flightList);
}

function displayHotels(hotels) {
  const hotelsContainer = document.getElementById('tab2');
  hotelsContainer.innerHTML = '<h3>Hotels</h3>';

  const hotelList = document.createElement('div');
  hotelList.classList.add('hotel-list');

  hotels.split('\n').forEach(hotel => {
    if (hotel.trim() !== '') {
      const hotelCard = document.createElement('div');
      hotelCard.classList.add('hotel-card');
      hotelCard.innerHTML = `<p>${hotel.replace(/\n/g, '<br>')}</p>`;
      hotelList.appendChild(hotelCard);
    }
  });

  hotelsContainer.appendChild(hotelList);
}

function displayItinerary(itinerary) {
  const itineraryContainer = document.getElementById('tab3');
  itineraryContainer.innerHTML = '<h3>Itinerary</h3>';

  const itineraryList = document.createElement('div');
  itineraryList.classList.add('itinerary-list');

  itinerary.split('\n\n\n').forEach(day => {
    if (day.trim() !== '') {
      const dayCard = document.createElement('div');
      dayCard.classList.add('itinerary-card');
      dayCard.innerHTML = `<p>${day.replace(/\n/g, '<br>')}</p>`;
      itineraryList.appendChild(dayCard);
    }
  });

  itineraryContainer.appendChild(itineraryList);
}
