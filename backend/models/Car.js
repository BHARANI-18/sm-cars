const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    title: {
        type: String
    },
    brand: {
        type: String
    },
    model: {
        type: String
    },
    year: {
        type: Number
    },
    price: {
        type: Number
    },
    fuelType: {
        type: String       // stored as comma-separated e.g. 'Petrol, Diesel'
    },
    transmission: {
        type: String
    },
    mileage: {
        type: Number
    },
    description: {
        type: String
    },
    owner: {
        type: String       // e.g. '1st', '2nd', 'Company'
    },
    fcUntil: {
        type: Number       // Fitness Certificate valid until year
    },
    insurance: {
        type: String       // e.g. 'Comprehensive', 'Third Party'
    },
    kilometer: {
        type: Number       // Odometer reading in km
    },
    imageUrls: {
        type: [String]
    }
}, {
    timestamps: true // This will automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('Car', carSchema);
