const { conn } = require("../connection");

async function AddTollName(req, res, next) {
    const {toll} = req.body;

    const sql = `INSERT INTO Toll_TollName VALUES ('${toll}')`
    const inserts = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) console.log(err);
            resolve(result);
        })
    })
    res.send({success: true});
}

async function FetchTollName(req, res, next) {
    const {searchinput} = req.query;

    let sql = "";
    if(searchinput)
        sql = `SELECT * FROM Toll_TollName WHERE toll='${searchinput}'`
    else 
        sql = `SELECT * FROM Toll_TollName`
    const fetches = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) console.log(err);
            resolve(result);
        })
    })
    res.send({ success: true, data: fetches });
}

async function EditTollName(req, res, next) {
    const {toll, currdata} = req.body;
    
    const sql = `UPDATE Toll_TollName SET toll='${toll}' WHERE toll='${currdata.toll}'`
    const updates = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) console.log(err);
            resolve(result);
        })
    })
    res.send({ success: true });
}


module.exports = {AddTollName, FetchTollName, EditTollName};