import Joi from 'joi';

export const productSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    title: Joi.string().trim().min(1).label('Title').required(),
    price: Joi.number().label('Price').required(),
    quantity: Joi.number().label('Quantity').required(),
  });

export const productUpdateSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    title: Joi.string().trim().min(1).label('Title').optional(),
    price: Joi.number().label('Price').optional(),
    quantity: Joi.number().label('Quantity').optional(),
  });
