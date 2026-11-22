import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

/**
 * Derives a consistent 32-byte key from the service role key or a secret.
 */
function getEncryptionKey(): Buffer {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || "fallback-secret-for-development-mode-32b";
  return crypto.createHash("sha256").update(secret).digest();
}

/**
 * Encrypts sensitive tokens (OAuth access & refresh tokens) at rest using AES-256-GCM.
 * Returns a hex-encoded string formatted as: {iv}:{tag}:{encryptedText}
 */
export function encryptToken(plainText: string): string {
  if (!plainText) return "";
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = getEncryptionKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

/**
 * Decrypts a token encrypted with AES-256-GCM.
 */
export function decryptToken(encryptedString: string): string {
  if (!encryptedString) return "";
  try {
    const parts = encryptedString.split(":");
    if (parts.length !== 3) {
      throw new Error("Invalid encrypted token format");
    }

    const [ivHex, tagHex, encryptedText] = parts;
    const iv = Buffer.from(ivHex, "hex");
    const tag = Buffer.from(tagHex, "hex");
    const key = getEncryptionKey();

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (err) {
    console.error("Token decryption failed:", err);
    throw new Error("Unable to decrypt token");
  }
}
