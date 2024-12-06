import express from "express";
import { validarToken, validateSchema } from "../middleware/authMiddleware.js";
import { loginSchema, registroSchema } from "../schema/authSchema.js";
import { crearUsuario } from "../controllers/usuarioController.js";
import { login, logout } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", validateSchema(registroSchema), crearUsuario);
router.post("/login", validateSchema(loginSchema),login);
router.get("/logout",logout)

export default router;
