import Joi from 'joi';

export const createPublishDto = Joi.object({
    startDate: Joi.date().required(),
    endDate:Joi.date().required(),
    isPublish:Joi.boolean().required()
  });