// components/Users.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUsers,
  selectAllUsers,
  selectUsersStatus
} from '../features/api/apiSlice';

const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  const status = useSelector(selectUsersStatus);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (users) {
      setFilteredUsers(
        users.filter(user =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, users]);

  if (status === 'loading') {
    return <div className="loader">👥 यूजर्स लोड होत आहेत...</div>;
  }

  return (
    <div className="users-container">
      <h2>👥 यूजर्स लिस्ट</h2>
      
      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 नाव किंवा ईमेलने शोधा..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="stats-card">
        <p>एकूण यूजर्स: {users?.length || 0}</p>
        <p>फिल्टर केलेले: {filteredUsers.length}</p>
      </div>

      <div className="users-grid">
        {filteredUsers.map((user, index) => (
          <div key={user.id || index} className="user-card">
            <div className="user-avatar">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div className="user-info">
              <h3>{user.name}</h3>
              <p>✉️ {user.email}</p>
              <p>📞 {user.phone || 'फोन नाही'}</p>
              <p>📍 {user.address?.city || user.city || 'शहर नाही'}</p>
              <p>🏢 {user.company?.name || user.companyName || 'कंपनी नाही'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;