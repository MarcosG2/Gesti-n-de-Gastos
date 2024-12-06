import { Op } from "sequelize";

import Gasto from "../models/Gasto.js";
import Categoria from "../models/Categoria.js";

export const obtenerGastos = async (req, res) => {
  try {
    const { id: id_usuario } = req.usuario;
    const { categoriaId, fechaInicio, fechaFin, descripcion } = req.query;

    const condiciones = { id_usuario };

    if (categoriaId) {
      condiciones.id_categoria = categoriaId;
    }

    if (fechaInicio || fechaFin) {
      condiciones.createdAt = {};
      if (fechaInicio) {
        condiciones.createdAt[Op.gte] = new Date(fechaInicio); 
      }
      if (fechaFin) {
        condiciones.createdAt[Op.lte] = new Date(fechaFin); 
      }
    }

    if (descripcion) {
      condiciones.descripcion = { [Op.like]: `%${descripcion}%` };
    }

    const gastos = await Gasto.findAll({
      where: condiciones,
      include: [{ model: Categoria, attributes: ["nombre"] }], 
      order: [["createdAt", "DESC"]], 
    });

    if (gastos.length === 0) {
      return res.status(404).json({ message: "No tienes gastos aun, crealas" });
    }
    res
      .status(200)
      .json({ message: "se obtuvo todos los gastos", data: gastos });
  } catch (error) {
    res.status(400).json({ message: "hubo un error" });
  }
};

export const crearGasto = async (req, res) => {
  try {
    console.log("esto son los params", req.usuario);

    const { id: id_usuario } = req.usuario;
    const { monto, descripcion, id_categoria } = req.body;

    const nuevoGasto = await Gasto.create({
      monto,
      descripcion,
      id_categoria,
      id_usuario,
    });
    res.status(201).json({ message: "se creo el gasto", data: nuevoGasto });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el gasto.", error });
  }
};

export const actualizarGasto = async (req, res) => {
  try {
    const { id: id_usuario } = req.usuario;
    const { id: id_gasto } = req.params;
    const { nombre, monto, descripcion, id_categoria: categoriaId } = req.body;
    console.log("los datos son ", categoriaId);
    console.log("los datos idgasto ", id_gasto);

    const categoriaNueva = await Categoria.findOne({
      where: { id: categoriaId, id_usuario: id_usuario },
    });

    if (!categoriaNueva) {
      return res
        .status(404)
        .json({ message: "la categoria ingresada no existe" });
    }

    const gasto = await Gasto.findOne({
      where: { id: id_gasto, id_usuario: id_usuario },
    });

    if (!gasto) {
      return res
        .status(404)
        .json({ message: "Gasto no encontrado o no pertenece al usuario." });
    }

    
    const valoresActualizados = {
      nombre: nombre || gasto.nombre,
      monto: monto || gasto.monto,
      descripcion: descripcion || gasto.descripcion,
      categoriaId: categoriaId || gasto.categoriaId,
    };

    
    await Gasto.update(valoresActualizados, {
      where: { id: id_gasto, id_usuario: id_usuario },
    });

    res.json({ message: "Gasto actualizado con éxito." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el gasto." });
  }
};

export const eliminarGasto = async (req, res) => {
  try {
    const { id } = req.usuario;
    const { id: id_gasto } = req.params;

    const resultado = await Gasto.destroy({
      where: {
        id: id_gasto,
        id_usuario: id,
      },
    });

    if (resultado === 0) {
      return res
        .status(404)
        .json({ message: "Gasto no encontrado o no pertenece al usuario." });
    }

    res.json({ message: "Gasto eliminado con éxito." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el gasto." });
  }
};
