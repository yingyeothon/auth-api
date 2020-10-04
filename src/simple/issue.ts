import "source-map-support/register";

import {
  AuthorizationPayload,
  Unauthorized,
  signAuthorization,
} from "../common";

import { APIGatewayProxyHandler } from "aws-lambda";

interface Authentication extends AuthorizationPayload {
  name: string;
  email?: string;
}

export const handle: APIGatewayProxyHandler = async (event) => {
  if (!event.body) {
    return Unauthorized;
  }
  const { name, applications, email = "unknown@email.address" } = JSON.parse(
    event.body
  ) as Partial<Authentication>;
  if (!name || !applications) {
    return Unauthorized;
  }
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: signAuthorization({ name, email, applications }, "1h"),
  };
};
