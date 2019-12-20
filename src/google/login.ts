import { APIGatewayProxyHandler } from "aws-lambda";
import * as jwt from "jsonwebtoken";
import fetch from "node-fetch";
import "source-map-support/register";
import { Unauthorized } from "../common";

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

const expiresIn = "7d";

export const handle: APIGatewayProxyHandler = async event => {
  if (!event.body) {
    return Unauthorized;
  }
  const body = JSON.parse(event.body) as { token: string };
  if (!body || !body.token) {
    return Unauthorized;
  }

  let response: IGoogleProfile | IGoogleApiError;
  try {
    response = await fetch(`${googleProfileApi}${body.token}`).then(r =>
      r.json()
    );
  } catch (error) {
    console.error(`Error while getProfile`, error);
    return Unauthorized;
  }

  if ((response as IGoogleApiError).error) {
    console.error(
      `Invalid accessToken`,
      body.token,
      response as IGoogleApiError
    );
    return Unauthorized;
  }

  const profile = response as IGoogleProfile;
  return {
    statusCode: 200,
    body: jwt.sign(
      {
        name: profile.name,
        email: profile.email
      },
      process.env.JWT_SECRET_KEY!,
      { expiresIn }
    )
  };
};
