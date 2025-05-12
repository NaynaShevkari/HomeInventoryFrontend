import React from 'react';

function GroupMenu({ groupName, displayName, approvedMembers, pendingMembers, onApprove }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '60px',
        right: '20px',
        background: '#f0f0f0',
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        zIndex: 10,
      }}
    >
      <h3>{groupName}</h3>
      <p style={{ marginTop: '-10px', fontStyle: 'italic', color: '#555' }}>
        Hello {displayName}
      </p>
      <h4>Members</h4>
      {approvedMembers.length > 0 ? (
        approvedMembers.map((user) => (
          <div key={user.userId}>
            {user.displayName} ({user.username})
          </div>
        ))
      ) : (
        <p>No members yet.</p>
      )}

      <h4 style={{ marginTop: '15px' }}>Pending Requests</h4>
      {pendingMembers.length > 0 ? (
        pendingMembers.map((membership) => (
          <div key={membership.membershipId} style={{ marginBottom: '10px' }}>
            {membership.user.displayName} ({membership.user.username})
            <br />
            <button onClick={() => onApprove(membership.membershipId)} style={{ marginTop: '5px' }}>
              Approve
            </button>
          </div>
        ))
      ) : (
        <p>No pending requests.</p>
      )}
    </div>
  );
}

export default GroupMenu;
