import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateGroup() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');
  const [createdBy, setCreatedBy] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    params.append('groupName', groupName);
    params.append('createdBy', createdBy);

    try {
      const response = await fetch(`http://localhost:8080/api/groups/create?${params.toString()}`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('Group created successfully!');
        navigate('/'); // Go back to homepage after success
      } else {
        const data = await response.json();
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <div>
      <h2>Create Group</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="text"
          placeholder="Your Username"
          value={createdBy}
          onChange={(e) => setCreatedBy(e.target.value)}
          required
        />
        <br /><br />
        <button type="submit">Create Group</button>
      </form>
    </div>
  );
}

export default CreateGroup;
