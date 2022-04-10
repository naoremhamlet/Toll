const { conn } = require("../connection");

async function AddVehicleMaster(req, res, next) {
    const {v_type, v_wt} = req.body;

    const sql = `INSERT INTO Toll_VehicleMaster VALUES ('${v_type}','${v_wt}')`
    const inserts = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) console.log(err);
            resolve(result);
        })
    })
    res.send({success: true});
}

async function FetchVehicleMaster(req, res, next) {
    const {searchinput} = req.query;

    let sql = ""
    if(searchinput)
        sql = `SELECT * FROM Toll_VehicleMaster WHERE v_type='${searchinput}' OR v_wt='${searchinput}'`
    else 
        sql = `SELECT * FROM Toll_VehicleMaster`
    const fetches = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) console.log(err);
            resolve(result);
        })
    })
    res.send({ success: true, data: fetches });
}

async function EditVehicleMaster(req, res, next) {
    const {v_type, v_wt, currdata} = req.body;
    
    const sql = `UPDATE Toll_VehicleMaster SET v_type='${v_type}', v_wt='${v_wt}' WHERE v_type='${currdata.v_type}' AND v_wt='${currdata.v_wt}'`
    const updates = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) console.log(err);
            resolve(result);
        })
    })
    res.send({ success: true });
}


module.exports = {AddVehicleMaster, FetchVehicleMaster, EditVehicleMaster};