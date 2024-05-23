import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useAddress, useMetamask } from "@thirdweb-dev/react";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const ConnectWallet: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const connectWithMetamask = useMetamask();
  const address = useAddress(); // Get the address from ThirdWeb context

  useEffect(() => {
    if (address) {
      const displayUserId = `${address.slice(0, 6)}...${address.slice(-4)}`;
      setAccount(displayUserId);
    }
  }, [address]);

  const connectWalletHandler = async () => {
    try {
      await connectWithMetamask();
    } catch (error) {
      console.error("Error connecting to MetaMask", error);
    }
  };

  return (
    <div>
      {account ? (
        <div>
          <button>{account}</button>
        </div>
      ) : (
        <button onClick={connectWalletHandler}>Connect</button>
      )}
    </div>
  );
};

export default ConnectWallet;
