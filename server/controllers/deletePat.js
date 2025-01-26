//To get Patients Records by phone number Receipt DB

const { Pats } = require('../models/patModel');
const { Token } = require('../models/tokModel');

const deletePat = async (req, res) => {
    const session = await Pats.startSession(); // Start a session for transaction
    session.startTransaction();
    try {
        const { username } = req.params;

        // Find and delete the patient
        const deletedPatient = await Pats.findOneAndDelete({ username }).session(session);

        if (!deletedPatient) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Delete tokens associated with the patient
        const deletedTokens = await Token.updateMany(
            {},
            { $pull: { tokens: { patient: deletedPatient._id } } },
            { session }
        );

        await session.commitTransaction();

        res.status(200).json({
            message: 'Patient and associated tokens deleted successfully',
            patient: deletedPatient, // Include details of the deleted patient (optional)
            deletedTokens: deletedTokens.modifiedCount, // Number of tokens updated
        });
    } catch (error) {
        await session.abortTransaction();
        console.error('Error deleting patient and tokens:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    } finally {
        session.endSession();
    }
};

module.exports = { deletePat };
