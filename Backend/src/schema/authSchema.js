import { z } from "zod";

export const registroSchema = z
  .object({
    nombre: z
      .string({
        required_error: "El nombre es obligatorio.",
      })
      .min(3, {
        message: "El nombre debe tener como minimo 3 letras.",
      }),
    email: z
      .string({
        required_error: "El email es obligatorio.",
      })
      .email({
        message: "Debe ser un email válido.",
      }),
    contraseña: z
      .string({
        required_error: "La contraseña es obligatoria.",
      })
      .min(6, {
        message: "La contraseña debe tener al menos 6 caracteres.",
      }),
    confirmarContraseña: z
      .string({
        required_error: "La confirmación de la contraseña es obligatoria.",
      })
      .min(6, {
        message:
          "La confirmación de la contraseña debe tener al menos 6 caracteres.",
      }),
  })
  .refine((data) => data.contraseña === data.confirmarContraseña, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmContraseña"],
  });

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "El email es obligatorio.",
    })
    .email({
      message: "Debe ser un email válido.",
    }),
  contraseña: z
    .string({
      required_error: "La contraseña es obligatoria.",
    })
    .min(4, {
      message: "La contraseña debe tener al menos 4 caracteres.",
    }),
});
