const express = require('express');
const router = express.Router();
const { getCars, getCar, createCar, updateCar, deleteCar } = require('../controllers/carController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// Public routes
router.get('/', getCars);
router.get('/:id', getCar);

// Admin protected routes
router.post('/', protect, upload.array('images', 10), createCar);
router.put('/:id', protect, upload.array('images', 10), updateCar);
router.delete('/:id', protect, deleteCar);

module.exports = router;
