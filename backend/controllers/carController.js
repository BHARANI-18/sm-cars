const Car = require('../models/Car');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get all cars
// @route   GET /api/cars
// @access  Public
const getCars = async (req, res) => {
    try {
        const cars = await Car.find().sort({ createdAt: -1 });
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get a single car
// @route   GET /api/cars/:id
// @access  Public
const getCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.status(200).json(car);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a new car
// @route   POST /api/cars
// @access  Private (Admin)
const createCar = async (req, res) => {
    try {
        console.log("--- CREATE CAR REQUEST ---");
        console.log("Body:", req.body);
        console.log("Files:", req.files);

        let imageUrls = [];

        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(file => {
                if (file.buffer) {
                    const b64 = Buffer.from(file.buffer).toString('base64');
                    let dataURI = "data:" + file.mimetype + ";base64," + b64;
                    return cloudinary.uploader.upload(dataURI, { folder: 'cardealership' });
                }
                return Promise.resolve(null);
            });
            const results = await Promise.all(uploadPromises);
            imageUrls = results.filter(result => result !== null).map(result => result.secure_url);
        }

        const { title, brand, model, year, price, fuelType, transmission, mileage, description } = req.body;

        const car = await Car.create({
            title,
            brand,
            model,
            year: year ? Number(year) : undefined,
            price: price ? Number(price) : undefined,
            fuelType,
            transmission,
            mileage: mileage ? Number(mileage) : undefined,
            description,
            imageUrls
        });

        console.log("Car created successfully!");
        res.status(201).json(car);
    } catch (error) {
        console.error("--- ERROR CREATING CAR ---", error);
        res.status(500).json({ message: 'Server Error when creating car', error: error.message });
    }
};

// @desc    Update a car
// @route   PUT /api/cars/:id
// @access  Private (Admin)
const updateCar = async (req, res) => {
    try {
        let car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        let imageUrls = car.imageUrls;

        // If new images are uploaded, replace the old ones (or append, but replace is simpler)
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(file => {
                if (file.buffer) {
                    const b64 = Buffer.from(file.buffer).toString('base64');
                    let dataURI = "data:" + file.mimetype + ";base64," + b64;
                    return cloudinary.uploader.upload(dataURI, { folder: 'cardealership' });
                }
                return Promise.resolve(null);
            });
            const results = await Promise.all(uploadPromises);

            // Only update imageUrls if we actively uploaded valid files
            const validResults = results.filter(result => result !== null);
            if (validResults.length > 0) {
                imageUrls = validResults.map(result => result.secure_url);
            }
        }

        // Prepare updated data mapping missing req.body fields to existing
        const updatedData = {
            title: req.body.title || car.title,
            brand: req.body.brand !== undefined ? req.body.brand : car.brand,
            model: req.body.model !== undefined ? req.body.model : car.model,
            year: req.body.year ? Number(req.body.year) : car.year,
            price: req.body.price ? Number(req.body.price) : car.price,
            fuelType: req.body.fuelType !== undefined ? req.body.fuelType : car.fuelType,
            transmission: req.body.transmission !== undefined ? req.body.transmission : car.transmission,
            mileage: req.body.mileage ? Number(req.body.mileage) : car.mileage,
            description: req.body.description !== undefined ? req.body.description : car.description,
            imageUrls: imageUrls
        };

        car = await Car.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        res.status(200).json(car);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a car
// @route   DELETE /api/cars/:id
// @access  Private (Admin)
const deleteCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        await car.deleteOne();

        res.status(200).json({ message: 'Car removed', id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getCars,
    getCar,
    createCar,
    updateCar,
    deleteCar
};
