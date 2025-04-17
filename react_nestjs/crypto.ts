// src/utils/crypto.ts

/**
 * Generates an ECDH key pair on the client and returns the pair
 * along with the Base64-encoded public key.
 */
export async function generateClientKeyPair(): Promise<{
  keyPair: CryptoKeyPair;
  publicKeyB64: string;
}> {
  const keyPair = await window.crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveKey', 'deriveBits']
  );

  const rawPublicKey = await window.crypto.subtle.exportKey('raw', keyPair.publicKey);
  const publicKeyB64 = btoa(String.fromCharCode(...new Uint8Array(rawPublicKey)));

  return { keyPair, publicKeyB64 };
}

/**
 * Derives a shared secret from the client’s private key and the
 * server’s Base64-encoded public key, then imports it as an AES-GCM key.
 */
export async function deriveSharedKey(
  keyPair: CryptoKeyPair,
  serverPublicKeyB64: string
): Promise<CryptoKey> {
  const rawServerKey = Uint8Array.from(
    atob(serverPublicKeyB64),
    (c) => c.charCodeAt(0)
  );
  const serverPublicKey = await window.crypto.subtle.importKey(
    'raw',
    rawServerKey.buffer,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    []
  );

  // Derive 256 bits of shared secret
  const sharedBits = await window.crypto.subtle.deriveBits(
    { name: 'ECDH', public: serverPublicKey },
    keyPair.privateKey,
    256
  );

  // Import the shared secret as an AES-GCM key
  return window.crypto.subtle.importKey(
    'raw',
    sharedBits,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts a UTF-8 string using the provided AES-GCM key.
 * Returns the IV and ciphertext in Base64 format.
 */
export async function encryptMessage(
  aesKey: CryptoKey,
  message: string
): Promise<{ iv: string; data: string }> {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const plaintext = encoder.encode(message);

  const cipherBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    plaintext
  );
  const cipherBytes = new Uint8Array(cipherBuffer);

  return {
    iv: btoa(String.fromCharCode(...iv)),
    data: btoa(String.fromCharCode(...cipherBytes)),
  };
}
