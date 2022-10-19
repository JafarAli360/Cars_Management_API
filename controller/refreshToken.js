import db from "../models/index.js";
import jwt, { decode } from "jsonwebtoken";

const Users = db.Users;
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    const user = await user.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user[0]) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);
      const userId = user[0].id;
      const name = user[0].name;
      const email = user[0].email;
      const roles = user[0].roles;
      const accessToken = jwt.sign({ userId, name, email, roles }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });
      res.json(accessToken);
    });
  } catch (error) {
    console.log(error);
  }
};
