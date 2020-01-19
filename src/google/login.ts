import { APIGatewayProxyHandler } from "aws-lambda";
import fetch from "node-fetch";
import "source-map-support/register";
import {
  IAuthorizationPayload,
  signAuthorization,
  Unauthorized
} from "../common";

const googleProfileApi = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=`;

interface IGoogleProfile {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  link: string;
  picture: string;
  locale: string;
  hd: string;
}

interface IGoogleApiError {
  error: {
    code: number;
    message: string;
    status: string;
  };
}

interface IAuthentication extends IAuthorizationPayload {
  token: string;
}

export const handle: APIGatewayProxyHandler = async event => {
  if (!event.body) {
    return Unauthorized;
  }
  const { token, applications } = JSON.parse(event.body) as IAuthentication;
  if (!token || !applications) {
    return Unauthorized;
  }

  let response: IGoogleProfile | IGoogleApiError;
  try {
    response = await fetch(`${googleProfileApi}${token}`).then(r => r.json());
  } catch (error) {
    console.error(`Error while getProfile`, error);
    return Unauthorized;
  }

  if ((response as IGoogleApiError).error) {
    console.error(`Invalid accessToken`, token, response as IGoogleApiError);
    return Unauthorized;
  }

  const { name, email } = response as IGoogleProfile;
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: signAuthorization({ name, email, applications }, "7d")
  };
};
