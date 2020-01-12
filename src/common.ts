import * as jwt from "jsonwebtoken";

export const Unauthorized = { statusCode: 401, body: "Unauthorized" };

export interface IAuthorizationPayload {
  applications: string[];
}

interface IAuthorization extends IAuthorizationPayload {
  name: string;
  email: string;
}

export const signAuthorization = (
  { name, email, applications }: IAuthorization,
  expiresIn: string | number | undefined
) =>
  jwt.sign({ name, email, applications }, process.env.JWT_SECRET_KEY!, {
    expiresIn
  });
