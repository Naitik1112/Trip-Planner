/* eslint-disable */
// import axios from 'axios';
// import { showAlert } from './alerts';
// const stripe = Stripe(
//   'pk_test_51QVbHsB7mecCB9wjHTLr3iUFnoEd3ARPyDI1jkauth27KWcyAHEoSqq0pIfTfYedZgOZR6d5fgqe7Q5XK7vWQF3100dh7fvnFH'
// );

// export const bookTour = async tourId => {
//   try {
//     // 1) Get checkout session from API
//     const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
//     // console.log(session);

//     // 2) Create checkout form + chanre credit card
//     await stripe.redirectToCheckout({
//       sessionId: session.data.session.id
//     });
//   } catch (err) {
//     console.log(err);
//     showAlert('error', err);
//   }
// };

/* eslint-disable */
import { showAlert } from '/js/alerts.js';
const stripe = Stripe(
  'pk_test_51QVbHsB7mecCB9wjHTLr3iUFnoEd3ARPyDI1jkauth27KWcyAHEoSqq0pIfTfYedZgOZR6d5fgqe7Q5XK7vWQF3100dh7fvnFH'
);

// Function to book a tour
export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    console.log(session);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.error(err);
    const errorMessage =
      err && err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : 'Something went wrong during checkout!';
    showAlert('error', errorMessage);
  }
};

// Select book button element
const bookBtn = document.getElementById('book-tour');

// Add event listener to book button
if (bookBtn) {
  bookBtn.addEventListener('click', e => {
    e.preventDefault();
    e.target.textContent = 'Processing...';

    const { tourId } = e.target.dataset; // Ensure the button has a `data-tour-id` attribute
    if (!tourId) {
      showAlert('error', 'Tour ID is missing!');
      e.target.textContent = 'Book tour';
      return;
    }

    bookTour(tourId).finally(() => {
      e.target.textContent = 'Book tour';
    });
  });
}
