const { Mr } = require('../models/mrModel');

// Controller to create or update MR and manage visits
const saveMR = async (req, res) => {
    try {
        const { name, email, phone, company, address, region, visits } = req.body;

        // Check if an MR with the same email or phone exists
        let mr = await Mr.findOne({ $or: [{ email }, { phone }] });

        if (mr) {
            // Update existing MR
            mr.name = name || mr.name;
            mr.company = company || mr.company;
            mr.address = address || mr.address;
            mr.region = region || mr.region;

            // If visits are provided, merge them into the existing visits
            if (visits && Array.isArray(visits)) {
                visits.forEach((visit) => {
                    mr.visits.push({
                        visit_date: visit.visit_date,
                        products: visit.products,
                    });
                });
            }

            mr.updatedAt = Date.now();
        } else {
            // Create a new MR if none exists
            mr = new Mr({
                name,
                email,
                phone,
                company,
                address,
                region,
                visits,
            });
        }

        // Save the MR (either new or updated)
        const savedMR = await mr.save();

        return res.status(201).json({
            message: 'Medical Representative saved successfully!',
            data: savedMR,
        });
    } catch (err) {
        console.error('Error saving MR:', err);
        res.status(500).json({
            error: 'Internal Server Error',
            message: err.message,
        });
    }
};

module.exports = { saveMR };
