// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";


const f = createUploadthing();

// Función de autenticación simulada (reemplaza con tu lógica real)
const auth = (req: Request) => ({ id: "fakeId" });

// FileRouter con todas las posibilidades de carga de archivos
export const ourFileRouter = {

  // Uploader para imágenes con restricciones de tamaño y cantidad
  imageUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 5 } })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Imagen subida:", file.url);
      return { uploadedBy: metadata.userId, fileType: "image" };
    }),

  // Uploader para archivos PDF con un tamaño máximo mayor
  pdfUploader: f({ pdf: { maxFileSize: "64MB" } })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("PDF subido:", file.url);
      return { uploadedBy: metadata.userId, fileType: "pdf" };
    }),

  // Uploader para archivos de video con restricciones de tamaño
  videoUploader: f({ video: {maxFileSize:"256MB",maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Video subido:", file.url);
      return { uploadedBy: metadata.userId, fileType: "video" };
    }),

  // Uploader para archivos de audio con restricciones de tamaño y cantidad
  audioUploader: f({ audio: {maxFileSize:"128MB", maxFileCount: 3 } })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Audio subido:", file.url);
      return { uploadedBy: metadata.userId, fileType: "audio" };
    }),

  // Uploader genérico para cualquier tipo de archivo (sin restricciones específicas de tipo)
  // ¡Ten cuidado al usar esto en producción y considera agregar validaciones!
  anyFileUploader: f({ blob: { maxFileSize: "512MB" } })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Cualquier archivo subido:", file.url);
      return { uploadedBy: metadata.userId, fileType: "any" };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;