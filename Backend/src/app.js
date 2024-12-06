import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/database.js";
import cookieParser from "cookie-parser";

import gastoRoutes from "./routes/gastos.js";
import Gastos from "./models/Gasto.js";
import User from "./routes/usuarios.js";
import authRoutes from "./routes/auth.js";
import categorias from "./routes/categorias.js";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

app.use("/categoria", categorias);
app.use("/gasto", gastoRoutes);
app.use("/user", User);
app.use("/auth", authRoutes);

app.get("/ping", (req, res) => {
  res.json({ message: "Servidor funcionando correctamente 🚀" });
});

app.get("/", function (req, res) {
  res.send("conected");
});
const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

db.sync({ alter: true }) // Cambia a `true` para borrar y recrear tablas en desarrollo
  .then(() => console.log("Modelos sincronizados con la base de datos 🚀"))
  .catch((error) => console.error("Error al sincronizar modelos:", error));
