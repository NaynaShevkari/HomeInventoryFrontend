import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/api';

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
      const response = await fetch(`${BASE_URL}/api/users/join?${params.toString()}`, {
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
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '450px',
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        textAlign: 'center'
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '1.6rem',
          fontWeight: 'bold',
          color: '#333'
        }}>
          Join an Existing Group
        </h2>
        <p style={{ color: '#666', fontSize: '0.95rem', marginTop: '8px' }}>
          Enter the group name to send a join request
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: '25px' }}>
          <input
            type="text"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '1rem',
              border: '1px solid #ccc',
              borderRadius: '8px',
              marginBottom: '20px',
              outline: 'none',
              transition: '0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#12b76a'}
            onBlur={(e) => e.target.style.borderColor = '#ccc'}
          />

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px 20px',
              backgroundColor: '#12b76a',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background 0.2s',
              marginBottom: '15px'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0f9b5c'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#12b76a'}
          >
            🔗 Send Join Request
          </button>
        </form>

        <button
          onClick={() => navigate('/dashboard')}
          style={{
            backgroundColor: 'transparent',
            color: '#666',
            border: 'none',
            fontSize: '0.95rem',
            textDecoration: 'underline',
            cursor: 'pointer',
            marginTop: '5px'
          }}
        >
          ⬅ Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default JoinGroupPage;
