// const crypto = require("crypto");
const moment = require('moment');
const { conn } = require("../connection");


async function AddTransaction(req, res, next) {
    const {vehicle, type, journey, s_weight, lane, username, booth, weight, amount} = req.body;
    const t_id = (moment().unix()).toString();
    const e_code = await fetchempcode(username);

    const date = moment().format('YYYY-MM-DD HH:mm:ss');

    const shift = generateShift();

    const values = `'${t_id}','${e_code}','${booth}','${lane}','${shift}','${type}','${vehicle}','${journey}','${s_weight}','${weight}','${amount}','${date}'`
    
    let sql = `INSERT INTO Toll_BoothTransaction VALUES (${values})`
    let inserts = await new Promise((resolve, reject)=> {
        conn.query(sql, (err, result) => {
            if(err) return res.send(404).json({message: "something went wrong"});
            resolve(result);
        })
    })

    res.status(200).json({success : true,trxnid: t_id, date: date});
}

function generateShift() {

    var currentHour = moment().format("HH");
  
    if (currentHour < 12){
        return "Shift-1"
    } else {
        return "Shift-2"
    }
}
  

// async function fetchamount(type, journey) {
//     let sql = `SELECT amount FROM Toll_User WHERE v_type='${type}' AND `
//     let usertable = await new Promise((resolve, reject)=> {
//         conn.query(sql, (err, result) => {
//             if(err) console.log(err);
//             resolve(result);
//         })
//     })
// }

async function fetchempcode(user) {
    let sql = `SELECT empcode AS e_code FROM Toll_User WHERE name='${user}'`
    let usertable = await new Promise((resolve, reject)=> {
        conn.query(sql, (err, result) => {
            if(err) console.log(err);
            resolve(result);
        })
    })

    return usertable[0].e_code;
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
