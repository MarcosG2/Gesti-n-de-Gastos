import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "usuariosFotos",
    allowed_formats: ["jpeg", "jpg", "png"],
  },
});

export const upload = multer({ storage });
