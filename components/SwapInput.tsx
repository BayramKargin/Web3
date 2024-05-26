import React from "react";
import styles from "../styles/Home.module.css";

type Props = {
  type: "native" | "token";
  tokenSymbol?: string;
  tokenBalance?: string;
  current: string;
  setValue: (value: string) => void;
  max?: string;
  value: string;
};

export default function SwapInput({
  type,
  tokenSymbol,
  tokenBalance,
  setValue,
  value,
  current,
  max,
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
      <span className={styles.tokenSymbol}>{tokenSymbol}</span>
      <span className={styles.tokenBalance}>Balance: {truncate(tokenBalance as string)}</span>
      {current === type && (
        <button onClick={() => setValue(max || "0")} className={styles.maxButton}>Max</button>
      )}
    </div>
  </div>
</div>
  )
}