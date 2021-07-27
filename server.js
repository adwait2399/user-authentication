require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "fnij()&_*shfguirdhf44^$(@Qgujihdsuiouhu";

// CONNECTION TO DATABASE USING .ENV

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

const app = express();
app.use('/', express.static(path.join(__dirname, 'static')));
app.use(express.json());

// CHANGE-PASSWORD PAGE API

app.post('/api/change-password', async (req, res) => {
    const { token, newpassword: plainTextPassword } = res.body;
    
    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
        return res.json({ status: 'error', error: 'Invalid password' });
    }

    if (plainTextPassword.length < 5) {
        return res.json({ status: 'error', error: 'password too small should be atleast 6 characters' });
    }

    try{
        const user = jwt.verify(token, JWT_SECRET);
        const _id = user.id;

        const password = await bcrypt.hash(plainTextPassword, 10);
        await User.updateOne(
            { 
                _id 
            },
            {
                $set: { password }
            });
            res.json({ status: 'ok' });
    }catch(error){
        res.json({ status: 'error', error: '000'})
    }

});

// LOGIN PAGE API 

app.post('/api/login', async (req, res) => {
    
    const{ username, password } = req.body;

    const user = await User.findOne({ username }).lean();

    if(!user){
        return res.json({ status: 'error', error: 'Invalid username or password'});
    }
    
    if( await bcrypt.compare(password, user.password)){
        
        const token = jwt.sign({
             id: user._id, 
             username: user.username
            },
            JWT_SECRET
        );

        return res.json({ status: 'ok', data: token });
    }
    
    res.json({ status: 'error', error: 'Invalid username or password' });
})

// REGISTRATION  PAGE  API

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

// STARTING SERVER AT PORT 8000

app.listen(8000, () => {
    console.log('server up at 8000');
});