'use strict';

import makeDebug from 'debug';
import express from 'express';
import swaggerGen from 'express-swagger-generator';
import bodyParser from 'body-parser';
import path from 'path';
import routes from './api/routes';
import packageJ from '../package.json';
import swaggerOpt from './swagger-opt';
import helmet from 'helmet';


const debug = makeDebug('app:app');

// tslint:disable-next-line
const port = process.env.PORT || 8080;
const { version } = packageJ;


function startAppListen() {
  const app = express();

  // swagger
  const expressSwagger = swaggerGen(app);
  const options = swaggerOpt.genOptions(port, version);

  expressSwagger(options);

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(helmet());
  app.use(express.static('html/public_html'));
  app.set('views', path.join(__dirname, '../html'));
  app.engine('html', require('ejs').renderFile);

  app.set('view engine', 'html');
  routes(app); // register the route


  app.listen(port, () => {
    debug(`API server started on: ${port}`);
  });
}
export default { startAppListen };
