// client/src/Chat.js
import React, { useState, useEffect } from 'react';
import socket from './socket';
import axios from 'axios';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    // Fetch messages and online users initially
    const fetchMessages = async () => {
      const res = await axios.get('/api/messages');
      setMessages(res.data);
    };
    fetchMessages();

    // Listen for incoming messages
    socket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Fetch online users
    const fetchUsers = async () => {
      const res = await axios.get('/api/users/online');
      setOnlineUsers(res.data);
    };
    fetchUsers();

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const sendMessage = () => {
    const msg = { sender: 'user_id', text: message }; // Replace with actual sender ID
    socket.emit('sendMessage', msg);
    setMessage('');
  };

  return (
    <div>
      <h3>Online Users</h3>
      <ul>
        {onlineUsers.map((user) => (
          <li key={user._id}>{user.username}</li>
        ))}
      </ul>
      <h3>Chat</h3>
      <div>
        {messages.map((msg, idx) => (
          <div key={idx}>{msg.text}</div>
        ))}
      </div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
