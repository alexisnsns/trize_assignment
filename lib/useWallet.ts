import { useState } from 'react';

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);

  const connect = async () => setAddress('0xMockedAddress');
  const signMessage = async (msg: string) => '0xSignedMessage';

  return { address, connect, signMessage };
}
