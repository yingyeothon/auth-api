import "source-map-support/register";

import {
  AuthorizationPayload,
  Unauthorized,
  signAuthorization,
} from "../common";

import { APIGatewayProxyHandler } from "aws-lambda";
import fetch from "node-fetch";

const googleProfileApi = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=`;

interface GoogleProfile {
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

interface GoogleApiError {
  error: {
    code: number;
    message: string;
    status: string;
  };
}

interface Authentication extends AuthorizationPayload {
  token: string;
}

export const handle: APIGatewayProxyHandler = async (event) => {
  if (!event.body) {
    return Unauthorized;
  }
  const { token, applications } = JSON.parse(event.body) as Authentication;
  if (!token || !applications) {
    return Unauthorized;
  }

  let response: GoogleProfile | GoogleApiError;
  try {
    response = await fetch(`${googleProfileApi}${token}`).then((r) => r.json());
  } catch (error) {
    console.error(`Error while getProfile`, error);
    return Unauthorized;
  }

  if ((response as GoogleApiError).error) {
    console.error(`Invalid accessToken`, token, response as GoogleApiError);
    return Unauthorized;
  }

  const { name, email } = response as GoogleProfile;
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: signAuthorization({ name, email, applications }, "7d"),
  };
};
