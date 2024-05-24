import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import web3 from '../lib/web3';
import chat, { getMessages } from '../lib/chat';
import styles from '../styles/Chat.module.css';

const socket = io('http://localhost:4000');

interface Message {
  text: string;
  sent: boolean;
}

const Chat: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const blockchainMessages = await getMessages();
        const accounts = await web3.eth.getAccounts();
        const defaultAccount = accounts[0]?.toLowerCase();

        setMessages(blockchainMessages.map((msg: any) => ({
          text: msg.text,
          sent: msg.sender.toLowerCase() === defaultAccount,
        })));
      } catch (error) {
        console.error("Error fetching messages from blockchain:", error);
      }
    };

    fetchMessages();

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('message', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, { ...message, sent: false }]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('message');
    };
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const msg: Message = { text: message, sent: true };
      setMessages((prevMessages) => [...prevMessages, msg]);
      socket.emit('message', msg);

      // Store message on the blockchain
      const accounts = await web3.eth.getAccounts();
      await chat.methods.sendMessage(message).send({
        from: accounts[0],
        gas: "3000000" // Specify a higher gas limit
      });

      setMessage('');
    }
  };

  return (
    <div className={styles.chatContainer}>
      <h1 className={styles.header}>Chat Ekranı</h1>
      <div className={styles.status}>
        {isConnected ? <span style={{ color: 'green' }}>Bağlandı</span> : <span style={{ color: 'red' }}>Bağlantı yok</span>}
      </div>
      <div className={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <div key={index} className={`${styles.message} ${msg.sent ? styles.sent : styles.received}`}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className={styles.inputContainer}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Mesaj yazın..."
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Gönder</button>
      </form>
    </div>
  );
};

export default Chat;
