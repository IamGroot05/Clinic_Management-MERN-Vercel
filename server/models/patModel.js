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
    docConsult: [{
        createdAt: { type: Date, default: Date.now },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doc',
        },
        prescription: { type: String },
        intravenousTherapy: {type: String},
        prescriptionData: [
            {
                medication: {type: String},
                dosage: {type: String},
                duration: {type: String},
            }
        ],
    }],
})

const Pats = mongoose.model("Pats", patSchema);
module.exports = { Pats };