import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function JoinGroup() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    params.append('groupName', groupName);
    params.append('username', username);

    try {
      const response = await fetch(`http://localhost:8080/api/users/join?${params.toString()}`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('Join request sent successfully! Waiting for approval.');
        navigate('/');
      } else {
        const data = await response.json();
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error joining group:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Join Group</h2>
      <form onSubmit={handleSubmit} style={{ display: 'inline-block', marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          required
          style={{ margin: '10px', padding: '10px', width: '200px' }}
        />
        <br />
        <input
          type="text"
          placeholder="Your Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ margin: '10px', padding: '10px', width: '200px' }}
        />
        <br />
        <button type="submit" style={{ margin: '10px', padding: '10px 20px' }}>
          Join Group
        </button>
      </form>
    </div>
  );
}

export default JoinGroup;
