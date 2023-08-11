import jwt from "jsonwebtoken";

import User from "../models/user.js";

// An authentication middleware that first
// checks if the token is present, decodes the token
// and then finds a user with the id & token from the token's data
// If no user is found, an error is thrown
export const auth = async (req, res, next) => {
  try {
    // const token = req.header("Authorization").replace("Bearer ", "");
    const token = req.cookies["auth_token"];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate" });
  }
};
