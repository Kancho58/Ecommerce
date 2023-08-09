import {
  UserPayload,
  FetchUsers,
  UpdatePayload,
} from '../domains/requests/userPayload';
import knex from '../config/knex';
import logger from '../utils/logger';
import BadRequestError from '../exceptions/BadRequestError';
import Table from '../resources/enums/Table';
import * as object from '../utils/object';
import * as bcrypt from '../utils/bcrypt';
import LoginPayload from '../domains/requests/loginPayload';
import * as jwt from '../utils/jwt';

export async function register(userPayload: UserPayload): Promise<UserPayload> {
  try {
    const { email } = userPayload;
    const password = await bcrypt.hash(userPayload.password);

    const user = await knex(Table.USERS).where(
      knex.raw('LOWER(email) =?', email.toLowerCase())
    );

    if (user.length) {
      logger.log('info', 'Users already exists');
      throw new BadRequestError('User already exists');
    }

    logger.log('info', 'User inserting');
    const newUser = await knex(Table.USERS)
      .insert(object.toSnakeCase({ ...userPayload, password, roleId: 2 }))
      .returning(['name', 'email']);
    logger.log('info', 'User successfully inserted');

    return object.camelize(newUser[0]);
  } catch (err) {
    throw err;
  }
}

export async function login(loginPayload: LoginPayload): Promise<LoginPayload> {
  try {
    const { email, password } = loginPayload;

    logger.log('info', 'Fetching user');
    const [user] = object.camelize(
      await knex(Table.USERS).where(
        knex.raw('LOWER(email) =?', email.toLowerCase())
      )
    );
    if (!user) {
      throw new BadRequestError('User not found');
    }
    logger.log('info', 'Comparing users password');

    const isPasswordValidate = await bcrypt.compare(
      password,
      user.password || ''
    );

    if (!isPasswordValidate) {
      logger.log('info', 'Credential does not match');
      throw new BadRequestError('Credential does not match');
    }

    logger.log('info', 'Generating access token');

    const accessToken = jwt.generateAccessToken({
      email: user.email,
      name: user.name,
      userId: user.id,
      roleId: user.roleId,
    });

    return object.camelize({
      id: user.id,
      email,
      accessToken,
    });
  } catch (error) {
    throw error;
  }
}

export async function fetchUserById(userId: number): Promise<FetchUsers> {
  const users = await knex(Table.USERS).where('id', userId);

  if (!users.length) {
    logger.log('info', 'User not found');
    throw new BadRequestError('User not found');
  }

  logger.log('info', 'user fetched successfully');

  const user = users[0];

  return object.camelize({ id: user.id, name: user.name, email: user.email });
}

export async function update(
  userId: number,
  updatePayload: UpdatePayload
): Promise<UpdatePayload> {
  try {
    const { name } = updatePayload;
    const password = await bcrypt.hash(updatePayload.password);

    logger.log('info', 'Fetching User');
    const users = await knex(Table.USERS).where('id', userId);

    if (!users.length) {
      logger.log('info', 'User not found');
      throw new BadRequestError('User not found');
    }
    const updatedUser = await knex(Table.USERS)
      .where('id', userId)
      .update(object.toSnakeCase({ name, password }))
      .returning(['id', 'name', 'email']);

    logger.log('info', 'User updated successfully');

    return object.camelize(updatedUser[0]);
  } catch (err) {
    throw err;
  }
}
