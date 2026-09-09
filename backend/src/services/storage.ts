import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// Determine storage provider based on environment variable (default to local in development)
const STORAGE_PROVIDER = process.env.STORAGE_PROVIDER || (process.env.NODE_ENV === "production" ? "supabase" : "local");

let supabase: ReturnType<typeof createClient> | null = null;

if (STORAGE_PROVIDER === "supabase") {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
  } else {
    console.warn("⚠️ STORAGE_PROVIDER is 'supabase', but SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing. Falling back to 'local'.");
  }
}

/**
 * Uploads a product image using the configured storage provider.
 * 
 * @param file The multer file object
 * @returns The public URL of the uploaded image
 */
export async function uploadProductImage(file: Express.Multer.File): Promise<string> {
  const fileExt = path.extname(file.originalname).toLowerCase();
  const baseName = path.basename(file.originalname, fileExt).replace(/[^a-z0-9]/gi, '-').toLowerCase();
  const uniqueName = `${baseName}-${crypto.randomBytes(4).toString('hex')}${fileExt}`;

  // Local Storage Strategy
  if (!supabase || STORAGE_PROVIDER === "local") {
    // If multer is configured with memoryStorage (hybrid mode), we need to write the buffer to disk
    const uploadDir = path.resolve(process.cwd(), "uploads", "products");
    
    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, uniqueName);
    
    if (file.buffer) {
      await fs.writeFile(filePath, file.buffer);
    } else if (file.path) {
      // Fallback if diskStorage was somehow used directly
      await fs.rename(file.path, filePath);
    }
    
    // Return relative URL that express.static will serve
    return `/uploads/products/${uniqueName}`;
  }

  // Supabase Storage Strategy
  const bucketName = "product-images";
  
  if (!file.buffer) {
    throw new Error("File buffer is required for Supabase upload (use memoryStorage)");
  }

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(uniqueName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    console.error("Supabase Storage error:", error);
    throw new Error(`Failed to upload to Supabase: ${error.message}`);
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(data.path);
  
  return publicUrlData.publicUrl;
}
