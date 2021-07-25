const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/user-authentication');

const app = express();
app.use('/', express.static(path.join(__dirname, 'static')));
app.use(express.json());

app.post('/api/register', async (req, res) => {
    console.log(req.body);
    res.json({ status: 'ok' })
});

app.listen(8000, () => {
    console.log('server up at 8000');
});