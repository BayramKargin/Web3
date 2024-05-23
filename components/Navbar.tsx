import React from 'react';

import ConnectWallet from './ConnectWallet/ConnectWallet';
// import { ConnectWallet } from "@thirdweb-dev/react";
import WSCoin from './WSCoin/WSCoin';
import Link from 'next/link';
import Image from 'next/image';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Image src="/images/logoblue.png" width={35} height={35} alt="Logo" />
        <div className="navbar-links"> <Link href="/">BABU</Link></div>
      </div>
      <div className="navbar-links">
        <Link href="/chat">Chat</Link>
        <Link href="/swap">Swap</Link>
        <a href="#trade">Trade</a>
        <div className="dropdown">
          <a href="#pool">Pool</a>
          <div className="dropdown-content">
            <a href="#pool1">Pool 1</a>
            <a href="#pool2">Pool 2</a>
          </div>
        </div>
        <a href="#launch">Launch</a>
        <a href="#portfolio">Portfolio</a>
      </div>
      <div className="navbar-right">
        <span className="navbar-balance"><div><WSCoin /></div></span>
        <div className="headerItem"><ConnectWallet /></div>
      </div>
    </nav>
  );
};

export default Navbar;
