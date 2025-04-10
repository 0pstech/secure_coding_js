import bcrypt from 'bcrypt';
import crypto from 'crypto';

// Hashing parameters
const PBKDF2_ITERATIONS = 100_000;
const KEYLEN = 64;
const DIGEST = 'sha512';

export async function hashWithBcrypt(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
}

export async function verifyWithBcrypt(password, hash) {
    console.log('[hash/verifyWithBcrypt] Comparing password:', password);
    console.log('[hash/verifyWithBcrypt] Against stored hash:', hash);
    const match = await bcrypt.compare(password, hash);
    console.log('[hash/verifyWithBcrypt] Comparison result:', match);
    return match;
}

/**
 * Generates a password hash with a salt, returns a single string
 * Format: pbkdf2$<iterations>$<salt>$<hash>
 */
export function hashWithCrypto(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, KEYLEN, DIGEST).toString('hex');

  // Return as a single combined string
  return `pbkdf2$${PBKDF2_ITERATIONS}$${salt}$${hash}`;
}

/**
 * Verifies a password against a stored hash string
 * @param {string} password - The plaintext password to verify
 * @param {string} storedHash - The stored hash string (format: pbkdf2$iterations$salt$hash)
 * @returns {boolean} - True if matched, false otherwise
 */
export function verifyWithCrypto(password, storedHash) {
  const [algorithm, iterationsStr, salt, originalHash] = storedHash.split('$');

  if (algorithm !== 'pbkdf2') return false;

  const iterations = parseInt(iterationsStr, 10);
  const hashToCompare = crypto.pbkdf2Sync(password, salt, iterations, KEYLEN, DIGEST);
  const originalBuffer = Buffer.from(originalHash, 'hex');

  // Use timing-safe comparison to prevent timing attacks
  return crypto.timingSafeEqual(hashToCompare, originalBuffer);
}