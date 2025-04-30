import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function JoinGroupPage() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = localStorage.getItem('loggedInUsername');

    if (!username) {
      alert('You must be logged in.');
      navigate('/');
      return;
    }

    const params = new URLSearchParams();
    params.append('username', username);
    params.append('groupName', groupName);

    try {
      const response = await fetch(`http://localhost:8080/api/users/join?${params.toString()}`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('Join request sent successfully!');
        navigate('/dashboard');
      } else {
        const errorData = await response.text();
        
        if (errorData.includes('already requested') || errorData.includes('already a member')) {
          alert('You have already requested to join or you are already a member of this group.');
        } else if (errorData.includes('Group not found')) {
          alert('Group not found. Please check the group name.');
        } else {
          alert(`Error: ${errorData}`);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Join an Existing Group</h2>
      <form onSubmit={handleSubmit} style={{ marginTop: '30px' }}>
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          required
          style={{ margin: '10px', padding: '10px', width: '250px' }}
        />
        <br />
        <button type="submit" style={{ marginTop: '20px', padding: '10px 20px' }}>
          Send Join Request
        </button>
      </form>
    </div>
  );
}

export default JoinGroupPage;
