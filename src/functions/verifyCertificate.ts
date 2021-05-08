import { APIGatewayProxyHandler } from "aws-lambda";

import { document } from '../utils/dynamodbClient'

export const handle: APIGatewayProxyHandler = async (event) => {
  const { id } = event.pathParameters;

  const response = await document.query({
    TableName: 'users_certificates',
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': id,
    },
  }).promise();

  const userCertificated = response.Items[0];

  if (userCertificated) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Certificate is valid!',
        name: userCertificated.name,
        url: `https://certificate-generator-nelson-oak.s3.us-east-2.amazonaws.com/${id}.pdf`
      }),
      headers: {
        "Content-Type": "application/json",
      }
    };
  }


  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Certificate is invalid!',
    }),
    headers: {
      "Content-Type": "application/json",
    }
  };
}