const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

// Setup view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Setup routes
app.get('/', (req, res) => {
    res.render('home');
})

// Run server
app.listen(port, () => {
    console.log(`Listening at port: ${port}`);
});