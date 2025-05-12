import React from 'react';
import { useNavigate } from 'react-router-dom';

function GroupMenu({ groupName, displayName, approvedMembers, pendingMembers, onApprove, onLogout, onExitGroup }) {
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
      <hr style={{ margin: '10px 0' }} />
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
      <hr style={{ margin: '10px 0' }} />
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

      <hr style={{ margin: '10px 0' }} />
      <button onClick={onExitGroup} style={{ marginBottom: '10px', padding: '6px 12px', backgroundColor: '#f5f5f5', border: '1px solid #ccc' }}>
        Exit Group
      </button>
      <button onClick={onLogout} style={{ padding: '6px 12px', backgroundColor: '#ffe0e0', border: '1px solid #ccc' }}>
        Logout
      </button>
    </div>
  );
}

export default GroupMenu;
