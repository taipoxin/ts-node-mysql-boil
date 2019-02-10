'use strict';

import makeDebug from 'debug';


import dbProvider from '../db';
import queries from './queries';

const debug = makeDebug('app:controller:utils');
const { db } = dbProvider;

function validateRequest(object) {
  if (!object.count_number
    || !object.group_
    || !object.options
    || !object.subject_
    || !object.teacher
    || !object.cabinet
    || !object.day_of_week
  ) {
    throw new Error('bad request, not all body params provided');
  }
}

// tslint:disable
async function updateTransaction(object) {
  const ifLessonExists = `SELECT id FROM lessons where
    group_ = (SELECT id FROM groups where name = '${object.group_}')
    and day_of_week = ${object.day_of_week}
    and count_number = ${object.count_number}`;

  const ifSubjectExists = `SELECT id from subjects where name = '${object.subject_}'`;
  const insertSubject = `insert into subjects (name) values ('${object.subject_}')`;
  const ifTeacherExists = `SELECT id from teachers where name = '${object.teacher}'`;
  const insertTeacher = `insert into teachers (name) values ('${object.teacher}')`;
  

  try {
    await db.connection.beginTransaction();

    const lessonExists:any = await db.doQuery(ifLessonExists);
    
    if (lessonExists.length === 0) {
      throw new Error('lesson does not exists');
    }
    if (lessonExists.length > 1) {
      debug(`WARNING: lessons with same group_,
      day_of_week and count_number more than one`);
      debug(lessonExists);
    }

    debug(ifSubjectExists);
    let result:any = await db.doQuery(ifSubjectExists);

    debug(result);
    if (result.length === 0) {
      debug(insertSubject);
      result = await db.doQuery(insertSubject);
      debug(result, console.trace());
    }

    debug(ifTeacherExists);
    result = await db.doQuery(ifTeacherExists);

    debug(result);
    if (result.length === 0) {
      debug(insertTeacher);
      result = await db.doQuery(insertTeacher);
      debug(result, console.trace());
    }


    const lessonId = lessonExists[0].id;
    debug(lessonExists);
    debug(lessonId);
    const sqlUpdateLesson = queries.genUpdateQuery(lessonId, object);
    debug(sqlUpdateLesson);
    result = await db.doQuery(sqlUpdateLesson);
    debug(result, console.trace());

    await db.connection.commit();
    debug('transaction complete');
  } catch (err) {
    debug(err);
    db.connection.rollback();
    throw new Error('error on transaction');
  }
}


async function insertTransaction(object) {
  const ifSubjectExists = `SELECT id from subjects where name = '${object.subject_}'`;
  const insertSubject = `insert into subjects (name) values ('${object.subject_}')`;
  const ifTeacherExists = `SELECT id from teachers where name = '${object.teacher}'`;
  const insertTeacher = `insert into teachers (name) values ('${object.teacher}')`;

  const ifLessonExists = `SELECT id FROM lessons where
    group_ = (SELECT id FROM groups where name = '${object.group_}')
    and day_of_week = ${object.day_of_week}
    and count_number = ${object.count_number}`;

  try {
    await db.connection.beginTransaction();

    debug(ifSubjectExists);

    let result:any = await db.doQuery(ifSubjectExists);

    debug(result);
    if (result.length === 0) {
      debug(insertSubject);
      result = await db.doQuery(insertSubject);
      debug(result, console.trace());
    }

    debug(ifTeacherExists);
    result = await db.doQuery(ifTeacherExists);

    debug(result);
    if (result.length === 0) {
      debug(insertTeacher);
      result = await db.doQuery(insertTeacher);
      debug(result, console.trace());
    }

    const lessonExists:any = await db.doQuery(ifLessonExists);
    if (lessonExists.length !== 0) {
      throw new Error('lesson already exists');
    }

    const sqlInsertLesson = queries.genInsertQuery(object);
    result = await db.doQuery(sqlInsertLesson);
    debug(result, console.trace());

    await db.connection.commit();
    debug('transaction complete');
  } catch (err) {
    debug(err);
    db.connection.rollback();
    throw new Error('error on transaction');
  }
}


export default {
  insertTransaction,
  updateTransaction,
  validateRequest,

};
