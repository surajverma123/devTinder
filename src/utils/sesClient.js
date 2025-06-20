const  { SESClient } = require('@aws-sdk/client-ses');
require('dotenv').config();

// Set the AWS Region.
const REGION = 'eu-north-1';

const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;

// Create SES service object.
const sesClient = new SESClient({
    region: REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY  ,
    }
});

module.exports = { sesClient };
// snippet-end:[ses.JavaScript.createclientv3]