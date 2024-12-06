import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Usuario from "../models/Users.js";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = "super_secreto";

export const login = async (req, res) => {
  const { email, contraseña } = req.body;
  try {
    const usuario = await Usuario.findOne({
      where: { email },
    });
    if (!usuario) {
      return res.status(401).json({ message: "credenciales invalidas" });
    }

    const contraseñaValida = await bcrypt.compare(
      contraseña,
      usuario.contraseña
    );

    if (!contraseñaValida) {
      return res.status(401).json({ message: "credenciales invalidas" });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 3600000,
    });

    return res.status(200).json({ message: "Inicio de sesion exitoso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Sesion cerrada. " });
};
