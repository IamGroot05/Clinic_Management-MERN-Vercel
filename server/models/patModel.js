const mongoose = require('mongoose');

const patSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true,unique:true },
    age: { type: Number, required: true },
    phno: { type: Number, required: true },
    gender: { type: String, required: true },
    address:{type:String},
    amount: { type: String },
    medicalHistory: [{type: String}],
    docConsult: [
        {
            doctor: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Doc',
            },
            prescription: { type: String },
            medication: {type: String},
            dosage: {type: String},
            duration: {type: String},
            intravenousTherapy: {type: String},
            createdAt: { type: Date, default: Date.now }
        }
    ],
})

const Pats = mongoose.model("Pats", patSchema);
module.exports = { Pats };