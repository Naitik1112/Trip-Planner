const express = require('express');
const { generateItinerary } = require('./../controllers/itenaryController');

const router = express.Router();
router.post('/generate', generateItinerary);

module.exports = router;
