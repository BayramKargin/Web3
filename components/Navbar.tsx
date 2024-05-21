import React from 'react';

import ConnectWallet from './ConnectWallet/ConnectWallet';
import WSCoin from './WSCoin/WSCoin';
import logo from './Assest/logoblue.png';
import Link from 'next/link';
import Image from 'next/image';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Image src={logo} width={35} alt="Logo" />
        <div className="navbar-links"> <a href="#home">BABU</a></div>
      </div>
      <div className="navbar-links">
        <Link href="/chat">Chat</Link>
        <a href="#trade">Trade</a>
        <div className="dropdown">
          <a href="#pool">Pool</a>
          <div className="dropdown-content">
            <a href="#pool1">Pool 1</a>
            <a href="#pool2">Pool 2</a>
          </div>
        </div>
        <div className="dropdown">
          <a href="#explore">Explore</a>
          <div className="dropdown-content">
            <a href="#explore1">Explore 1</a>
            <a href="#explore2">Explore 2</a>
          </div>
        </div>
        <a href="#launch">Launch</a>
        <a href="#portfolio">Portfolio</a>
        <div className="dropdown">
          <a href="#bridge">Bridge</a>
          <div className="dropdown-content">
            <a href="#bridge1">Bridge 1</a>
            <a href="#bridge2">Bridge 2</a>
          </div>
        </div>
      </div>
      <div className="navbar-right">
        <span className="navbar-balance"><div><WSCoin /></div></span>
        <div className="headerItem"><ConnectWallet /></div>
      </div>
    </nav>
  );
};

export default Navbar;
