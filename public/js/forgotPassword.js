/* eslint-disable */
console.log('Hellow');
import { showAlert } from '/js/alerts.js';

export const forgotPassword = async email => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      data: {
        email
      }
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        'Reset Password link is send to your email , check your email'
      );
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

// DOM Elements
const forgotPasswordForm = document.querySelector('.form--forgotPassword');

// Event listener
if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', e => {
    e.preventDefault();

    const email = document.getElementById('email').value;

    forgotPassword(email);
  });
}
