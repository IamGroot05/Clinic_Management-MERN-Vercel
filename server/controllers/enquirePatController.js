//The Doctor Will Just Display The Details Of The Patient
//And Retrieve The Disease And Gives The Prescription

const { Doc } = require('../models/docModel');
const { Pats } = require('../models/patModel');
const {Token} = require('../models/tokModel')
const mongoose = require('mongoose');

const enquirePatController = async (req, res) => {
    try {
        const doc = await Doc.findById(req.body.id);
        if (!doc) {
            return res.status(404).send({data:"Doctor Not Found"});
        }
        let prescription = req.body.pres;
        if (typeof prescription !== 'string') {
            return res.status(400).json({ error: 'Prescription must be a string' });
        }
        const docObjectId = new mongoose.Types.ObjectId(doc._id);
        const patDetail = await Pats.findOne({_id:req.body.patid})
        if (!doc.patConsult) {
            doc.patConsult = [];
        }
        if(patDetail){
            patDetail.docConsult.push({ doctor:docObjectId, prescription, medication: req.body.medication, dosage: req.body.dosage, duration: req.body.duration, intravenousTherapy: req.body.ivTheraphy });
            await patDetail.save();
            doc.patConsult.push(patDetail.id);
        }
        else{
        const newPatient = await new Pats({
            name: req.body.name,
            age: req.body.patAge,
            gender: req.body.patGender,
            phno: req.body.patPh,
            docConsult: [{ doctor:docObjectId, prescription, medication: req.body.medication, dosage: req.body.dosage, duration: req.body.duration, intravenousTherapy: req.body.ivTheraphy }],
        }).save();
        doc.patConsult.push(newPatient._id);
    }
        await doc.save();
        await updateTokenCheckedStatus(req.body.tokenId, true);
        res.status(200).json({ message: 'Patient details added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json("Internal Server Error " + err.message);
    }
};

const updateTokenCheckedStatus = async (tokenId, checkedStatus) => {
    try {
        // Find and update the token
        const updatedToken = await Token.updateOne(
            {
                "tokens.token": tokenId,
            },
            {
                $set: { "tokens.$.checked": checkedStatus }, // Update the 'checked' field of the matching token
            },
            { new: true } // Return the updated document
        );

        if (updatedToken.modifiedCount > 0) {
            console.log("Token updated successfully.");
            return { success: true, message: "Token updated successfully." };
        } else {
            return { success: false, message: "No token found for the patient on the specified date." };
        }
    } catch (err) {
        console.error("Error updating token:", err.message);
        return { success: false, message: `Error updating token: ${err.message}` };
    }
};

module.exports = { enquirePatController };
