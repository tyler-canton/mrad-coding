# mrad-coding

This project is a Node.js application leveraging AWS Lambda and several AWS services to create a scalable and efficient application.

## Table of Contents
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Deploying](#deploying)
- [Built With](#built-with)
- [License](#license)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- AWS CLI
- Serverless Framework
- AWS Account

### Installation

1. **Clone the repo**
   ```sh
   git clone https://github.com/tyler-canton/mrad-coding


2. **Set Up AWS Credentials**

Configure your AWS credentials locally using the AWS CLI.

    ```sh
    aws configure

## Usage

### handler.js

`handler.js` contains the AWS Lambda function handler. This file is responsible for managing the interactions between AWS Lambda and other AWS services, such as S3, DynamoDB, SNS/SQS, etc.

### server.js

`server.js` is the entry point of the application when running locally. It sets up a local server using Hapi.js and routes the incoming HTTP requests to the appropriate Lambda function handler.

To run the application locally, execute the following command:

```sh
node server.js

This will start a local server at http://localhost:3000.

Deploying
To deploy the application to AWS Lambda, use the Serverless Framework with the following command:

sh
Copy code
sls deploy
This command will package the application, create the necessary AWS resources, and deploy the Lambda function.

Built With
Node.js
AWS Lambda
AWS S3
AWS DynamoDB
AWS SNS/SQS
AWS AppSync
React
AWS CDK/CloudFormation
License
This project is licensed under the MIT License - see the LICENSE.md file for details.