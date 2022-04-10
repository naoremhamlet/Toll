const { conn } = require("../connection");

async function AddTransaction(req, res, next) {
    console.log(req.body);

    res.send({success: true});
}

async function FetchPageCount(req, res, next) {
    const sql = `SELECT COUNT(*) AS Total FROM Toll_BoothTransaction`;

    const page = await new Promise((resolve, reject)=> {
        conn.query(sql, (err, result) => {
            if(err) console.log(err);
            resolve(result);
        })
    })

    res.send({success: true, pagecount: page[0].Total})

}

async function DeleteTransaction(req, res, next) {
    const {t_id} = req.body;
    // const sql = `DELETE FROM Toll_BoothTransaction WHERE t_id='${t_id}'`;
    const sql = `UPDATE Toll_BoothTransaction SET amount='0' WHERE t_id='${t_id}'`
    const deletes = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) console.log(err);
            resolve(result);
        })
    })

    res.send({success: true});
}

async function FetchTransaction(req, res, next) {
    const {boothno, from, to, page} = req.query;
    let sql = "SELECT * FROM Toll_BoothTransaction"
    if(boothno && from && to) {
        sql += ` WHERE b_no='${boothno}' AND date > '${from.split('T').join(' ')}' AND date < '${to.split('T').join(' ')}'`
    }
    else if(boothno && from) {
        sql += ` WHERE b_no='${boothno}' AND date > '${from.split('T').join(' ')}'`
    }
    else if(boothno && to) {
        sql += ` WHERE b_no='${boothno}' AND date < '${to.split('T').join(' ')}'`
    }
    else if(from && to) {
        sql += ` WHERE date > '${from.split('T').join(' ')}' AND date < '${to.split('T').join(' ')}'`
    }
    else if(boothno) {
        sql += ` WHERE b_no='${boothno}'`
    }
    else if(from) {
        sql += ` WHERE from='${from.split('T').join(' ')}'`
    }
    else if(to) {
        sql += ` WHERE to='${to.split('T').join(' ')}'`
    }

    if(page) {
        sql += ` LIMIT ${page*10-10}, ${page*10}`
    } else {
        sql += ` LIMIT 0,10`
    }

    const fetches = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) console.log(err);
            resolve(result);
        })
    })

    res.send({ success: true, data: fetches})
}

async function FetchRevenue(req, res, next) {
    let sql = `SELECT * FROM Toll_BoothTransaction`;

    const fetches = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) console.log(err);
            resolve(result);
        })
    })

    const boothnos = await new Promise((resolve, reject) => {
        conn.query(`SELECT DISTINCT b_no FROM Toll_BoothTransaction ORDER BY b_no`, (err, result) => {
            if(err) console.log(err);
            resolve(result);
        })
    })

    const vehicles = await new Promise((resolve, reject) => {
        conn.query(`SELECT DISTINCT v_type FROM Toll_BoothTransaction ORDER BY v_type`, (err, result) => {
            if(err) console.log(err);
            resolve(result);
        })
    })

    const data = new Object();
    for(let i=0; i<boothnos.length; i++) {
        data[`${boothnos[i].b_no}`] = new Object();
        data[`${boothnos[i].b_no}`]['boothno'] = boothnos[i].b_no;
        for(let j=0; j<vehicles.length; j++) {
            data[`${boothnos[i].b_no}`][`${vehicles[j].v_type}`] = parseInt('0');
        }
    }

    for(let i=0; i<fetches.length; i++) {
        data[fetches[i].b_no][fetches[i].v_type] += 1;
    }

    res.send({success: true, data: Object.values(data), boothnos: boothnos.map(el => el.b_no), vehicles: vehicles.map(el => el.v_type)});
}

module.exports = {AddTransaction, DeleteTransaction, FetchTransaction, FetchRevenue, FetchPageCount};