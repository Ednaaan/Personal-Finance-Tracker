const express = require('express');
const app = express();

const connectDB  = require("./config/database");
const router = require("./routes/authRouter");
const expenseRouter = require("./routes/expensesRouter");
const cookieParser = require('cookie-parser');
const incomeRouter = require('./routes/incomeRouter');
// const budgetRouter = require("./routes/budgetRouter");



app.use(express.json());
app.use(cookieParser());


 app.use("/", router);
 app.use("/", expenseRouter);
 app.use("/", incomeRouter);
//  app.use('/', budgetRouter);

    




connectDB(). then(()=> {
    console.log("Database connection started");
    app.listen(2408, ()=> {
        console.log("Connection Established on port 2408");
    });

})
.catch((err) => {
    console.log("Database cannot be connected");
});