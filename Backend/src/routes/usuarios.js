import express from "express";
import {
  actualizarUsuario,
  obtenerUsuarios,
  obtenerPerfil,
  actualizarImagenUsuario,
} from "../controllers/usuarioController.js";

import { validarToken } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/imgUpload.js";

const router = express.Router();

router.get("/", obtenerUsuarios);
router.get("/perfil", validarToken, obtenerPerfil);
router.put("/pefil", validarToken, actualizarUsuario);

router.post("/:id/imagen",validarToken,upload.single("image"),actualizarImagenUsuario);

export default router;
