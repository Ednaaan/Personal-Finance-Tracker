const express = require('express');
const app = express();

app.use((req, res) => {
    res.send("hey ! I am here");
});


app.listen(2409, ()=> {
    console.log("Connection Established on port 2409");
});