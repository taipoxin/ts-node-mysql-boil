'use strict';

/**
 * module that configure debug module dinamically
 * using .env file reading
 */

import dotenv from 'dotenv';

import dbg from 'debug';
import moment from 'moment';

dotenv.load();


const dateFormat = 'YYYY-MM-DD HH:MM:ss';

/*tslint:disable */
function formatArgs(args) {
  const name = this.namespace;
  const useColors = this.useColors;
  const dateTime = `[${moment().format(dateFormat)}]`;
  if (useColors) {
    const c = this.color;
    const colorCode = `\u001b[3${c < 8 ? c : `8;5;${c}`}`;
    const prefix = ` ${colorCode};1m${name} ` + '\u001b[0m';
    args[0] = dateTime + prefix + args[0].split('\n').join(`${'\n' + '                       '}${prefix}`);
    args.push(`${colorCode}m+${dbg.humanize(this.diff)}\u001b[0m`);
  } else {
    args[0] = `${dateTime + name} ${args[0].split('\n').join(`${'\n' + '                       '}${name}`)}`;
  }
}
/* tslint:enable */


dbg.formatArgs = formatArgs;

if (process.env.DEBUG) {
  // console.log(process.env.DEBUG)
  dbg.enable(process.env.DEBUG);
}
const makeDebug = dbg;

export default makeDebug;
