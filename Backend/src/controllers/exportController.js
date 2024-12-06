import ExcelJS from "exceljs";
import Gasto from "../models/Gasto.js";
import { Op } from "sequelize";

export const exportarGastos = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, categoriaId, descripcion } = req.query;

    
    const where = {};
    if (fechaInicio && fechaFin)
      where.createdAt = { [Op.between]: [fechaInicio, fechaFin] };
    if (categoriaId) where.id_categoria = categoriaId;
    if (descripcion) where.descripcion = { [Op.like]: `%${descripcion}%` };

    const gastos = await Gasto.findAll({ where });

    const workbook = new ExcelJS.Workbook();
    const hoja = workbook.addWorksheet("Gastos");

    
    hoja.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Descripción", key: "descripcion", width: 30 },
      { header: "Monto", key: "monto", width: 15 },
      { header: "Fecha", key: "createdAt", width: 20 },
      { header: "Categoría ID", key: "id_categoria", width: 15 },
    ];

    
    gastos.forEach((gasto) => hoja.addRow(gasto.toJSON()));

    // Configurar el encabezado para descarga
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=gastos.xlsx");

    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error al exportar gastos:", error);
    res.status(500).json({ message: "Error al exportar los gastos" });
  }
};
