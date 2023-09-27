const Hapi = require('@hapi/hapi');
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'}); // replace 'us-east-1' with your region

const lambda = new AWS.Lambda();

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: async (request, h) => {
      try {

        const lambdaParams = {
          FunctionName: 'divvybikes-lambda-dev-API_GATEWAY_LAMBDA',
          InvocationType: 'RequestResponse',
        };
        const lambdaResponse = await lambda.invoke(lambdaParams).promise();
        return h.response(lambdaResponse.Payload).code(200);
      } catch (error) {
        console.error(error);
        return h.response('Internal Server Error').code(500);
      }
    },
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();
