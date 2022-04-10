const { conn } = require("../connection");

async function AddCompanyName(req, res, next) {
    const {company} = req.body;

    const sql = `INSERT INTO Toll_CompanyName VALUES ('${company}')`
    const inserts = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) console.log(err);
            resolve(result);
        })
    })
    res.send({success: true})
}

async function FetchCompanyName(req, res, next) {
    const {searchinput} = req.query;
    let sql = ""
    if(searchinput)
        sql = `SELECT * FROM Toll_CompanyName WHERE company='${searchinput}'`
    else 
        sql = `SELECT * FROM Toll_CompanyName`
    const fetches = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) console.log(err);
            resolve(result);
        })
    })
    res.send({ success: true, data: fetches });
}

async function EditCompanyName(req, res, next) {
    const {company, currdata} = req.body;
    
    const sql = `UPDATE Toll_CompanyName SET company='${company}' WHERE company='${currdata.company}'`
    const updates = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) console.log(err);
            resolve(result);
        })
    })
    res.send({ success: true });
}

module.exports = {AddCompanyName, FetchCompanyName, EditCompanyName};