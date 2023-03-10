import { body } from "express-validator";

export const registerValidator = [
  body("email", "невірний формат почти").isEmail(),
  body("password", "пароль паж бути мінімум 5 символів").isLength({ min: 5 }),
  body("fullName", "вкажіть імя").isLength({ min: 3 }),
  body("avatarUrl", "неправильна силка на аватарку ").optional().isURL(),
];

export const  loginValidator = [
  body("email", "невірний формат почти").isEmail(),
  body("password", "пароль паж бути мінімум 5 символів").isLength({ min: 5 }),
];

