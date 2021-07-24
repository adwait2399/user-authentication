const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use('/', express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json());

app.post('/api/register', async (req, res) => {
    console.log(req.body);
})

app.listen(8000, () => {
    console.log('server up at 8000');
})