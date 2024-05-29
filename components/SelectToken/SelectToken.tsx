"use client";

import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';

type Coin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
};

type SelectTokenProps = {
  coins: Coin[];
  handleSelectChange: (coinId: string) => void;
  selectedCoin: Coin | null;
};

const SelectToken: React.FC<SelectTokenProps> = ({
  coins = [], // Default value to prevent undefined error
  handleSelectChange,
  selectedCoin,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSelect = (coinId: string) => {
    handleSelectChange(coinId);
    setDropdownOpen(false); // Close the dropdown after selection
  };

  return (
    <div style={{ alignItems: "center", display: 'flex', justifyContent: "center", width: "100%" }}>
      <Dropdown show={dropdownOpen} onToggle={(isOpen) => setDropdownOpen(isOpen)} className="flex-grow-1">
        <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="d-flex align-items-center">
          {selectedCoin ? (
            <>
              <img 
                src={selectedCoin.image} 
                alt={selectedCoin.id} 
                style={{ width: '20px', height: '20px', marginRight: '10px' }} 
              />
              {selectedCoin.symbol.toUpperCase()}
            </>
          ) : (
            'Select Coin'
          )}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {coins.map((coin) => (
            <Dropdown.Item key={coin.id} eventKey={coin.id} onClick={() => handleSelect(coin.id)} className="d-flex align-items-center">
              <img src={coin.image} alt={coin.id} style={{ width: '20px', height: '20px', marginRight: '10px' }} />
              {coin.symbol.toUpperCase()}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default SelectToken;
