import { body } from 'express-validator';

const registerValidation = [
  body('email', 'Incorrect email format').isEmail(),
  body(
    'password',
    'Password must contain at least 1 uppercase letter, 1 digit, 1 symbol, the minimum password length is 5 characters'
  ).isStrongPassword({
    minLength: 5,
    minUppercase: 1,
    minSymbols: 1,
    minNumbers: 1,
  }),
  body('name', 'The name cannot be less than 2 characters')
    .optional()
    .isLength({ min: 2 }),
  body('avatarUrl', 'Wrong link').optional().isURL(),
];

export { registerValidation };
