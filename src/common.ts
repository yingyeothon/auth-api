import * as jwt from "jsonwebtoken";

export const Unauthorized = { statusCode: 401, body: "Unauthorized" };

export interface AuthorizationPayload {
  applications: string[];
}

interface Authorization extends AuthorizationPayload {
  name: string;
  email: string;
}

export function signAuthorization(
  { name, email, applications }: Authorization,
  expiresIn: string | number | undefined
): string {
  return jwt.sign({ name, email, applications }, process.env.JWT_SECRET_KEY!, {
    expiresIn,
  });
}
