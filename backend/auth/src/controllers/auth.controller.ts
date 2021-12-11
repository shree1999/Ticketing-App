import { Request, Response } from "express";
import { UserValidationError } from "../config/errors/UserValidationError";
import { keys } from "../config/keys";
import { User, IUserDocument } from "../models/user.model";

/**
 * @route  -> POST /api/users/v1/register
 * @access -> public
 */

export const registerUser = async (req: Request, res: Response) => {
  const { error } = User.validateRegister(req.body);
  if (error) {
    throw new UserValidationError(error);
  }

  const user = User.build(req.body);

  await user.save();

  sendCookieWithJwt(user, 201, res);
};

/**
 * @route  -> POST /api/users/v1/login
 * @access -> public
 */
export const loginUser = async (req: Request, res: Response) => {
  const { error } = User.validateLogin(req.body);
  if (error) {
    throw new UserValidationError(error);
  }

  const user = await User.getUser(req.body);

  sendCookieWithJwt(user, 200, res);
};

/**
 * @route  -> GET /api/users/v1
 * @access -> private
 */
export const getCurrentUser = async (req: Request, res: Response) => {
  res.status(200).send({ success: true, items: [req.user], totalCount: 1 });
};

/**
 * @route  -> POST /api/users/v1
 * @access -> private
 */
export const logoutUser = (req: Request, res: Response) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ success: true, items: [], totalCount: 0 });
};

/**
 *
 * @param { IUserDocument } user user document
 * @param { number } statusCode http status code
 * @param { Request } res express response object
 */

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
