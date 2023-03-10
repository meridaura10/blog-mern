import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  if (token) {
    try {
      const decode = jwt.verify(token, "secret");
      req.userId = decode._id;
      next()
    } catch (error) {
        return res.status(403).json({
            message: "немає доступу",
          });
    }
  } else {
    return res.status(403).json({
      message: "немає доступу",
    });
  }
};
