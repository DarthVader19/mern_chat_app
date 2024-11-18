// client/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Auth from './components/Auth';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import socket from './socket';

function App() {
  const [user, setUser] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);

  useEffect(() => {
    // Connect socket once user is authenticated
    if (user) {
      socket.emit('userConnected', user._id);
    }
  }, [user]);

  return (
    <Router>
      <div>
        {!user ? (
          <Auth onAuth={(authUser) => setUser(authUser)} />
        ) : (
          <div className="chat-container">
            <ChatList user={user} setCurrentChat={setCurrentChat} />
            {currentChat && <ChatWindow currentUser={user} chatPartner={currentChat} />}
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
