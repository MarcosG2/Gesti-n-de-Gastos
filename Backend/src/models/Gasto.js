import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Usuario from "./Users.js";
import categoria from "./Categoria.js";

const Gastos = sequelize.define(
  "Gasto",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    monto: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Usuario,
        key: "id",
      },
    },
    id_categoria: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: categoria,
        key: "id",
      },
    },
  },
  {
    tableName: "Gastos",
    timestamps: true,
  }
);

Gastos.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  onDelete: "CASCADE",
});

Usuario.hasMany(Gastos, {
  foreignKey: "id_usuario",
});

Gastos.belongsTo(categoria, {
  foreignKey: "id_categoria",
  onDelete: "CASCADE",
});

categoria.hasMany(Gastos, {
  foreignKey: "id_categoria",
});

export default Gastos;
