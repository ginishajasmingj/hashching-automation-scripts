const mysql = require('mysql');
const express = require('express');
const userRouter = express.Router();

var connection = mysql.createConnection({

  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'hashching',
  dateStrings: true,
});

const executeQuery = (query, parameters) => {
  return new Promise(function (resolve, reject) {
    try {
      connection.query(query, parameters, function (error, results, fields) {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    } catch (err) {
      console.log(JSON.stringify(err))
      reject(err);
    }
  });
};


const getUserDetails = async (req, res) => {
  try {
    let responseValue = {};
    let bidLeadHistory_id = [];
    let qry = '';
    let qryRes = '';

    // // Create column in bidlead history table
    // qry = `alter table bid_lead_history add bid_type varchar(45) null`;
    // qryRes = await executeQuery(qry, []);

    // Fetch all user IDs from the bidlead history table
    qry = `SELECT bid_lead_history.id FROM bid_lead_history WHERE bid_type IS NULL`;
    qryRes = await executeQuery(qry, []);
    bidLeadHistory_id.push(qryRes)
    bidLeadHistory_id = Object.values(qryRes)
    console.log("[getUserDetails] -->bidLeadHistory_id",bidLeadHistory_id);

    bidLeadHistory_id.forEach(async (data) => {
      let qry = '';
      let qryRes = '';
      qry = `update bid_lead_history set bid_type = 'manual' where bid_lead_history.id = '${data.id}'`;
      qryRes = await executeQuery(qry, [])
    })

    responseValue = {
      success: true,
      data: bidLeadHistory_id
    }

    return await res.status(200).json({
      success: true,
      data: responseValue
    })

  } catch (error) {
    return res.status(403).json({
      success: false,
      data: error
    })
  }
}


userRouter.get('/', getUserDetails);
module.exports = userRouter