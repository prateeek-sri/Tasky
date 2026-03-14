import crypto from "crypto";

/**
 * 💡 EASY EXPLANATION FOR INTERVIEW:
 * 
 * 1. Why encrypt? To hide sensitive data from hackers if they get access to our database.
 * 2. How it works: We use AES-256 (a bank-grade standard).
 * 3. IV (Salt): We generate a random "salt" for every piece of data so that the same 
 *    password/text never looks the same twice in the database.
 * 4. Storing: We store "[SALT]:[ENCRYPTED_DATA]" in one string.
 */

const ALGO = "aes-256-cbc";
const SECRET = process.env.AES_SECRET || "default_secret_32_chars_long_!!!";
const KEY = crypto.createHash('sha256').update(SECRET).digest('base64').substring(0, 32);

export function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGO, Buffer.from(KEY), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
  return iv.toString("hex") + ":" + encrypted;
}

export function decrypt(text) {
  try {
    const [ivHex, encrypted] = text.split(":");
    const decipher = crypto.createDecipheriv(ALGO, Buffer.from(KEY), Buffer.from(ivHex, "hex"));
    return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
  } catch {
    return "Decrypt failed";
  }
}
