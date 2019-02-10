'use strict';

import mysql from 'mysql';
import makeDebug from 'debug';

const debug = makeDebug('app:mysql');

interface MysqlProvide {
  connection;
  startConnection():void;
  doQuery(query:any);
}

class MysqlProvider implements MysqlProvide {
  public connection;

  public static validateEnv() {
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
  }

  public startConnection() {
    MysqlProvider.validateEnv();
    // TODO: fix it
    // tslint:disable-next-line
    if (process.env.MYSQL_PASS === 'space') {
      process.env.MYSQL_PASS = ' ';
    }

    this.connection = mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS,
      database: process.env.MYSQL_DB,
    });

    this.connection.connect((err) => {
      if (err) {
        debug(`error connecting: ${err.stack}`);
        return;
      }
      debug(`connected as id ${this.connection.threadId}`);
    });

    this.connection.on('error', (err) => {
      debug('[mysql error]', err);
    });
  }

  public doQuery(query) {
    if (!this.connection) {
      this.startConnection();
    }
    return new Promise((resolve, reject) => {
      this.connection.query(query, (err, result, fields) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  }
}

export default MysqlProvider;
