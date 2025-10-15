import { useState } from "react";

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);

  const connect = async () => {
    setAddress("0xMockedAddress");
  };

  const signMessage = async (msg: string) => {
    return "0xSignedMessage";
  };

  const disconnect = () => {
    setAddress(null);
  };

  return {
    address,
    connect,
    disconnect,
    signMessage,
  };
}
