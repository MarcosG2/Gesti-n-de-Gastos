import express from "express";
import {
  actualizarGasto,
  obtenerGastos,
} from "../controllers/gastoController.js";
import { crearGasto, eliminarGasto } from "../controllers/gastoController.js";
import { validarToken, validateSchema } from "../middleware/authMiddleware.js";
import { gastosSchema } from "../schema/gastosSchema.js";
import { exportarGastos } from "../controllers/exportController.js";

const router = express.Router();

router.get("/", validarToken, obtenerGastos);
router.get("/exportar",exportarGastos)
router.post("/", validateSchema(gastosSchema), validarToken, crearGasto);
router.put("/:id", validarToken, actualizarGasto);
router.delete("/:id", validarToken, eliminarGasto);
export default router;
