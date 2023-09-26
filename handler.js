const Hapi = require('@hapi/hapi');
const Axios = require('axios');
const { Parser } = require('json2csv');
const { S3 } = require('aws-sdk');
const awsServerlessExpress = require('aws-serverless-express');
const s3 = new S3();

const fetchData = async () => {
  const response = await Axios.get('https://gbfs.divvybikes.com/gbfs/en/station_information.json');
   console.log('RESP::::::::::::::::::::',response);
  return response.data.data.stations;

};

const processData = (data) => {
  return data.filter(station => station.capacity < 12).map(station => {
    delete station.rental_methods;
    delete station.rental_uris;
    
    station.externalId = station.external_id;
    delete station.external_id;
    
    station.stationId = station.station_id;
    delete station.station_id;
    
    station.legacyId = station.legacy_id;
    delete station.legacy_id;

    return station;
  });
};

const saveToS3 = async (csv) => {
  const bucketName = process.env.BUCKET_NAME;
  const params = {
    Bucket: bucketName,
    Key: 'output.csv',
    Body: csv,
  };
  return s3.upload(params).promise();
};

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
        const data = await fetchData();
        const processedData = processData(data);
        
        const parser = new Parser();
        const csv = parser.parse(processedData);
        
        await saveToS3(csv);
        
        return h.response('File uploaded to S3').code(200);
      } catch (error) {
        console.error(error);
        return h.response('Internal Server Error').code(500);
      }
    },
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
  return server;
};

const serverPromise = (async () => {
  return await init();
})();

const serverProxyPromise = serverPromise.then(server => {
  return awsServerlessExpress.createServer(server.listener);
});

exports.handler = async (event, context) => {
  const serverProxy = await serverProxyPromise;
  return awsServerlessExpress.proxy(serverProxy, event, context, 'PROMISE').promise;
};
