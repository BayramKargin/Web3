import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import styles from '../styles/Chat.module.css'; // CSS module

const socket = io('http://localhost:4000'); // Backend'in çalıştığı port

interface Message {
  text: string;
  sent: boolean;
}

const Chat: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    // Bağlantı kurulduğunda
    socket.on('connect', () => {
      setIsConnected(true);
    });

    // Bağlantı kesildiğinde
    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Yeni bir mesaj alındığında
    socket.on('message', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, { ...message, sent: false }]);
    });

    // Cleanup function to remove event listeners
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('message');
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const msg: Message = { text: message, sent: true };
      setMessages((prevMessages) => [...prevMessages, msg]);
      socket.emit('message', msg);
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
}

export default Chat;
