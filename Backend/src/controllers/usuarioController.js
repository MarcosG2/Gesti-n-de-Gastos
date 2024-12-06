import bcrypt from "bcrypt";
import Usuario from "../models/Users.js";
import { v2 as cloudinary } from "cloudinary";

export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
};

export const crearUsuario = async (req, res) => {
  const { nombre, email, contraseña } = req.body;

  try {
    const existEmail = await Usuario.findOne({ where: { email } });
    if (existEmail) {
      return res.status(400).json({ message: "EL email ya esta registrado" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      contraseña: hashedPassword,
    });

    res
      .status(201)
      .json({ message: "El usuario se creo con exito", usuario: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el usuario.", error });
  }
};

export const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: ["id", "nombre", "email"],
    });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor." });
  }
};

export const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, email } = req.body;

  try {
    if (req.usuario.id !== parseInt(id)) {
      return res
        .status(403)
        .json({ message: "No tienes permisos para modificar este perfil" });
    }

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    usuario.nombre = nombre || usuario.nombre;
    usuario.email = email || usuario.email;

    await usuario.save();

    return res
      .status(200)
      .json({ message: "Perfil actualizado correctamente", usuario });
  } catch (error) {
    return res.status(500).json({ message: "Error al actualizar el perfil." });
  }
};

export const actualizarImagenUsuario = async (req, res) => {
  const { id } = req.params;
  console.log("Contenido de req.file:", req.file);

  try {
    console.log("Archivo recibido:", req.file);
    if (!req.file) {
      return res.status(400).json({ message: "No se recibió ninguna imagen." });
    }
    try {
      
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado." });
      }

      
      if (usuario.imagenPerfil) {
        
        const publicId = usuario.imagenPerfil.split("/").pop().split(".")[0]; 
        await cloudinary.uploader.destroy(`usuariosFotos/${publicId}`);
      }

      
      const rutaImagen = req.file.path; 
      usuario.imagenPerfil = rutaImagen;
      await usuario.save();

      return res.status(200).json({
        message: "Imagen actualizada correctamente.",
        rutaImagen,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Error al actualizar la imagen." });
    }
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    return res.status(500).json({ message: "Error al actualizar la imagen." });
  }
};
