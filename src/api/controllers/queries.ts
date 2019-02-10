'use strict';

import makeDebug from 'debug';

const debug = makeDebug('app:controller:queries');


const sqlQuery = `SELECT lessons.id, deps.name as deps, gr.name as group_,
lessons.day_of_week, lessons.count_number,
teach.name as teacher, subj.name as subject_, lessons.cabinet
FROM lessons
inner join departments as deps on lessons.dep = deps.id
inner join groups as gr on lessons.group_ = gr.id
inner join subjects as subj on lessons.subject_ = subj.id
inner join teachers as teach on lessons.teacher = teach.id`;

// tslint:disable
function genInsertSQLQuery(group, day, count, teacher, subject, cabinet) {
  return `INSERT INTO lessons (
    dep,
    group_,
    day_of_week,
    count_number,
    teacher,
    subject_,
    cabinet
    ) VALUES (
    (select id from departments where name = 'компьютерных технологий'),
    (select id from groups where name = '${group}'),
    ${day},
    ${count},
    (select id from teachers where name = '${teacher}'),
    (select id from subjects where name = '${subject}'),
    '${cabinet}'
    );`;
}
// tslint:enable

function genInsertQuery(o) {
  return genInsertSQLQuery(o.group_, o.day_of_week, o.count_number,
    o.teacher, o.subject_, o.cabinet);
}


function genUpdateSQLQuery(id, teacher, subject, cabinet) {
  return `UPDATE lessons SET
    teacher = (select id from teachers where name = '${teacher}'),
    subject_ = (select id from subjects where name = '${subject}'),
    cabinet = '${cabinet}'
    where id = ${id}`;
}

function genUpdateQuery(id, o) {
  return genUpdateSQLQuery(id, o.teacher, o.subject_, o.cabinet);
}


export default {
  sqlQuery,
  genInsertQuery,
  genUpdateQuery,
};
