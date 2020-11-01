import * as jwt from "jsonwebtoken";

export const Unauthorized = { statusCode: 401, body: "Unauthorized" };

export interface AuthorizationPayload {
  application: string;
}

interface Authorization extends AuthorizationPayload {
  name: string;
  email: string;
}

export function signAuthorization(
  { name, email, application }: Authorization,
  expiresIn: string | number | undefined
): string {
  return jwt.sign({ name, email, application }, process.env.JWT_SECRET_KEY!, {
    expiresIn,
  });
}
