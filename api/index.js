const express = require('express');
const { Router } = require('./router');
const app = express();


const bodyParser = require('body-parser');
const cors = require('cors');
const { CreateDb } = require('./createdb');
const { conn } = require('./connection');

app.use(cors({
    origin : true,
    credentials : true
}));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));


app.use(Router);

app.get('/', async (req, res) => {

    const {ip} = req.query;
    let sql = `SELECT * FROM Toll_BoothMaster WHERE ipaddress='${ip}'`;
    const boothno = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) return res.status(404).json({ message: "Something went wrong"});
            resolve(result);
        })
    })

    let companyQuery = `SELECT * FROM Toll_CompanyName LIMIT 1;`
    const companyName = await new Promise((resolve, reject) => {
        conn.query(companyQuery, (err, result) => {
            if(err) return res.status(404).json({ message: "Something went wrong"});
            resolve(result);
        })
    })

    console.log(companyName);


    if(boothno.length && companyName.length)
        return res.status(200).json({ booth: boothno[0].boothno, companyName : companyName[0].company});

    res.status(404).json({ message: 'booth not availabel'});
    // res.status(200).json({ message: 'Connection Established...' });
});


app.listen(8000, async() => {
    await CreateDb();
    console.log(`listening to localhost:8000`)
})