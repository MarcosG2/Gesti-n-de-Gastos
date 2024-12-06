import express from "express";
import { validarToken, validateSchema } from "../middleware/authMiddleware.js";
import {
  categorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../controllers/categoriaController.js";
import { categoriaSchema } from "../schema/categoriaSchema.js";

const router = express.Router();

router.get("/", validarToken, categorias);
router.post("/", validarToken, validateSchema(categoriaSchema), crearCategoria);
router.put("/:id", validarToken, actualizarCategoria);
router.delete("/gastos/:id_gasto", validarToken, eliminarCategoria);
export default router;
