import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import { errorMessages } from "./constants";
import { MyContext } from "./MyContext";
import { AuthenticationError } from "apollo-server-express";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"];
  if (!authorization) {
    throw new AuthenticationError(errorMessages.notAuthenticated);
  }
  try {
    const token = authorization.split(" ")[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = payload as any;
  } catch (e) {
    console.log(e);
    throw new AuthenticationError(errorMessages.notAuthenticated);
  }

  return next();
};
