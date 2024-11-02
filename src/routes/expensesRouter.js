const express = require('express');
const { userAuth } = require('../middlewares/auth');
const Expense = require('../model/Expense');

const expenseRouter = express.Router();


expenseRouter.post("/expenses", userAuth, async(req,res) => {
    try {
        const loggedInUser = req.user._id;
        const { amount, category, date, notes } = req.body;

        const expense = new Expense({
            userId: loggedInUser,
            amount, 
            category,
            date: date || Date.now(),
            notes 
        });

        await expense.save();
        res.status(201). json({message: "Expense Added Successfully", expense});
    } catch (err) {
        res.status(500).json({message: "Error on adding expenses", err: err.message})
        
    }
});

expenseRouter.patch("/expensesUpdate/:id", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const expenseId = req.params.id;
        const { amount, category, date, notes } = req.body;

        // Find the expense by ID and check if it belongs to the logged-in user
        const expense = await Expense.findOne({ _id: expenseId, userId: loggedInUser._id });
        if (!expense) {
            return res.status(404).json({ message: "Expense not found or access denied" });
        }

        // Update the fields if they exist in the request body
        if (amount !== undefined) expense.amount = amount;
        if (category !== undefined) expense.category = category;
        if (date !== undefined) expense.date = date;
        if (notes !== undefined) expense.notes = notes;

        // Save the updated expense
        await expense.save();

        res.status(200).json({ message: "Expense updated successfully", expense });
    } catch (error) {res.status(400).json({ message: error.message });
}
});

expenseRouter.delete("/expensesdelete/:id", userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;
        const expenseId = req.params.id;

        const { amount, category, date, notes } = req.body;
        const expense = await Expense.findOneAndDelete({_id: expenseId, userId: loggedInUser});

        if(!expense){
          return  res.status(404). json({message: "Expense not found", expense});
        }
        res.status(200).json({message:"Expense Deleted Successfully"});


    } catch (err) {
        res.status(500).json({message: "Error Deleting the Expense", err: err.message});
        
    }
});

expenseRouter.get("/AllExpense", userAuth, async(req,res) => {
    try {
        const loggedInUser = req.user._id;

        const allExpense = await Expense.find({userId:loggedInUser});
        if(!allExpense){
            res.status(404).json({message: "Not Found A Single Expense"});

        }

        res.status(200).json({message:"All Expenses are retrived", allExpense});
    } catch (err) {
        res.status(500).json({message: "Not Found the Expenses", err: err.message})
        
    }
});

// expenseRouter.js
module.exports = expenseRouter;
