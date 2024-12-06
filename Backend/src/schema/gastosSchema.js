import z from "zod";

export const gastosSchema = z.object({
  monto: z
    .number({ required_error: "El monto es obligatorio." })
    .positive("El monto debe ser un número positivo."),
  descripcion: z
    .string()
    .max(255, "La descripción no puede superar los 255 caracteres.")
    .optional(),
  id_categoria: z
    .number({ required_error: "El ID de la categoría es obligatorio." })
    .int("El ID de la categoría debe ser un número entero."),
});
