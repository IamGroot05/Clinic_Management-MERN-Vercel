const { Token } = require("../models/tokModel");

const getTokensForToday = async (req, res) => {
  try {
    // Define the start and end of today in local time
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Start of the day

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999); // End of the day


    // Use aggregate to fetch tokens for today
    const tokensForToday = await Token.aggregate([
      { $unwind: "$tokens" }, // Unwind the tokens array
      {
        $match: {
          "tokens.createdAt": { $gte: todayStart, $lte: todayEnd }, // Filter tokens by date
        },
      },
      {
        $lookup: {
          from: "docs", // Name of the Doc collection
          localField: "tokens.docs",
          foreignField: "_id",
          as: "tokens.docs",
        },
      },
      {
        $lookup: {
          from: "pats", // Name of the Pats collection
          localField: "tokens.patient",
          foreignField: "_id",
          as: "tokens.patient",
        },
      },
      {
        $project: {
          "tokens.token": 1,
          "tokens.createdAt": 1,
          "tokens.checked": 1,
          "tokens.type": 1,
          "tokens.docs": 1,
          "tokens.patient": 1,
        },
      },
    ]);

    // Respond with the tokens for today
    res.status(200).json({ tokens: tokensForToday });
  } catch (err) {
    console.error("Error fetching tokens for today:", err);
    res.status(500).json({ message: "Server Error For Retrieving Tokens: " + err });
  }
};

module.exports = { getTokensForToday };
