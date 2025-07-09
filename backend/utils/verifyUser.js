import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
export const verifyToken = (req, res, next) => {
  // console.log(req.cookies.access_token);

  let token = req.cookies.access_token;

  // console.log(token);

  if (
    !token &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(errorHandler(401, "token not found"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, "token is not valid"));
    }
    req.user = {
      id: user.id,
      role: user.role,
    };
    next();
  });
};
