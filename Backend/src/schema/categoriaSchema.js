import {z} from "zod"

export const categoriaSchema = z.object({
    nombre: z.string({required_error:"El nombre es obligatorio"})
    .min(3, {
        message: "el nombre como minimo debe tener 3 letras"
    }) 
})

