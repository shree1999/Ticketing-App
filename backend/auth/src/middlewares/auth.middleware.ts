import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NotAuthorizeError } from "../config/errors/NotAuthorizeError";
import { keys } from "../config/keys";
import { User, IUserDocument } from "../models/user.model";

interface IPayload extends JwtPayload {
  id: string;
}

// For adding user in request object
declare global {
  namespace Express {
    interface Request {
      user: IUserDocument;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  let token = "";
  if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new NotAuthorizeError("Not Authorize to access this route");
  }

  const decoded = jwt.verify(token, keys.jwtSecret!) as IPayload;

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new NotAuthorizeError("Not Authorize to access this route");
  }

  req.user = user;

  next();
};
