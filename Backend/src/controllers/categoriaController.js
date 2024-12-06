import Categoria from "../models/Categoria.js";

export const categorias = async (req, res) => {
  const id = req.usuario.id;

  try {
    const categoria = await Categoria.findAll({
      where: { id_usuario: id },
    });

    if (categoria.length == 0) {
      return res
        .status(404)
        .json({ message: "No tienes categorias aun, crealas" });
    }

    res
      .status(200)
      .json({ message: "se obtuvo las categorias", data: categoria });
  } catch (error) {
    res.status(400).json({ message: "hubo un error" });
  }
};

export const crearCategoria = async (req, res) => {
  const id = req.usuario.id;
  const { nombre } = req.body;

  try {
    const nombreRepetido = await Categoria.findOne({
      where: {
        nombre: nombre,
        id_usuario: id,
      },
    });
    if (nombreRepetido) {
      res
        .status(400)
        .json({ message: "Ya existe una categoria con este nombre" });
    }

    const nuevaCategoria = await Categoria.create({
      nombre: nombre,
      id_usuario: id,
    });

    res.status(201).json({
      message: "Categoría creada exitosamente.",
      data: nuevaCategoria,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al crear la categoría.",
      error: error.message,
    });
  }
};

export const actualizarCategoria = async (req, res) => {
  const { id: id_categoria } = req.params;
  const { nombre } = req.body;
  const { id: id_usuario } = req.usuario;
  console.log(req.usuario);

  try {
    const existeCat = await Categoria.findOne({
      where: {
        id: id_categoria,
        id_usuario: id_usuario,
      },
    });

    if (!existeCat) {
      return res
        .status(400)
        .json({ message: "Categoria no encontrada o no pertenece al usuario" });
    }

    await Categoria.update(
      { nombre: nombre },
      {
        where: {
          id: id_categoria,
          id_usuario: id_usuario,
        },
      }
    );

    const categoriaActualizada = await Categoria.findOne({
      where: {
        id: id_categoria,
        id_usuario: id_usuario,
      },
    });

    res.status(200).json({
      message: "Categoria actualizada exitosamente.",
      data: categoriaActualizada,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al actualizar la categoria",
      error: error.message,
    });
  }
};

export const eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.usuario; 
    const { id_categoria } = req.params; 

    
    const resultado = await Categoria.destroy({
      where: {
        id: id_categoria,
        id_usuario: id, 
      },
    });

    if (resultado === 0) {
      return res.status(404).json({
        message: "Categoría no encontrada o no pertenece al usuario.",
      });
    }

    res.json({ message: "Categoría eliminada con éxito." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la categoría." });
  }
};
