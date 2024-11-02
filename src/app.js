const express = require('express');
const app = express();

const connectDB  = require("./config/database");
const router = require("./routes/authRouter");



app.use(express.json());


 app.use("/", router);

    




connectDB(). then(()=> {
    console.log("Database connection started");
    app.listen(2408, ()=> {
        console.log("Connection Established on port 2408");
    });

})
.catch((err) => {
    console.log("Database cannot be connected");
});