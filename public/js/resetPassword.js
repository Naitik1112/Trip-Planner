/* eslint-disable */
console.log('Hello resetPassword');
import { showAlert } from '/js/alerts.js';

export const resetPassword = async (password, passwordConfirm) => {
  try {
    // Extract the token dynamically from the URL
    console.log(window.location.pathname.split('/'));
    const token = window.location.pathname.split('/').pop();
    console.log(token);
    // Make Axios POST request
    const res = await axios({
      method: 'PATCH', // Usually reset password endpoints use PATCH
      url: `/api/v1/users/resetPassword/${token}`,
      data: {
        password,
        passwordConfirm
      }
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        'Password reset successful! Log in with your new password.'
      );

      // Optionally redirect user to login page after reset
      window.setTimeout(() => {
        location.assign('/login');
      }, 1500);
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
const resetPasswordForm = document.querySelector('.form--resetPassword');

// Event listener
if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', e => {
    e.preventDefault();

    // Get passwords from form inputs
    const password = document.getElementById('newPassword').value;
    const passwordConfirm = document.getElementById('confirmPassword').value;
    console.log(password, passwordConfirm);

    // Call resetPassword function with inputs
    resetPassword(password, passwordConfirm);
  });
}
