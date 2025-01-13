const express = require("express");
const mongoose = require("mongoose");
const { Token } = require("../models/tokModel");

const getStates = async (req, res) => {
  try {
    const { filter } = req.query; // Retrieve the 'filter' query parameter

    // Set date filter for today's tokens
    let dateFilter = {};
    if (!filter || filter.toLowerCase() !== "all") {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      dateFilter = { "tokens.createdAt": { $gte: todayStart, $lte: todayEnd } };
    }

    // Aggregate to calculate stats
    const stats = await Token.aggregate([
      { $unwind: "$tokens" }, // Unwind the tokens array
      { $match: dateFilter }, // Apply date filter if applicable
      {
        $group: {
          _id: null,
          total: { $sum: 1 }, // Count all tokens
          pending: { $sum: { $cond: [{ $eq: ["$tokens.checked", false] }, 1, 0] } }, // Count tokens with checked: false
          completed: { $sum: { $cond: [{ $eq: ["$tokens.checked", true] }, 1, 0] } }, // Count tokens with checked: true
          rejected: { $sum: { $cond: [{ $eq: ["$tokens.type", "reject"] }, 1, 0] } }, // Count tokens with type: "reject"
        },
      },
    ]);

    // Check if stats exist and send the response
    if (stats.length > 0) {
      const { total, pending, completed, rejected } = stats[0];
      res.status(200).json({ total, pending, completed, rejected });
    } else {
      res.status(200).json({ total: 0, pending: 0, completed: 0, rejected: 0 });
    }
  } catch (err) {
    // Handle errors
    res.status(500).json({ message: "Error retrieving token stats", error: err.message });
  }
};

module.exports = {getStates};
