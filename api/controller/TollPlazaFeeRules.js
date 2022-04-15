const { conn } = require("../connection");

async function AddTollPlazaFeeRules(req, res, next) {
    const {v_type, j_type, amount} = req.body;

    const sql = `INSERT INTO Toll_TollPlazaFeeRules VALUES ('${v_type}','${j_type}','${amount}')`
    const inserts = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) console.log(err);
            resolve(result);
        })
    })
    res.send({success: true});
}

async function FetchTollPlazaFeeRules(req, res, next) {
    const {searchinput} = req.query;

    let sql = "";
    if(searchinput)
        sql = `SELECT * FROM Toll_TollPlazaFeeRules WHERE v_type='${searchinput}' OR j_type='${searchinput}' OR amount='${searchinput}'`
    else 
        sql = `SELECT * FROM Toll_TollPlazaFeeRules`
    const fetches = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) console.log(err);
            resolve(result);
        })
    })
    res.send({ success: true, data: fetches });
}

async function EditTollPlazaFeeRules(req, res, next) {
    const {v_type, j_type, amount, currdata} = req.body;
    
    const sql = `UPDATE Toll_TollPlazaFeeRules SET v_type='${v_type}', j_type='${j_type}', amount='${amount}' WHERE v_type='${currdata.v_type}' AND j_type='${currdata.j_type}' AND amount='${currdata.amount}'`
    const updates = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) console.log(err);
            resolve(result);
        })
    })
    res.send({ success: true });
}


async function FetchAmount(req, res, next) {
    const {type, journey} = req.body;
    
    let sql = `SELECT amount FROM Toll_TollPLazaFeeRules WHERE v_type='${type}' AND j_type='${journey}'`;
    const amount = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) console.log(err);
            resolve(result);
        })
    })
    res.send({ success: true, amount: amount[0].amount });
}

module.exports = {AddTollPlazaFeeRules, FetchTollPlazaFeeRules, EditTollPlazaFeeRules, FetchAmount};