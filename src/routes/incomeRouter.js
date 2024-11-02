const express = require('express');
const { userAuth } = require('../middlewares/auth');
const Income = require('../model/income');

const incomeRouter = express.Router();


incomeRouter.post("/income", userAuth, async(req,res) => {
    try {
        const loggedInUser = req.user._id;
    const { amount, source, date, notes } = req.body;
    const income = new Income({
        userId: loggedInUser,
        amount,
        source,
        date: date|| Date.now(),
        notes

    });

    await income.save();
    res.status(200).json({message: "Income Added Successfully", income});
    } catch (err) {
        res.status(500).json({message: "Error on Adding the Income", err: err.message});
        
    }

});

incomeRouter.patch("/incomeUpdate/:id", userAuth, async(req,res) => {
    try {
        const loggedInUser = req.user;
        const incomeId = req.params.id;
        const{ amount, source, date, notes } = req.body;

        const income = await Income.findOne({_id:incomeId, userId: loggedInUser});
        if(!income){
            res.status(404).json({message: "Income not found"})
        };

        if(amount!== undefined) income.amount = amount;
        if(source !== undefined) income.source = source;
        if(date !== undefined) income.date = date;
        if(notes !== undefined) income.notes = notes;

        await income.save();

        res.status(200).json({message: "Income updated successfully", income});



    } catch (err) {
        res.status(500).json({message: "Error on updating the income", err: err.message});
        
    }
} );

incomeRouter.delete("/incomeDelete/:id", userAuth, async(req,res) => {
    try {
        const loggedInUser = req.user;
    const incomeId = req.params.id;

    const incomeDelete = await Income.findOneAndDelete({_id: incomeId, userId: loggedInUser});

    if(!incomeDelete){
        res.status(404).json({message: "Income not Found"});
    }
    res.status(200).json({message: "Incomme Deleted Successfully", incomeDelete});
    } catch (err) {
        res.status(500).json({message: "Error while Updating the Income", err: err.message});
        
    }
});

incomeRouter.get("/allIncome", userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;
        // console.log(loggedInUser);
        const allIncome = await Income.find({userId: loggedInUser._id});
        res.status(200).json({message: "All Expenses are here", allIncome});
    } catch (err) {
        res.status(500).json({message: "Error on fetching the income", err: err.message});
    }
});

module.exports = incomeRouter;
