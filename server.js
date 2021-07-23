import express from 'express';
const path = require('path');

const app = express();
app.use('/', express.static(path.join(_dirname, 'static')));


app.listen(9000, () => {
    console.log('server up at 8000');
})