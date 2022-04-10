const { conn } = require("../connection");

async function AddBoothMaster(req, res, next) {
    const {boothno, ipaddress} = req.body;

    const sql = `INSERT INTO Toll_BoothMaster VALUES ('${boothno}','${ipaddress}')`
    const inserts = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) console.log(err);
            resolve(result);
        })
    })
    res.send({ success: true });
}

async function FetchBoothMaster(req, res, next) {
    const {searchinput} = req.query;
    let sql = "";
    if(searchinput)
        sql = `SELECT * FROM Toll_BoothMaster WHERE boothno='${searchinput}' OR ipaddress='${searchinput}'`
    else 
        sql = `SELECT * FROM Toll_BoothMaster`
    const fetches = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) console.log(err);
            resolve(result);
        })
    })
    res.send({ success: true, data: fetches });
}

async function EditBoothMaster(req, res, next) {
    const {boothno, ipaddress, currdata} = req.body;
    
    const sql = `UPDATE Toll_BoothMaster SET boothno='${boothno}', ipaddress='${ipaddress}' WHERE boothno='${currdata.boothno}' AND ipaddress='${currdata.ipaddress}'`
    const updates = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) console.log(err);
            resolve(result);
        })
    })
    res.send({ success: true });
}

module.exports = {AddBoothMaster, FetchBoothMaster, EditBoothMaster};