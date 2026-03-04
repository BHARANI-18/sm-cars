const express = require('express');
const router = express.Router();
const { getCars, getCar, createCar, updateCar, deleteCar } = require('../controllers/carController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');
const multer = require('multer');

// Public routes
router.get('/', getCars);
router.get('/:id', getCar);

// Admin protected routes
router.post('/', protect, upload.array('images', 20), createCar);
router.put('/:id', protect, upload.array('images', 20), updateCar);
router.delete('/:id', protect, deleteCar);

// Handle multer errors (e.g. too many files, file too large)
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: `Upload error: ${err.message}` });
    }
    next(err);
});

module.exports = router;
