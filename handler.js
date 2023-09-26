

const Axios = require('axios');
const { Parser } = require('json2csv');
const { S3 } = require('aws-sdk');
const s3 = new S3();

const fetchData = async () => {
  console.log('Fetching Data...');
  const response = await Axios.get('https://gbfs.divvybikes.com/gbfs/en/station_information.json');
  console.log('Data Fetched Successfully');
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
  console.log('Saving to S3...');
  const bucketName = process.env.BUCKET_NAME;
  const params = {
    Bucket: bucketName,
    Key: 'output.csv',
    Body: csv,
  };
  return s3.upload(params).promise();
};

exports.handler = async (event, context) => {
  try {
    console.log('Handler Invoked');
    
    const data = await fetchData();
    const processedData = processData(data);
    
    const parser = new Parser();
    const csv = parser.parse(processedData);
    
    await saveToS3(csv);
    
    console.log('File uploaded to S3');
    return {
      statusCode: 200,
      body: JSON.stringify('File uploaded to S3'),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify('Internal Server Error'),
    };
  }
};
