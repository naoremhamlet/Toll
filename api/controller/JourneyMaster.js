const { conn } = require("../connection");

async function AddJourneyMaster(req, res, next) {
    const {j_type} = req.body;

    const sql = `INSERT INTO Toll_JourneyMaster VALUES ('${j_type}')`
    const inserts = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) console.log(err);
            resolve(result);
        })
    })

    res.send({success: true});
}

async function FetchJourneyMaster(req, res, next) {
    const {searchinput} = req.query;

    let sql = "";
    if(searchinput)
        sql = `SELECT * FROM Toll_JourneyMaster WHERE j_type='${searchinput}'`
    else
        sql = `SELECT * FROM Toll_JourneyMaster`
    const fetches = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) console.log(err);
            resolve(result);
        })
    })
    res.send({ success: true, data: fetches });
}

async function EditJourneyMaster(req, res, next) {
    const {j_type, currdata} = req.body;
    
    const sql = `UPDATE Toll_JourneyMaster SET j_type='${j_type}' WHERE j_type='${currdata.j_type}'`
    const updates = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) console.log(err);
            resolve(result);
        })
    })
    res.send({ success: true });
}


module.exports = {AddJourneyMaster, FetchJourneyMaster, EditJourneyMaster};