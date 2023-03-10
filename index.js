import express from "express";
import mongoose from "mongoose";
import { loginValidator, registerValidator } from "./validations/auth.js";
import checkAuth from "./utils/checkAuth.js";
import fs from "fs";
import { register, login, getMe } from "./controllers/userController.js";
import cors from "cors";
import {
  createPost,
  getAllPosts,
  getLastTags,
  getOnePost,
  removePost,
  updatePost,
} from "./controllers/postController.js";
import { postCreateValidation } from "./validations/post.js";
import multer from "multer";
import handleVError from "./utils/handleVError.js";
const port = process.env.PORT || 4444;
const mongodbUrl = "mongodb+srv://meridaura:123@cluster0.nyhea5n.mongodb.net/?retryWrites=true&w=majority";
const app = express();
app.listen(port, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("server ok");
});

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage,
});
mongoose
  .connect(mongodbUrl)
  .then(() => {
    console.log("db ok");
  })
  .catch((err) => {
    console.log("db error", err);
  });
app.use(cors());

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.post("/auth/login", loginValidator, handleVError, login);
app.post("/auth/register", registerValidator, handleVError, register);
app.get("/auth/me", checkAuth, getMe);
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});
app.get("/tags", getLastTags);
app.get("/posts", getAllPosts);
app.get("/posts/:id", getOnePost);
app.delete("/posts/:id", checkAuth, removePost);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleVError,
  updatePost
);
app.post("/posts", checkAuth, postCreateValidation, handleVError, createPost);
