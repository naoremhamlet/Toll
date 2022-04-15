const express = require('express');
const { Router } = require('./router');
const app = express();


const bodyParser = require('body-parser');
const cors = require('cors');
const { CreateDb } = require('./createdb');

app.use(cors({
    origin : true,
    credentials : true
}));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));


app.use(Router);

app.listen(8000, async() => {
    await CreateDb();
    console.log(`listening to localhost:8000`)
})