// client/src/components/ChatWindow.js
import React, { useState, useEffect } from 'react';
import socket from '../socket';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';

function ChatWindow({ currentUser, chatPartner }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await axios.get(`/api/messages/${chatPartner._id}`);
      setMessages(res.data);
    };
    fetchMessages();

    socket.on('receiveMessage', (message) => {
      if (message.sender === chatPartner._id || message.receiver === chatPartner._id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [chatPartner]);

  const sendMessage = async () => {
    const messageData = {
      sender: currentUser._id,
      receiver: chatPartner._id,
      text: newMessage,
    };
    socket.emit('sendMessage', messageData);
    setMessages((prev) => [...prev, messageData]);
    setNewMessage('');
  };

  return (
    <div className="chat-window">
      <h3>Chat with {chatPartner.username}</h3>
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender === currentUser._id ? 'sent' : 'received'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatWindow;
