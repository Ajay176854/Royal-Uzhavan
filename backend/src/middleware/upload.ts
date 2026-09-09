import multer from "multer";

// We use memoryStorage for everything. 
// If STORAGE_PROVIDER=local, our storage service will manually write the buffer to disk.
// If STORAGE_PROVIDER=supabase, the service will stream the buffer directly to Supabase Storage.
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    // Restrict to images
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/webp") {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and WEBP images are allowed"));
    }
  },
});
