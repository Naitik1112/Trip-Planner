/* eslint-disable */
console.log('Hello resetPassword');
import { showAlert } from '/js/alerts.js';

export const reviewForm = async (rating, review) => {
  try {
    // Extract the slug from the URL
    const slug = window.location.pathname.split('/').pop();

    // Make Axios POST request
    const res = await axios({
      method: 'POST',
      url: `/api/v1/tours/${slug}/reviews`, // Updated to use slug in the URL
      data: {
        rating,
        review
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Thanks for your review');
      // Optionally reload the page or show the new review
      window.setTimeout(() => location.reload(), 1500);
    }
  } catch (err) {
    const errorMessage =
      err && err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : 'Something went wrong';
    showAlert('error', errorMessage);
  }
};

// DOM Elements
const reviewFormElement = document.querySelector('.form--review');

// Event listener
if (reviewFormElement) {
  reviewFormElement.addEventListener('submit', e => {
    e.preventDefault();

    // Get inputs from form
    const rating = document.getElementById('rating').value;
    const review = document.getElementById('review').value;

    // Call reviewForm function with inputs
    reviewForm(rating, review);
  });
}
