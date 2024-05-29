import React from 'react';
import styles from '../styles/Home.module.css';
import SelectToken from './SelectToken/SelectToken';

type Coin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
};

type Props = {
  type: "native" | "token";
  tokenSymbol?: string;
  tokenBalance?: string;
  current: string;
  setValue: (value: string) => void;
  max?: string;
  value: string;
  coins: Coin[];
  handleSelectChange: (coinId: string) => void;
  selectedCoin: Coin | null;
};

export default function SwapInput({
  type,
  tokenSymbol,
  tokenBalance,
  setValue,
  value,
  current,
  max,
  coins,
  handleSelectChange,
  selectedCoin,
}: Props) {
  const truncate = (value: string) => {
    if (value === undefined) return;
    if (value.length > 5) {
      return value.slice(0, 5);
    }
    return value;
  };

  return (
    <div className={styles.swapInputContainer}>
      <div className={styles.swapInputWrapper}>
        <input
          type="number"
          placeholder="0.0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={current !== type}
          className={styles.swapInput}
        />
        <div className={styles.tokenInfo}>
          <SelectToken
            coins={coins}
            handleSelectChange={handleSelectChange}
            selectedCoin={selectedCoin}
          />
          <span className={styles.tokenSymbol}>{tokenSymbol}</span>
          <span className={styles.tokenBalance}>
            Balance: {truncate(tokenBalance as string)}
          </span>
          {current === type && (
            <button onClick={() => setValue(max || '0')} className={styles.maxButton}>
              Max
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
