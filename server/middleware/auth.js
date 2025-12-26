import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(403).json({ message: "Auth token required" });
    }
    const token = req.headers.authorization.split(" ")[1];

    let decodeData = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decodeData?.id;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default auth;
