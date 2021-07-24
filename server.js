const express = require('express');
const path = require('path');

const app = express();
app.use('/', static(join(__dirname, 'static')));


app.listen(9000, () => {
    console.log('server up at 8000');
})