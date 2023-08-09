import Joi from 'joi';

export const productSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    title: Joi.string().trim().min(1).label('Title').required(),
    price: Joi.number().label('Price').required(),
    quantity: Joi.number().label('Quantity').required(),
  });
