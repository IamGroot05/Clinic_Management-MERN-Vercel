const { Token } = require("../models/tokModel");

const getTokensForToday = async (req, res) => {
    try {
        // Define the start and end of today in local time
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0); // Start of the day

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999); // End of the day

        // Fetch tokens for today
        const tokensForToday = await Token.find({
            "tokens.createdAt": { $gte: todayStart, $lte: todayEnd }
        }).select("tokens")
          .populate("tokens.docs tokens.patient");

        // Respond with the tokens
        res.status(200).json({ tokens: tokensForToday });
    } catch (err) {
        return res.status(500).json({ message: "Server Error For Retrieving Tokens: " + err });
    }
};

module.exports = { getTokensForToday };
