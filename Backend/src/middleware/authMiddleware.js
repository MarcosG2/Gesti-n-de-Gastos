import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();
const JWT_SECRET = "super_secreto";

export const validarToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).json({ message: "No autenticado." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Token inválido o expirado." });
  }
};

export const validateSchema = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Error de validación.",
        errors: error.errors.map((err) => ({
          path: err.path,
          message: err.message,
        })),
      });
    }
    return res.status(500).json({
      message: "Ocurrió un error inesperado.",
    });
  }
};
