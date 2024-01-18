import { body } from 'express-validator';
let AuthValidation = {}
AuthValidation.loginValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

AuthValidation.registerValidation = [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
    body('email').notEmpty().withMessage('Email is required'),
  ];

export default AuthValidation;