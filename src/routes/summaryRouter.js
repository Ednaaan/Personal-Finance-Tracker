const express = require('express');
const summaryRouter = express.Router();
const mongoose = require("mongoose");
const Income = require("../model/income");
const Expense = require("../model/Expense");
const { userAuth } = require("../middlewares/auth");

// Monthly Summary
summaryRouter.get("/summary/monthly", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const { month, year } = req.query;

        const targetMonth = month ? parseInt(month) : new Date().getMonth() + 1;
        const targetYear = year ? parseInt(year) : new Date().getFullYear();

        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

        // Sum of expenses for the given month
        const expenses = await Expense.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(loggedInUser),
                    date: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: null,
                    totalExpenses: { $sum: "$amount" },
                },
            },
        ]);

        // Sum of income for the given month
        const incomes = await Income.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(loggedInUser),
                    date: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: "$amount" },
                },
            },
        ]);

        const totalExpenses = expenses.length > 0 ? expenses[0].totalExpenses : 0;
        const totalIncome = incomes.length > 0 ? incomes[0].totalIncome : 0;

        res.status(200).json({
            month: targetMonth,
            year: targetYear,
            totalIncome,
            totalExpenses,
            balance: totalIncome - totalExpenses,
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching monthly summary", error: err.message });
    }
});
// Category Breakdown
summaryRouter.get("/summary/categories", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const { startDate, endDate } = req.query;

        const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1); // Defaults to start of the year
        const end = endDate ? new Date(endDate) : new Date();

        // Aggregate expenses by category
        const categoryBreakdown = await Expense.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(loggedInUser),
                    date: { $gte: start, $lte: end },
                },
            },
            {
                $group: {
                    _id: "$category",
                    totalAmount: { $sum: "$amount" },
                },
            },
            {
                $sort: { totalAmount: -1 },
            },
        ]);

        res.status(200).json({
            startDate: start,
            endDate: end,
            categoryBreakdown,
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching category breakdown", error: err.message });
    }
});



module.exports = summaryRouter;
