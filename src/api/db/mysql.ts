'use strict';

import mysql from 'mysql';
import makeDebug from 'debug';

const debug = makeDebug('app:mysql');

function startDBConnection() {
  if (!process.env.MYSQL_HOST) {
    throw new Error('MYSQL_HOST is not specified');
  }
  if (!process.env.MYSQL_USER) {
    throw new Error('MYSQL_USER is not specified');
  }
  if (!process.env.MYSQL_PASS) {
    throw new Error('MYSQL_PASS is not specified');
  }
  if (!process.env.MYSQL_DB) {
    throw new Error('MYSQL_DB is not specified');
  }
  // TODO: fix it
  // tslint:disable-next-line
  if (process.env.MYSQL_PASS === 'space') {
    process.env.MYSQL_PASS = ' ';
  }

  const con = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
  });

  con.connect((err) => {
    if (err) {
      debug(`error connecting: ${err.stack}`);
      return;
    }
    debug(`connected as id ${con.threadId}`);
  });

  con.on('error', (err) => {
    debug('[mysql error]', err);
  });

  return con;
}


let connection = startDBConnection();


function doQuery(query) {
  if (!connection) {
    connection = startDBConnection();
  }
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result, fields) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}


export default {
  doQuery,
  connection,
};
