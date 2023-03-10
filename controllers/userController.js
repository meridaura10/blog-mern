import MUser from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const doc = new MUser({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash,
    });
    const user = await doc.save();
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret",
      {
        expiresIn: "30d",
      }
    );
    res.json({
      ...user._doc,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "не вдалось зарегеструватись",
    });
  }
};
export const login = async (req, res) => {
  try {
    const user = await MUser.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "користувач не знайден",
      });
    }
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );
    if (!isValidPass) {
      return res.status(403).json({
        message: "невірний логін або пароль",
      });
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret",
      {
        expiresIn: "30d",
      }
    );
    res.json({
      ...user._doc,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "не вдалось авторизуватись",
    });
  }
};
export const getMe = async (req, res) => {
  try {
    const user = await MUser.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "користувача не знайдено",
      });
    }
    res.json({
      ...user._doc,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "немає доступу",
    });
  }
};
