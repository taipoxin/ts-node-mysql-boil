'use strict';

import makeDebug from 'debug';

const debug = makeDebug('app:controller');

import dbProvider from '../db/';
import utils from './utils';
import queries from './queries';
import ServerCodes from './server-codes';
const { db } = dbProvider;

/**
 * @route GET /get/all
 * @group global - global remote called operations
 * @returns {object} 200
 * @returns {Error}  when something broke error
 */
const getAll = async (req, res) => {
  try {
    const { sqlQuery } = queries;

    debug('req.query: ', req.query);
    let result;
    if (req.query.day) {
      if (req.query.day && Number.isInteger(+req.query.day)) {
        result = await db.doQuery(`${sqlQuery} WHERE day_of_week = ${req.query.day}`);
      } else {
        throw new Error('bad request');
      }
    } else {
      result = await db.doQuery(sqlQuery);
    }
    // debug('result: ', result);
    res.send(result);
  } catch (err) {
    debug(err);
    res.status(ServerCodes.SERVER_ERROR).send(err.message);
  }
};


const postLesson = async (req, res) => {
  try {
    debug(req.body);
    // const testObj = {
    //   count_number: '4',
    //   group_: '8К1391',
    //   options: 'toUpdate:true;',  // false
    //   subject_: 'Футурология',
    //   teacher: 'Бутрим',
    //   cabinet: '204', // 404
    //   day_of_week: '1',
    // };

    const obj = req.body;
    utils.validateRequest(obj);
    const opts = obj.options.split(';');
    const toUpdate = opts[0].split(':')[1];
    let result;
    if (toUpdate === 'true') {
      // check and update only, not insert
      await utils.updateTransaction(obj);
      result = 'OK';
    } else if (toUpdate === 'false') {
      // insert only
      await utils.insertTransaction(obj);
      result = 'OK';
    }

    debug('result: ', result);
    res.send(result);
  } catch (err) {
    debug(err);
    res.status(ServerCodes.SERVER_ERROR).send(err.message);
  }
};

/*eslint-disable */
/*
setTimeout(() => {
  postLesson({
    body: {
      count_number: '4',
      group_: '8К1391',
      options: 'toUpdate:true;',  // false
      subject_: 'Футурология',
      teacher: 'Бутрим',
      cabinet: '404', // 204
      day_of_week: '1',
  } },
    { status: () => ({ send: () => { } }) });
}, 1000);
*/
/* eslint-enable */

/**
 * @route POST /admin
 * @group tests - global remote called operations
 * @param {string} query.query.required - query
 * @returns {object} 200
 * @returns {Error}  when something broke error
 */
// TODO: FOR TESTS ONLY
const execQuery = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      throw new Error('bad request, not all body params provided');
    }
    const result = await db.doQuery(query);
    debug('result: ', result);
    res.send(result);
  } catch (err) {
    debug(err);
    res.status(ServerCodes.SERVER_ERROR).send(err.message);
  }
};

import path from 'path';

const login = async (req, res) => {
  try {
    const { pass } = req.body;
    debug(req.body);
    // false possitive timing attack
    // tslint:disable-next-line
    if (pass === process.env.USER_PASS) {
      debug('correct pass');
      res.set('Content-Type', 'text/html');
      res.render(path.join(__dirname, '../../../html/admin.html'));
      return;
    }

    res.redirect('/');
  } catch (err) {
    debug(err);
    res.status(ServerCodes.SERVER_ERROR).send(err.message);
  }
};


export default {
  getAll,
  postLesson,
  login,
};
