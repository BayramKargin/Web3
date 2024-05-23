import { toEther, toWei, useAddress, useBalance, useContract, useContractRead, useContractWrite, useSDK, useTokenBalance } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import SwapInput from "../components/SwapInput";

const Home: NextPage = () => {
  const TOKEN_CONTRACT = "0xe90D8643c4D32F8F383757c79A26f9ac6507744E";
  const DEX_CONTRACT = "0x53CEC441893082c7e36fbCa91D55940048e5F446";

  const sdk = useSDK();
  const address = useAddress();
  const { contract: tokenContract } = useContract(TOKEN_CONTRACT);
  const { contract: dexContract } = useContract(DEX_CONTRACT);
  const { data: symbol } = useContractRead(tokenContract, "symbol");
  const { data: tokenBalance } = useTokenBalance(tokenContract, address);
  const { data: nativeBalance } = useBalance();
  const { data: contractTokenBalance } = useTokenBalance(tokenContract, DEX_CONTRACT);

  const [contractBalance, setContractBalance] = useState<String>("0");
  const [nativeValue, setNativeValue] = useState<String>("0");
  const [tokenValue, setTokenValue] = useState<String>("0");
  const [currentFrom, setCurrentFrom] = useState<String>("native");
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const { mutateAsync: swapNativeToken } = useContractWrite(
    dexContract,
    "swapEthTotoken"
  );
  const { mutateAsync: swapTokenToNative } = useContractWrite(
    dexContract,
    "swapTokenToEth"
  );
  const { mutateAsync: approveTokenSpending } = useContractWrite(
    tokenContract,
    "approve"
  );

  const { data: amountToGet } = useContractRead(
    dexContract,
    "getAmountOfTokens",
    currentFrom === "native"
      ? [
          toWei(nativeValue as string || "0"),
          toWei(contractBalance as string || "0"),
          contractTokenBalance?.value,
        ]
      : [
        toWei(tokenValue as string || "0"),
        contractTokenBalance?.value,
        toWei(contractBalance as string || "0"),
      ]
  );

  const fetchContractBalance = async () => {
    try {
      const balance = await sdk?.getBalance(DEX_CONTRACT);
      setContractBalance(balance?.displayValue || "0");
    } catch (error) {
      console.error(error);
    }
  };

  const executeSwap = async () => {
    setIsLoading(true);
    try {
      if(currentFrom === "native") {
        await swapNativeToken({
          overrides: {
            value: toWei(nativeValue as string || "0"),
          }
        });
        alert("Swap executed successfully");
      } else {
        await approveTokenSpending({
          args: [
            DEX_CONTRACT,
            toWei(tokenValue as string || "0"),
          ]
        });
        await swapTokenToNative({
          args: [
            toWei(tokenValue as string || "0")
          ]
        });
        alert("Swap executed successfully");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while trying to execute the swap");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContractBalance();
    const interval = setInterval(fetchContractBalance, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if(!amountToGet) return;
    if(currentFrom === "native") {
      setTokenValue(toEther(amountToGet));
    } else {
      setNativeValue(toEther(amountToGet));
    }
  }, [amountToGet]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div style={{
          backgroundColor: "#111",
          padding: "2rem",
          borderRadius: "10px",
          minWidth: "500px",
        }}>
          <div>
            <SwapInput
              current={currentFrom as string}
              type="native"
              max={nativeBalance?.displayValue}
              value={nativeValue as string}
              setValue={setNativeValue}
              tokenSymbol="ETH"
              tokenBalance={nativeBalance?.displayValue}
            />
            <button
              onClick={() => 
                currentFrom === "native"
                  ? setCurrentFrom("token")
                  : setCurrentFrom("native")
              }
              className={styles.toggleButton}
            >↓</button>
            <SwapInput
              current={currentFrom as string}
              type="token"
              max={tokenBalance?.displayValue}
              value={tokenValue as string}
              setValue={setTokenValue}
              tokenSymbol={symbol as string}
              tokenBalance={tokenBalance?.displayValue}
            />
          </div>
          {address ? (
            <div style={{
              textAlign: "center",
            }}>
              <button
                onClick={executeSwap}
                disabled={isLoading as boolean}
                className={styles.swapButton}
              >{
                isLoading
                  ? "Loading..."
                  : "Swap"  
              }</button>
            </div>
          ) : (
            <p>Connect wallet to exchange.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
