import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import {
  IAuthorizationPayload,
  signAuthorization,
  Unauthorized
} from "../common";

interface IAuthentication extends IAuthorizationPayload {
  name: string;
  email?: string;
}

export const handle: APIGatewayProxyHandler = async event => {
  if (!event.body) {
    return Unauthorized;
  }
  const { name, applications, email = "unknown@email.address" } = JSON.parse(
    event.body
  ) as Partial<IAuthentication>;
  if (!name || !applications) {
    return Unauthorized;
  }
  return {
    statusCode: 200,
    body: signAuthorization({ name, email, applications }, "1h")
  };
};
