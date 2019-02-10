'use strict';

import makeDebug from 'debug';
import controllers from '../controllers';

const { controller } = controllers;
const debug = makeDebug('app:routes');

export default function (app) {
  app.route('/get/all')
    .get(controller.getAll);
  app.route('/lessons')
    .post(controller.postLesson);
  app.route('/login')
    .post(controller.login);
  app.route('/')
    .get((req, resp) => { resp.render('index.html'); });
}
