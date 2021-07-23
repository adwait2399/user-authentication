import express from 'express';
const path = require('path');

const app = express();
app.use('/', express.static)