const { conn } = require('../connection');

async function Authenticate(req, res, next) {
    const {username, password} = req.body;

    let sql = `SELECT * FROM Toll_User WHERE name='${username}' AND pass='${password}'`;

    const results = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) return res.send({success: false, msg: "something went wrong"})
            resolve(result);
        })
    })

    if(results.length > 0) {
        let toll,lane;
        if(results[0].toll==="all") {
            toll = await new Promise((resolve, reject) => {
                conn.query(`SELECT DISTINCT toll FROM Toll_User`, (err, result) => {
                    if(err) console.log(err);
                    resolve(result);
                })
            })
            toll = toll.map(el => el.toll);
            toll = toll.filter(el => el.toLowerCase()!="all")
        } else {
            toll = results[0].toll.split(',');
        }

        if(results[0].lane==="all") {
            lane = await new Promise((resolve, reject) => {
                conn.query(`SELECT DISTINCT lane FROM Toll_User`, (err, result) => {
                    if(err) console.log(err);
                    resolve(result);
                })
            })
            lane = lane.map(el => el.lane);
            lane = lane.filter(el => el.toLowerCase()!="all")
        } else {
            lane = results[0].lane.split(',');
        }

        res.send({success: true, toll: toll, lane: lane});
    } else {
        res.send({success: false, msg: "user name or password not available or incorrect"});
    }
}


module.exports = { Authenticate };