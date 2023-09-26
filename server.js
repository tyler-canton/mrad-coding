const Hapi = require('@hapi/hapi');
const AWS = require('aws-sdk');
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
        const lambdaFunctionName = process.env.LAMBDA_FUNC_NAME;

        // Invoke Lambda function
        const lambdaParams = {
          FunctionName: lambdaFunctionName,
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
