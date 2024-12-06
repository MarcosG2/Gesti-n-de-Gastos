import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Usuario from "./Users.js";

const categoria = sequelize.define(
  "categoria",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
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
  },
  {
    tableName: "Categorias",
    timestamps: true,
  }
);

categoria.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  onDelete: "CASCADE",
});

Usuario.hasMany(categoria, {
  foreignKey: "id_usuario",
});

export default categoria;
