// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
// Importamos 'auth' de Clerk para el lado del servidor
import { auth as clerkAuth } from "@clerk/nextjs/server"; 

const f = createUploadthing();

// FileRouter con todas las posibilidades de carga de archivos
export const ourFileRouter = {

  // Uploader para imágenes con restricciones de tamaño y cantidad
  imageUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 5 } })
    .middleware(async () => { // Eliminado '{ req }'
      const sessionAuth = await clerkAuth(); // Usando 'await'
      
      if (!sessionAuth || !sessionAuth.userId) { 
        throw new UploadThingError("Unauthorized: No user ID found.");
      }

      return { userId: sessionAuth.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Imagen subida:", file.url);
      return { uploadedBy: metadata.userId, fileType: "image" };
    }),

  // Uploader para archivos PDF con un tamaño máximo mayor
  pdfUploader: f({ pdf: { maxFileSize: "64MB" } })
    .middleware(async () => { // Eliminado '{ req }'
      const sessionAuth = await clerkAuth(); // Usando 'await'
      if (!sessionAuth || !sessionAuth.userId) {
        throw new UploadThingError("Unauthorized: No user ID found.");
      }
      return { userId: sessionAuth.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("PDF subido:", file.url);
      return { uploadedBy: metadata.userId, fileType: "pdf" };
    }),

  // Uploader para archivos de video con restricciones de tamaño
  videoUploader: f({ video: {maxFileSize:"256MB",maxFileCount: 1 } })
    .middleware(async () => { // Eliminado '{ req }'
      const sessionAuth = await clerkAuth(); // Usando 'await'
      if (!sessionAuth || !sessionAuth.userId) {
        throw new UploadThingError("Unauthorized: No user ID found.");
      }
      return { userId: sessionAuth.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Video subido:", file.url);
      return { uploadedBy: metadata.userId, fileType: "video" };
    }),

  // Uploader para archivos de audio con restricciones de tamaño y cantidad
  audioUploader: f({ audio: {maxFileSize:"128MB", maxFileCount: 3 } })
    .middleware(async () => { // Eliminado '{ req }'
      const sessionAuth = await clerkAuth(); // Usando 'await'
      if (!sessionAuth || !sessionAuth.userId) {
        throw new UploadThingError("Unauthorized: No user ID found.");
      }
      return { userId: sessionAuth.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Audio subido:", file.url);
      return { uploadedBy: metadata.userId, fileType: "audio" };
    }),

  // NUEVO: Uploader específico para archivos Excel/CSV
  excelUploader: f({
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { // .xlsx
      maxFileSize: "16MB", 
      maxFileCount: 1,     
    },
    "application/vnd.ms-excel": { // .xls (para Excel antiguos)
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
    "text/csv": { // .csv
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => { // Eliminado '{ req }'
      const sessionAuth = await clerkAuth(); // Usando 'await'
      if (!sessionAuth || !sessionAuth.userId) {
        throw new UploadThingError("Unauthorized: No user ID found.");
      }
      return { userId: sessionAuth.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Archivo Excel/CSV subido:", file.url);
      return { uploadedBy: metadata.userId, fileType: "spreadsheet" }; 
    }),

  // Uploader genérico para cualquier tipo de archivo (sin restricciones específicas de tipo)
  anyFileUploader: f({ blob: { maxFileSize: "512MB" } })
    .middleware(async () => { // Eliminado '{ req }'
      const sessionAuth = await clerkAuth(); // Usando 'await'
      if (!sessionAuth || !sessionAuth.userId) {
        throw new UploadThingError("Unauthorized: No user ID found.");
      }
      return { userId: sessionAuth.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Cualquier archivo subido:", file.url);
      return { uploadedBy: metadata.userId, fileType: "any" };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;