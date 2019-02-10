/*tslint:disable */

'use strict';

import dotenv from 'dotenv';

process.env.TEST = 'NO_DB NO_SERVER';
import testF from '../src/index';



test('should return 6', () => {
  expect(testF(3, 2)).toBe(6);
})