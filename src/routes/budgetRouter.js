const express = require('express');
const { userAuth } = require('../middlewares/auth');
const Budget = require('../model/budget');

const budgetRouter = express.Router();

budgetRouter.post("/budget", userAuth, async(req,res) => {
    try {
        const loggedInUser = req.user._id;
        const { amount , category } = req.body;

        const budget = new Budget({
            userId: loggedInUser,
            amount,
            category
        });
        await budget.save();
        res.status(200).json({message: "Budget Added Successfully",budget});



    } catch (err) {
        res.status(500).json({message:"Error on adding the budget", err: err.message });
        
    }
});

budgetRouter.get("/allBudget", userAuth, async(req,res) => {
    try {
        const loggedInUser = req.user._id;
        const allBudget = await Budget.find({userId:loggedInUser});
        res.status(200).json({message: "All Budgets List", allBudget});
    } catch (err) {
        res.status(500).json({message:"Error on Fetching the Budgets", err: err.message});
        
    }
});

budgetRouter.patch("/updateBudget/:id", userAuth, async(req,res) => {
    try {
        const loggedInUser = req.user._id;
        const budgetId = req.params.id;
        const { amount, category } = req.body;
        const updateBudget = await Budget.findOne({userId: loggedInUser, _id:budgetId });

        if(!updateBudget){
            res.status(404).json({message: "Not Found Budget"});

        }

        if(amount !== undefined) updateBudget.amount = amount;
        if(category !== undefined) updateBudget.category = category;

        await updateBudget.save();
        res.status(200).json({message: "Budget Updated Successfully", updateBudget});



    } catch (err) {
        res.status(400).json({message: " ERROR on updating the budget", err: err.message});
        
    }
});

module.exports = budgetRouter;