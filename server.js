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
    
    const { username, password: plainTextPassword } = req.body;

    if(!username || typeof username !== 'string' ){
        return res.json({ status: 'error', error: 'Invalid username' });
    }
    
    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
        return res.json({ status: 'error', error: 'Invalid password' });
    }

    if (plainTextPassword.length < 5){
        return res.json({ status: 'error', error:'password too small should be atleast 6 characters' });
    }

    const password = await bcrypt.hash( plainTextPassword, 10);
    
    try{
        const response = await User.create({
            username,
            password
        });
        
        console.log('User created successfully: ',response);
    
    }catch(error){
        
        if(error.code === 11000){
            return res.json({ status: 'error' , error:'Username already taken'});
        }
        throw error 
        console.log(error.message);
        return res.json({ status: 'error'})
    }

    res.json({ status: 'ok' })
});

app.listen(8000, () => {
    console.log('server up at 8000');
});