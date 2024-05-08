import * as joi from "joi";

export const validationSchema = joi.object({
    STAGE: joi.string().default(3000),
    DATABASE_HOST: joi.string().required(),
    DATABASE_PORT: joi.number().default(5433).required(),
    USERNAME: joi.string().required(),
    PASSWORD: joi.string().required(),
    DATABASE_NAME: joi.string().required(),
    JWT_SECRET: joi.string().required()
});
