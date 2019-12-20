import { APIGatewayProxyHandler } from "aws-lambda";
import * as jwt from "jsonwebtoken";
import { Unauthorized } from "../common";

const expiresIn = "1h";

export const handle: APIGatewayProxyHandler = async event => {
  if (!event.body) {
    return Unauthorized;
  }
  const body = JSON.parse(event.body) as { name: string };
  if (!body || !body.name) {
    return Unauthorized;
  }
  const { name } = body;
  return {
    statusCode: 200,
    body: jwt.sign({ name }, process.env.JWT_SECRET_KEY!, { expiresIn })
  };
};
