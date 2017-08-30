var config = require('../config/');
var mysql = require('mysql');
module.exports = mysql.createConnection(
  config.database
);