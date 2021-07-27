require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./model/user');
const bcrypt = require('bcryptjs');


mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

const app = express();
app.use('/', express.static(path.join(__dirname, 'static')));
app.use(express.json());

app.post('/api/register', async (req, res) => {
    console.log(req.body);
    
    const { username, password } = req.body;

    const Password = await bcrypt.hash(password, 10);
    
    

    res.json({ status: 'ok' })
});

app.listen(8000, () => {
    console.log('server up at 8000');
});