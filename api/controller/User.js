const { conn } = require("../connection");

async function AddUser(req, res, next) {
    const {name, pass, empcode, toll, lane} = req.body;

    const sql = `INSERT INTO Toll_User VALUES ('${name}','${pass}','${empcode}','${toll}','${lane}')`
    const inserts = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) console.log(err);
            resolve(result);
        })
    })
    res.send({success: true});
}

async function FetchUser(req, res, next) {
    const {searchinput} = req.query;

    let sql = ""
    if(searchinput)
        sql = `SELECT * FROM Toll_User WHERE name='${searchinput}' OR pass='${searchinput}' OR empcode='${searchinput}' OR toll='${searchinput}' OR lane='${searchinput}'`
    else 
        sql = `SELECT * FROM Toll_User`
    const fetches = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) console.log(err);
            resolve(result);
        })
    })
    res.send({ success: true, data: fetches });
}

async function EditUser(req, res, next) {
    const {name,pass,empcode,toll,lane,currdata} = req.body;
    
    const sql = `UPDATE Toll_User SET name='${name}',pass='${pass}',empcode='${empcode}',toll='${toll}',lane='${lane}' WHERE name='${currdata.name}' AND pass='${currdata.pass}' AND empcode='${currdata.empcode}' AND toll='${currdata.toll}' AND lane='${currdata.lane}'`
    const updates = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) console.log(err);
            resolve(result);
        })
    })
    res.send({ success: true });
}

module.exports = {AddUser, FetchUser, EditUser};