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
      const minrating = document.getElementById('minRatingInput').value;
      const maxrating = document.getElementById('maxRatingInput').value;

      if (
        !fromCity ||
        !toCity ||
        !departureDate ||
        !guests ||
        !days ||
        !minrating ||
        !maxrating
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
            minrating,
            maxrating
          })
        });

        if (!response.ok) throw new Error('Failed to fetch data');

        const data = await response.json();
        console.log('API Response:', data);

        displayFlights(data.flights);
        displayHotels(data.hotel);
        displayItinerary(data.itinerary);

        // Send itinerary data to history API
        await saveToHistory(
          fromCity,
          toCity,
          departureDate,
          guests,
          days,
          minrating,
          maxrating,
          data
        );
        console.log('history printed ??');

        showAlert('Plan generated successfully!', 'success');
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

async function saveToHistory(
  fromCity,
  toCity,
  departureDate,
  guests,
  days,
  minrating,
  maxrating,
  data
) {
  try {
    const response = await fetch('/api/history/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromCity,
        to: toCity,
        departureDate,
        travellers: guests,
        tripDays: days,
        minRating: minrating,
        maxRating: maxrating,
        flightDetails: JSON.stringify(data.flights),
        hotelDetails: JSON.stringify(data.hotel),
        iteneryDetails: JSON.stringify(data.itinerary)
      })
    });

    if (!response.ok) throw new Error('Failed to save history');

    console.log('History saved successfully');
  } catch (error) {
    console.error('Error saving history:', error.message);
  }
}

function showAlert(message, type) {
  const alertBox = document.createElement('div');
  alertBox.textContent = message;

  // Set the background color to blue, regardless of type
  alertBox.style.backgroundColor = 'blue';
  alertBox.style.fontColor = 'black';

  // Add the alert class and type-specific class for other styles
  alertBox.classList.add('alert');
  alertBox.classList.add(type === 'error' ? 'alert-error' : 'alert-success');

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

// Select the range and number input elements
const minRatingInput = document.getElementById('minRating');
const maxRatingInput = document.getElementById('maxRating');
const minRatingNumInput = document.getElementById('minRatingInput');
const maxRatingNumInput = document.getElementById('maxRatingInput');

// Synchronize range input with number input
minRatingInput.addEventListener('input', function() {
  minRatingNumInput.value = minRatingInput.value;
});

maxRatingInput.addEventListener('input', function() {
  maxRatingNumInput.value = maxRatingInput.value;
});

// Synchronize number input with range input
minRatingNumInput.addEventListener('input', function() {
  minRatingInput.value = minRatingNumInput.value;
});

maxRatingNumInput.addEventListener('input', function() {
  maxRatingInput.value = maxRatingNumInput.value;
});

// Replace with your Mapbox API key
// St. Xavier's School Road, New Hirakunj Society, 380009, Naranpura, Ahmedabad, Ahmadabad, Gujarat, India
mapboxgl.accessToken =
  'pk.eyJ1IjoibmFpdGlrLXNoYWgiLCJhIjoiY200anBmM255MGZicDJqc2R3bndxaGp2cSJ9.i_g0WNG_11SJagZAIWzYNQ';

// Select elements
const mapModal = document.getElementById('locationModal');
const openMapBtnFrom = document.getElementById('openMapBtn');
const openMapBtnTo = document.getElementById('openMapBtnTo');
const closeModal = document.querySelector('.close-modal');
const confirmLocation = document.getElementById('confirmLocation');
const cancelLocation = document.getElementById('cancelLocation');
const fromCityInput = document.getElementById('from_city');
const toCityInput = document.getElementById('to_city');

let activeInput = null; // Track which input is being updated

// Open modal and track the active input field
openMapBtnFrom.addEventListener('click', () => {
  activeInput = fromCityInput;
  mapModal.style.display = 'block';
});

openMapBtnTo.addEventListener('click', () => {
  activeInput = toCityInput;
  mapModal.style.display = 'block';
});

// Close modal function
const closePopup = () => (mapModal.style.display = 'none');
closeModal.addEventListener('click', closePopup);
cancelLocation.addEventListener('click', closePopup);

// Default location (Ahmedabad, India)
let selectedCoords = [72.5714, 23.0225];
let selectedPlaceName = '';

// Initialize Mapbox
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: selectedCoords,
  zoom: 10
});

// Add Search Box
const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  marker: false,
  placeholder: 'Search for a location...'
});

map.addControl(geocoder, 'top-left');

// Add Draggable Marker
const marker = new mapboxgl.Marker({ draggable: true })
  .setLngLat(selectedCoords)
  .addTo(map);

// Update marker & location name on search selection
geocoder.on('result', e => {
  const { center, place_name } = e.result;
  selectedCoords = center;
  selectedPlaceName = place_name;
  marker.setLngLat(selectedCoords);
});

// Update coordinates when marker is dragged
marker.on('dragend', () => {
  selectedCoords = marker.getLngLat();
  fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${selectedCoords.lng},${
      selectedCoords.lat
    }.json?access_token=${mapboxgl.accessToken}`
  )
    .then(res => res.json())
    .then(data => {
      selectedPlaceName = data.features[0]?.place_name || 'Unknown Location';
    });
});

// Confirm Selection & Update Input Field
confirmLocation.addEventListener('click', () => {
  if (activeInput) {
    activeInput.value = selectedPlaceName || 'Unknown Location';
  }
  closePopup();
});

// Close modal if user clicks outside
window.onclick = event => {
  if (event.target === mapModal) {
    closePopup();
  }
};
