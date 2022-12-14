import db from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const Users = db.Users;
export const getUsers = async (req, res) => {
  if (req.user.roles == "member") {
    res.status(401).json({
      status: "Unauthorized",
      message: "Anda bukan SuperAdmin / Admin",
    });
    return;
  }
  try {
    const users = await Users.findAll({
      attributes: ["id", "name", "email", "roles"],
    });
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

export const Register = async (req, res) => {
  const { name, email, password, confPassword, roles } = req.body;
  if (password !== confPassword) return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await Users.create({
      name: name,
      email: email,
      password: hashPassword,
      roles: roles,
    });
    res.json({ msg: "Register Succesfully" });
  } catch (error) {
    console.log(error);
  }
};

export const RegisterAdmin = async (req, res) => {
  if (req.user.roles != "superadmin") {
    res.status(401).json({
      status: "Unauthorized",
      message: "Anda bukan SuperAdmin / Admin",
    });
    return;
  }
  const { name, email, password, confPassword, roles } = req.body;
  if (password !== confPassword) return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await Users.create({
      name: name,
      email: email,
      password: hashPassword,
      roles: roles,
    });
    res.json({ msg: "Register Succesfully" });
  } catch (error) {
    console.log(error);
  }
};

export const Login = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: "Salah e Salah e" });
    const userId = user[0].id;
    const name = user[0].name;
    const email = user[0].email;
    const roles = user[0].roles;
    const accessToken = jwt.sign({ userId, name, email, roles }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });
    const refreshToken = jwt.sign({ userId, name, email, roles }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "10d",
    });
    await Users.update(
      { access_token: accessToken, resfresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    const data = {
      userId,
      name,
      email,
      roles,
      accessToken,
      refreshToken,
    };
    return res.status(200).json({
      success: true,
      message: "Login Succesfully",
      data: data,
    });
  } catch (error) {
    res.status(404).json({ msg: "Email tidak ditemukan" });
  }
};

export const updateUser = async (req, res) => {
  if (req.user.roles == "member" && req.user.roles == "admin") {
    res.status(401).json({
      status: "Unauthorized",
      message: "You are not authorized to Update #SuperAdminOnly",
    });
    return;
  }
  const { id } = req.params;
  const dataBeforeDelete = await Users.findOne({
    where: { id: id },
  });
  // if(tokenUser.role !="superadmin"){res.json()}
  const parsedDataProfile = JSON.parse(JSON.stringify(dataBeforeDelete));

  if (!parsedDataProfile) {
    return res.status(400).json({
      success: false,
      message: "Users doesn't exist or has been deleted!",
    });
  }
  const { name, email, password, roles } = req.body;
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await Users.update(
      {
        name,
        email,
        password: hashPassword,
        roles,
      },
      {
        where: { id: id },
      }
    );
    return res.status(200).json({
      success: true,
      message: "Users berhasil di update",
    });
  } catch (error) {
    console.log(error);
  }
};

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  await Users.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};

// export const Logout = async (req, res) => {
//   const refreshToken = req.cookies.refreshToken;
//   if (!refreshToken) return res.sendStatus(204);
//   const user = await Users.findAll({
//     where: {
//       refresh_token: refreshToken,
//     },
//   });
//   if (!user[0]) return res.sendStatus(204);
//   const userId = user[0].id;
//   await Users.update(
//     { access_token: "", refresh_token: "" },
//     {
//       where: {
//         id: userId,
//       },
//     }
//   );
//   res.clearCookie("refreshToken");
//   return res.status(200).json({
//     success: true,
//     message: "Berhasil LogOut",
//   });
// };

export const whoAmI = async (req, res) => {
  try {
    const currentUser = req.user;
    res.status(200).json(currentUser);
  } catch (error) {
    console.log(error);
  }
};

// const tokenUser = req.user;
// console.log(tokenUser);
