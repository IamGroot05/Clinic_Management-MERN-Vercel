//To get Patients Records by phone number Receipt DB

const { Pats } = require('../models/patModel');
const getPatList = async (req, res) => {
    try {
        const { phno } = req.query;

        if (!phno) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        // Find patients matching the phone number
        const patients = await Pats.find({ phno: phno }).select('name username age medicalHistory');

        if (patients.length === 0) {
            return res.status(404).json({ message: 'No patients found' });
        }

        return res.status(200).json({ patients });
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getPatList };
