import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/api';

function ApproveUsers() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');
  const [pendingUsers, setPendingUsers] = useState([]);

  const fetchPendingUsers = async () => {
    if (!groupName) return;

    try {
      const response = await fetch(`${BASE_URL}/api/users/pending/${groupName}`);
      if (response.ok) {
        const data = await response.json();
        setPendingUsers(data);
      } else {
        alert('Error fetching pending users.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong.');
    }
  };

  const approveUser = async (userId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/approve/${userId}`, {
        method: 'POST',
      });
      if (response.ok) {
        alert('User approved successfully!');
        fetchPendingUsers(); 
      } else {
        alert('Error approving user.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Approve Users</h2>

      <input
        type="text"
        placeholder="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        style={{ margin: '10px', padding: '10px', width: '200px' }}
      />
      <br />
      <button onClick={fetchPendingUsers} style={{ margin: '10px', padding: '10px 20px' }}>
        Fetch Pending Users
      </button>

      {pendingUsers.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Pending Users:</h3>
          {pendingUsers.map((user) => (
            <div key={user.userId} style={{ marginBottom: '10px' }}>
              {user.username}
              <button
                onClick={() => approveUser(user.userId)}
                style={{ marginLeft: '10px', padding: '5px 10px' }}
              >
                Approve
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ApproveUsers;
