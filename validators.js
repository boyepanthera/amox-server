const Joi = require("joi");

const signupSchema = Joi.object({
  firstName: Joi.string().required().min(2),
  lastName: Joi.string().required().min(2),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const menuSchema = Joi.object({
  name: Joi.string().required().min(2),
  price: Joi.number().required().min(0),
});

const menuUpdateSchema = Joi.object({
  price: Joi.number().min(0),
});

const validateSignupData = (data) => {
  const { error, value } = signupSchema.validate(data);
  return {
    err: error,
    value,
  };
};

const validateMenuData = (data) => {
  const { error, value } = menuSchema.validate(data);
  return {
    err: error,
    value,
  };
};

const validateMenuUpdateData = (data) => {
  const { error, value } = menuUpdateSchema.validate(data);
  return {
    err: error,
    value,
  };
};

const validateLoginData = (data) => {
  const { error, value } = loginSchema.validate(data);
  return {
    err: error,
    value,
  };
};

module.exports = {
  validateSignupData: validateSignupData,
  validateLoginData,
  validateMenuData,
  validateMenuUpdateData,
};
