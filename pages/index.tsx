import { toEther, toWei, useAddress, useBalance, useContract, useContractRead, useContractWrite, useSDK, useTokenBalance } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import SwapInput from "../components/SwapInput";
import SelectToken from "../components/SelectToken/SelectToken";

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

  type Coin = {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
  };


  const [coins, setCoins] = useState<Coin[]>([]);
  const [coins2, setCoins2] = useState<Coin[]>([]);
  const [selectedCoin1, setSelectedCoin1] = useState<Coin | null>(null);
  const [selectedCoin2, setSelectedCoin2] = useState<Coin | null>(null);


  const coinList = [
    { id: 'babu', symbol: 'babu', name: 'Babu', image: '/images/babulogo.png', current_price: 3000 }
  ];


  const handleSelectChange1 = (coinId: string) => {
    const coin = coins.find((c) => c.id === coinId) || null;
    setSelectedCoin1(coin);
  };

  const handleSelectChange2 = (coinId: string) => {
    const coin = coins2.find((c) => c.id === coinId) || null;
    setSelectedCoin2(coin);
  };

  useEffect(() => {
    const fetchCoinGecko = async () => {
      const urlMarketCapitalTen =
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1";
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-cg-demo-api-key": "CG-EuXL6u3vtLzpKN7yEVzv6cb2",
        },
      };

      try {
        const res = await fetch(urlMarketCapitalTen, options);
        const data = await res.json();
        setCoins(data);
      } catch (err) {
        console.error("error:", err);
      }
    };
    setCoins2(coinList);
    fetchCoinGecko();
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.swapBox}>
          <div className={styles.swapSection}>
            {nativeBalance && tokenBalance ? (
              <>
                <SwapInput
                  current={currentFrom as string}
                  type="native"
                  max={nativeBalance.displayValue || '0'}
                  value={nativeValue as string}
                  setValue={setNativeValue}
                  tokenSymbol={selectedCoin1?.symbol || 'Select a token'}
                  tokenBalance={ selectedCoin1?.symbol === 'eth' ? nativeBalance.displayValue: "0"}
                  coins={coins}
                  handleSelectChange={handleSelectChange1}
                  selectedCoin={selectedCoin1}
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
                  max={tokenBalance.displayValue || '0'}
                  value={tokenValue as string}
                  setValue={setTokenValue}
                  tokenSymbol={selectedCoin2?.symbol || 'Select a token'}
                  tokenBalance={selectedCoin2?.symbol == "babu" ? tokenBalance.displayValue : "0"}
                  coins={coins2}
                  handleSelectChange={handleSelectChange2}
                  selectedCoin={selectedCoin2}
                />
              </>
            ) : (
              <p>Loading balance...</p>
            )}
          </div>
          {address ? (
            <div className={styles.swapButtonContainer}>
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
