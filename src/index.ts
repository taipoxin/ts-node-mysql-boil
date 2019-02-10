'use strict';

import makeDebug from './debug';
import app from './app';

const debug = makeDebug('app:index');


if (!process.env.TEST) {
  app.startAppListen();
}

function testF(x: number, y: number): number {
  return x * y;
}


export default testF;
