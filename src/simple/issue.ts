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
  const parsed = JSON.parse(event.body) as Partial<
    Authentication & { applications?: string[] }
  >;
  const { name, email = "unknown@email.address", applications } = parsed;
  if (!name) {
    return Unauthorized;
  }

  let { application } = parsed;
  if (!application) {
    if (!applications || applications.length > 1) {
      return Unauthorized;
    }
    // Support legacy call.
    application = applications[0];
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: signAuthorization({ name, email, application }, "1h"),
  };
};
