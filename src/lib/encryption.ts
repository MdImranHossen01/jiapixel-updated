import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const VERSION_PREFIX = 'v1:';

function getEffectiveKey(): string {
  const envKey = process.env.ENCRYPTION_KEY || process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  if (!envKey) {
    return 'jiapixel-dev-only-insecure-key-32';
  }
  return envKey;
}

function isEncryptedV1(text: string): boolean {
  if (!text.startsWith(VERSION_PREFIX)) return false;
  const parts = text.split(':');
  if (parts.length !== 5) return false;

  const [, salt, iv, authTag, ciphertext] = parts;
  return (
    salt.length === SALT_LENGTH * 2 &&
    iv.length === IV_LENGTH * 2 &&
    authTag.length === 32 &&
    /^[0-9a-f]+$/i.test(salt) &&
    /^[0-9a-f]+$/i.test(iv) &&
    /^[0-9a-f]+$/i.test(authTag) &&
    /^[0-9a-f]+$/i.test(ciphertext)
  );
}

export function encrypt(text: string): string {
  if (!text) return text;
  if (isEncryptedV1(text)) return text;

  const salt = crypto.randomBytes(SALT_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);

  const key = crypto.scryptSync(getEffectiveKey(), salt, 32);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');
  return `${VERSION_PREFIX}${salt.toString('hex')}:${iv.toString('hex')}:${authTag}:${encrypted}`;
}

export function decrypt(text: string | null | undefined): string | null {
  if (!text) return null;

  if (!isEncryptedV1(text)) {
    return text.includes(':') ? null : text;
  }

  const parts = text.split(':');
  if (parts.length !== 5) return null;

  try {
    const salt = Buffer.from(parts[1], 'hex');
    const iv = Buffer.from(parts[2], 'hex');
    const authTag = Buffer.from(parts[3], 'hex');
    const encryptedText = Buffer.from(parts[4], 'hex');

    if (salt.length !== SALT_LENGTH || iv.length !== IV_LENGTH || authTag.length !== 16) {
      return null;
    }

    const key = crypto.scryptSync(getEffectiveKey(), salt, 32);
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString('utf8');
  } catch (error: any) {
    console.error('Decryption error:', error?.name || 'Authentication Failed');
    return null;
  }
}

