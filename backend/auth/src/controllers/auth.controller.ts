import { Request, Response } from "express";
import { UserValidationError } from "../config/errors/UserValidationError";
import { keys } from "../config/keys";
import { User, IUserDocument } from "../models/user.model";

export const registerUser = async (req: Request, res: Response) => {
  const { error } = User.validateRegister(req.body);
  if (error) {
    throw new UserValidationError(error);
  }

  const user = User.build(req.body);

  await user.save();

  sendCookieWithJwt(user, 201, res);
};

export const loginUser = async (req: Request, res: Response) => {
  res.status(200).send({ success: true });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  res.status(200).send({ success: true });
};

const sendCookieWithJwt = (
  user: IUserDocument,
  statusCode: number,
  res: Response
) => {
  const token = user.getAuthToken();

  const options = {
    expires: new Date(
      Date.now() + Number(keys.jwtCookieExpire) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: false,
  };

  if (keys.nodeEnv === "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, items: [user], totalCount: 1 });
};
