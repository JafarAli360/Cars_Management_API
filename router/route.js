import express from "express";
import { getUsers, Register, Login, Logout, RegisterAdmin, whoAmI } from "../controller/controllerUser.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { refreshToken } from "../controller/refreshToken.js";
import { getBooks, getBookById, createBooks, updateBooks, deleteBooks } from "../controller/controllerMobil.js";
const router = express.Router();
const prefix = "/v1/api/";

router.post(prefix + "register", Register);
router.post(prefix + "login", Login);
router.delete(prefix + "logout", Logout);

router.get(prefix + "token", refreshToken);
router.get(prefix + "whoami", verifyToken, whoAmI);

// endpoint untuk tambah admin yang bisa hanya superadmin
router.post(prefix + "registrasi-admin", verifyToken, RegisterAdmin);

router.get(prefix + "users", verifyToken, getUsers);

router.get(prefix + "books", verifyToken, getBooks);
router.get(prefix + "book/:id", verifyToken, getBookById);
router.post(prefix + "book", verifyToken, createBooks);
router.put(prefix + "book/:id", verifyToken, updateBooks);
router.delete(prefix + "book/:id", verifyToken, deleteBooks);

export default router;
