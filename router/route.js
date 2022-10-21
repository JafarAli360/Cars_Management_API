import express from "express";
import { getUsers, Register, Login, Logout, RegisterAdmin, whoAmI, updateUser } from "../controller/controllerUser.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { refreshToken } from "../controller/refreshToken.js";
import { getCars, getCarsById, createCars, updateCars, deleteCars } from "../controller/controllerMobil.js";
const router = express.Router();
const prefix = "/v1/api/";

//User API
router.post(prefix + "register", Register);
router.post(prefix + "login", Login);
router.put(prefix + "update-user/:id", verifyToken, updateUser);
router.delete(prefix + "logout", Logout);
router.get(prefix + "token", refreshToken);
router.get(prefix + "whoami", verifyToken, whoAmI);

// endpoint untuk tambah admin yang bisa hanya superadmin
router.post(prefix + "registrasi-admin", verifyToken, RegisterAdmin);
router.get(prefix + "users", verifyToken, getUsers);

//Cars API
router.get(prefix + "cars", verifyToken, getCars);
router.get(prefix + "car/:id", verifyToken, getCarsById);
router.post(prefix + "car", verifyToken, createCars);
router.put(prefix + "car/:id", verifyToken, updateCars);
router.delete(prefix + "car/:id", verifyToken, deleteCars);

export default router;
