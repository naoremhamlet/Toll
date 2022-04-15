const { conn } = require("./connection");

const queries = [
    `CREATE TABLE IF NOT EXISTS Toll_BoothTransaction (t_id varchar(255),e_code varchar(255),b_no varchar(255),l_no varchar(255), s_no varchar(255),v_type varchar(255),v_no varchar(255),j_type varchar(255),v_st_wt varchar(255),v_wt varchar(255), amount varchar(255),date datetime)`,
    `CREATE TABLE IF NOT EXISTS Toll_BoothMaster (boothno varchar(255), ipaddress varchar(255))`,
    `CREATE TABLE IF NOT EXISTS Toll_CompanyName (company varchar(255))`,
    `CREATE TABLE IF NOT EXISTS Toll_JourneyMaster (j_type varchar(255))`,
    `CREATE TABLE IF NOT EXISTS Toll_TollName (toll varchar(255))`,
    `CREATE TABLE IF NOT EXISTS Toll_TollPlazaFeeRules (v_type varchar(255), j_type varchar(255), amount varchar(255))`,
    `CREATE TABLE IF NOT EXISTS Toll_User (name varchar(255), pass varchar(255), empcode varchar(255), toll varchar(255), lane varchar(255))`,
    `CREATE TABLE IF NOT EXISTS Toll_VehicleMaster (v_type varchar(255), v_wt varchar(255))`,

]

async function CreateDb() {
    for(let i=0; i<queries.length; i++) {
        const sql = queries[i];
        const q = await new Promise((resolve, reject) => {
            conn.query(sql, (err, result) => {
                if(err) console.log(err)
                else resolve(result);
            })
        })
    }

    console.log("database ready");
}

module.exports = {CreateDb};