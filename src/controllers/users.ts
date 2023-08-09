import { Request, Response, NextFunction } from 'express';
import { UpdatePayload, UserPayload } from '../domains/requests/userPayload';
import * as HttpStatus from 'http-status-codes';
import * as userServices from '../services/users';
import config from '../config/config';
import LoginPayload from '../domains/requests/loginPayload';

const { messages } = config;

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userPayload = req.body as UserPayload;
    const users = await userServices.register(userPayload);

    res.status(HttpStatus.StatusCodes.CREATED).json({
      success: true,
      data: users,
      messages: messages.auth.signupSuccess,
    });
  } catch (err) {
    next(err);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const user = req.body as LoginPayload;

    const data = await userServices.login(user);
    res.status(HttpStatus.StatusCodes.OK).json({
      success: true,
      data,
      message: messages.auth.loginSuccess,
    });
  } catch (err) {
    next(err);
  }
}

export async function fetchUserDetails(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await userServices.fetchUserById(
      res.locals.loggedInPayload.userId
    );
    res.status(HttpStatus.StatusCodes.OK).json({
      success: true,
      data,
      messages: messages.users.fetch,
    });
  } catch (err) {
    next(err);
  }
}

export async function update(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const updatePayload = req.body as UpdatePayload;

    const data = await userServices.update(
      res.locals.loggedInPayload.userId,
      updatePayload
    );
    res.status(HttpStatus.StatusCodes.OK).json({
      success: true,
      data,
      messages: messages.users.update,
    });
  } catch (err) {
    next(err);
  }
}
