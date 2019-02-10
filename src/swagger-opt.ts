'use strict';

function genOptions(port, packageVersion) {
  const options = {
    swaggerDefinition: {
      info: {
        description: 'API',
        title: 'Admin panel API',
        version: `${packageVersion}`,
      },
      host: `localhost:${port}`,
      basePath: '/',
      produces: [
        'application/json',
        'application/xml',
      ],
      schemes: ['http', 'https'],
      securityDefinitions: {
        JWT: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: '',
        },
      },
    },
    basedir: __dirname, // app absolute path
    files: ['./api/controllers/**/*.js'], // Path to the API handle folder
  };
  return options;
}
export default { genOptions };
