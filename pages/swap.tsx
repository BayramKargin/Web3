import React, { useEffect, useState } from "react";
import SelectToken from "../components/SelectToken/SelectToken";
import styles from '../styles/Swap.module.css';

type Coin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
};

const Swap: React.FC = () => {
  const [amount1, setAmount1] = useState<number>(0);
  const [amount2, setAmount2] = useState<number>(0);
  const [selectedCoin1, setSelectedCoin1] = useState<Coin | null>(null);
  const [selectedCoin2, setSelectedCoin2] = useState<Coin | null>(null);
  const [estimatedGas, setEstimatedGas] = useState<string>("");

  const [coins, setCoins] = useState<Coin[]>([]);

  const handleSelectChange1 = (coinId: string) => {
    const coin = coins.find((c) => c.id === coinId) || null;
    setSelectedCoin1(coin);
  };

  const handleSelectChange2 = (coinId: string) => {
    const coin = coins.find((c) => c.id === coinId) || null;
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

    fetchCoinGecko();
  }, []);

  useEffect(() => {
    if (selectedCoin1 && selectedCoin2) {
      const amountLast =
        (selectedCoin1.current_price * amount1) /
        selectedCoin2.current_price;

      setAmount2(amountLast);
    }
  }, [selectedCoin1, amount1, selectedCoin2]);

  return (
    <div className={styles.swapContainer}>
      <h2 className={styles.swapHeader}>Token Swap</h2>
      <div className={styles.swapBox}>
        <div className={styles.inputGroup}>
          {coins.length > 0 ? (
            <SelectToken
              coins={coins}
              handleSelectChange={handleSelectChange1}
              selectedCoin={selectedCoin1}
            />
          ) : (
            <p>Loading coins...</p>
          )}
          <input
            type="number"
            placeholder="Amount"
            value={amount1}
            onChange={(e) => setAmount1(parseFloat(e.target.value))}
            className="custom-input ml-2"
            style={{ width: "100%" }}
          />
        </div>

        <div className={styles.inputGroup}>
          {coins.length > 0 ? (
            <SelectToken
              coins={coins}
              handleSelectChange={handleSelectChange2}
              selectedCoin={selectedCoin2}
            />
          ) : (
            <p>Loading coins...</p>
          )}
          <input
            type="number"
            placeholder="Amount"
            value={amount2}
            className="custom-input ml-2"
            style={{ width: "100%" }}
            readOnly
          />
        </div>

        <div className={styles.estimatedGas}>
          <label>Estimated Gas: {estimatedGas}</label>
        </div>
        <button
          className={styles.swapButton}
          onClick={() => {
            // Swap function call
          }}
        >
          Swap
        </button>
      </div>
    </div>
  );
};

export default Swap;
