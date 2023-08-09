/* eslint-disable no-useless-escape */
import Joi from 'joi';

export const userSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    name: Joi.string().trim().min(1).label('Name').required(),
    email: Joi.string()
      .label('Email')
      .trim()
      .required()
      .regex(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      )
      .message('Please enter a valid email address'),
    password: Joi.string().trim().min(6).label('Password').required(),
  });

export const loginSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    email: Joi.string()
      .label('Email')
      .trim()
      .required()
      .regex(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      )
      .message('Please enter a valid email address'),
    password: Joi.string().trim().min(6).label('Password').required(),
  });

export const updateSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    name: Joi.string().trim().min(1).label('Name').required(),
    password: Joi.string().trim().min(6).label('Password').required(),
  });
