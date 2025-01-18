const mongoose = require('mongoose');

const mrSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    company: { type: String, required: true },
    address: { type: String },
    region: { type: String }, // Region covered by the MR
    visits: [{ visit_date:{ type: Date}, products: [
        {
            name: { type: String, required: true }, // Product name
            quantity: { type: Number, required: true }, // Quantity of the product
            price: { type: Number, required: true }, // Price of a single unit
            finalPrice: { type: Number, required: true }, // Final price (quantity * price)
        }
    ]}], // Track visits for the clinic or doctors
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Mr = mongoose.model('Mr', mrSchema);

module.exports = { Mr };
