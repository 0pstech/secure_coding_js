import { decryptRequest, getPublicKey } from "../api/auth";
import { deriveSharedKey, encryptMessage, generateClientKeyPair } from "../utils/crypto";
import { useEffect, useState } from "react";

export default function EncryptPage() {

  const [message, setMessage] = useState<string>('');
  const [encrypted, setEncrypted] = useState<{iv: string, data: string} | null>(null);
  const [decrypted, setDecrypted] = useState<string>('');

  const [clientKeyPair, setClientKeyPair] = useState<CryptoKeyPair | null>(null);
  const [publicKeyB64, setPublicKeyB64] = useState<string>('');
  const [aesKey, setAesKey] = useState<CryptoKey | null>(null);


  useEffect(() => {
    async function handshake() {
      // generate keys
      // keyPair = private, public
      const { keyPair, publicKeyB64 } = await generateClientKeyPair();
      setClientKeyPair(keyPair);
      setPublicKeyB64(publicKeyB64);
  
      // get public key from server
      const serverPubKeyB64 = await getPublicKey();
  
      // derive AES key ( sym key <- my private + server public )
      const sharedAesKey = await deriveSharedKey(keyPair, serverPubKeyB64);
      setAesKey(sharedAesKey);
    }

    handshake().catch(console.error);
  }, []);

  const handleSend = async () => {
    if (!aesKey) {
      alert('Key is not ready');
      return;
    }

    const { iv, data } = await encryptMessage(aesKey, message);
    setEncrypted({ iv, data });
    console.log('message is encrypted: ', iv, data);
  }

  const handleReceive = async () => {
    if (!encrypted || !publicKeyB64) {
      alert('Send message first!');
      return;
    }

    // get encrypted data
    const plaintext = await decryptRequest(publicKeyB64, encrypted.iv, encrypted.data);
    setDecrypted(plaintext);

  }

   return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="py-12 bg-gradient-to-r from-indigo-600 to-blue-500">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              Encrypt & Decrypt Test
            </h1>
            <textarea
              className="form-control mb-2"
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="input your message"
            />
            <div className="mb-3">
              <button className="btn btn-primary me-2" onClick={handleSend}>
                Send
              </button>
              <button className="btn btn-primary me-2" onClick={handleReceive}>
                Receive
              </button>
            </div>
            <div className="alert alert-success">Decrypted Message: {decrypted}</div>
          </div>
        </div>
      </div>
    </div>
  );
}; 