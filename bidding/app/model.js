const mysql = require('mysql');
const express = require('express');
const userRouter = express.Router();
const { get, first } = require('lodash');

let _get = (object, path, defaultValue = '') => get(object, path, defaultValue)

let _first = (array) => first(array);

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
    let bidlead_history_id = [];
    let qry = '';
    let qryRes = '';

    // Fetch all user IDs from the bidlead history table
    qry = `SELECT bid_lead_history.id FROM bid_lead_history WHERE bid_type IS NULL`;
    qryRes = await executeQuery(qry, []);
    bidlead_history_id.push(qryRes)
    bidlead_history_id = Object.values(qryRes)
    console.log("[getUserDetails] -->bidlead_history_id",bidlead_history_id);

    bidlead_history_id.forEach(async (data) => {
      let qry = '';
      let qryRes = '';
      qry = `update bid_lead_history set bid_type = 'manual' where bid_lead_history.id = '${data.id}'`;
      qryRes = await executeQuery(qry, [])
    })

    responseValue = {
      success: true,
      data: bidlead_history_id
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