// client/src/components/ChatList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';

function ChatList({ user, setCurrentChat }) {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get(`/api/users/online?userId=${user._id}`);
      setOnlineUsers(res.data);
    };
    fetchUsers();
  }, [user]);

  return (
    <div className="chat-list">
      <h3>Online Users</h3>
      <ul>
        {onlineUsers.map((onlineUser) => (
          <li key={onlineUser._id} onClick={() => setCurrentChat(onlineUser)}>
            {onlineUser.username}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatList;
