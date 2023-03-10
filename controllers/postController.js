import post from "../models/post.js";
import postModel from "../models/post.js";

export const getLastTags = async (req, res) => {
  try {
    const posts = await post.find().limit(5);
    const tags = posts.map(e => e.tags).flat().slice(0,5)
    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "не вдалось отримати тегі",
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    await postModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags ? req.body.tags.split(' ') : [],
        user: req.userId,
      }
    );
    res.json({
      s: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "не вдалось обновити статью",
    });
  }
};

export const removePost = async (req, res) => {
  try {
    const postId = req.params.id;
    postModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            message: "не вдалось видалити статью",
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: "статья не знайдена",
          });
        }
        res.json(doc);
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "не вдалось отримати статьї",
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await post.find().populate("user").exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "не вдалось отримати статьї",
    });
  }
};

export const getOnePost = async (req, res) => {
  try {
    const postId = req.params.id;
    postModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: {
          viewsCount: 1,
        },
      },
      {
        returnDocument: "after",
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            message: "не вдалось створити статью",
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: "статья не знайдена",
          });
        }
        res.json(doc);
      }
    ).populate('user')
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "не вдалось отримати статьї",
    });
  }
};

export const createPost = async (req, res) => { 
  console.log(req.body.tags);
  try {
    const doc = new postModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags ? req.body.tags.split(' ') : [],
      user: req.userId,
    });
    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "не вдалось створити статью",
    });
  }
};
