const { conn } = require("../connection");

async function CheckConnection(req, res, next) {
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

    if(boothno.length && companyName.length)
        return res.status(200).json({ booth: boothno[0].boothno, companyName : companyName[0].company});

    res.status(404).json({ message: 'booth not availabel'});
}

module.exports = {CheckConnection};