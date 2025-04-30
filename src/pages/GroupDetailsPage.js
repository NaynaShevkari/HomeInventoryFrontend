import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function GroupDetailsPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState('');
  const [approvedMembers, setApprovedMembers] = useState([]);
  const [pendingMembers, setPendingMembers] = useState([]);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const groupResponse = await fetch(`http://localhost:8080/api/groups/id/${groupId}`);
        const groupData = await groupResponse.json();
        setGroupName(groupData.groupName);

        const approvedResponse = await fetch(`http://localhost:8080/api/groups/${groupId}/members`);
        const approvedData = await approvedResponse.json();
        setApprovedMembers(approvedData);

        const pendingResponse = await fetch(`http://localhost:8080/api/groups/${groupId}/pending-members`);
        const pendingData = await responseHandler(pendingResponse);
        setPendingMembers(pendingData);
      } catch (error) {
        console.error('Error fetching group details:', error);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  const responseHandler = async (res) => {
    if (res.ok) {
      return res.json();
    } else {
      const errorText = await res.text();
      throw new Error(errorText);
    }
  };

  const handleApprove = async (membershipId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/approve/${membershipId}`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('User approved!');
        window.location.reload();
      } else {
        const errorText = await response.text();
        alert(`Error: ${errorText}`);
      }
    } catch (error) {
      alert('Something went wrong.');
      console.error('Approval error:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Group: {groupName}</h2>

      <h3 style={{ marginTop: '30px' }}>Approved Members</h3>
      {approvedMembers.length > 0 ? (
        approvedMembers.map((user) => (
          <div key={user.userId} style={{ marginBottom: '8px' }}>
            <strong>{user.displayName}</strong> ({user.username})
          </div>
        ))
      ) : (
        <p>No approved members yet.</p>
      )}

      <h3 style={{ marginTop: '30px' }}>Pending Join Requests</h3>
      {pendingMembers.length > 0 ? (
        pendingMembers.map((membership) => (
          <div
            key={membership.membershipId}
            style={{
              border: '1px solid gray',
              borderRadius: '8px',
              padding: '10px',
              marginBottom: '10px',
              textAlign: 'left'
            }}
          >
            <strong>{membership.user.displayName}</strong> ({membership.user.username})
            <br />
            <button onClick={() => handleApprove(membership.membershipId)} style={{ marginTop: '5px' }}>
              Approve
            </button>
          </div>
        ))
      ) : (
        <p>No pending requests.</p>
      )}

      <button onClick={() => navigate('/dashboard')} style={{ marginTop: '40px' }}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default GroupDetailsPage;
