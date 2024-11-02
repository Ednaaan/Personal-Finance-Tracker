const mongoose = require('mongoose');


const connectDB = async() => {
   await mongoose.connect(
    "mongodb+srv://namastenode66:lx9KyD6kyYCj86kb@personalfinancetracker.1aghy.mongodb.net/?retryWrites=true&w=majority&appName=PersonalFinanceTracker/PFT"
    );

};
module.exports = connectDB;

// connectDB(). then(()=> {
//     console.log("Database connection started");
// })
// .catch((err) => {
//     console.log("Database cannot be connected");
// });











