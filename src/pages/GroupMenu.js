import React from 'react';

function GroupMenu({ groupName, displayName, approvedMembers, pendingMembers, onApprove, onLogout, onExitGroup }) {
  const getInitials = (name) => {
    return name.charAt(0).toUpperCase();
  };

  const menuStyles = {
    container: {
      position: 'absolute',
      top: '60px',
      right: '20px',
      width: '280px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      border: '1px solid #e5e7eb',
      overflow: 'hidden',
      zIndex: 50,
    },
    header: {
      backgroundColor: '#2563eb', // blue-600
      padding: '16px',
      color: 'white',
    },
    title: {
      fontSize: '18px',
      fontWeight: 'bold',
      margin: 0,
    },
    greeting: {
      fontSize: '14px',
      color: '#bfdbfe', // blue-100
      margin: '4px 0 0 0',
    },
    section: {
      padding: '16px',
      borderBottom: '1px solid #e5e7eb',
    },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '12px',
    },
    sectionIcon: {
      width: '18px',
      height: '18px',
      marginRight: '8px',
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '500',
      color: '#1f2937', // gray-800
      margin: 0,
    },
    memberList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    memberItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '6px 0',
    },
    avatar: {
      width: '28px',
      height: '28px',
      backgroundColor: '#dbeafe', // blue-100
      color: '#2563eb', // blue-600
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '500',
      marginRight: '8px',
      fontSize: '14px',
    },
    pendingAvatar: {
      width: '28px',
      height: '28px',
      backgroundColor: '#f3f4f6', // gray-100
      color: '#4b5563', // gray-600
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '500',
      marginRight: '8px',
      fontSize: '14px',
    },
    memberName: {
      fontSize: '14px',
      fontWeight: '500',
    },
    memberUsername: {
      fontSize: '12px',
      color: '#6b7280', // gray-500
      display: 'block',
    },
    pendingItem: {
      backgroundColor: '#f9fafb', // gray-50
      borderRadius: '6px',
      padding: '8px',
      marginBottom: '8px',
    },
    approveButton: {
      width: '100%',
      marginTop: '8px',
      padding: '6px 0',
      backgroundColor: '#10b981', // green-500
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
    },
    noItemsText: {
      fontSize: '14px',
      fontStyle: 'italic',
      color: '#6b7280', // gray-500
    },
    actions: {
      padding: '16px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '8px',
    },
    exitButton: {
      padding: '8px 12px',
      backgroundColor: '#f3f4f6', // gray-100
      color: '#4b5563', // gray-600
      border: 'none',
      borderRadius: '4px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoutButton: {
      padding: '8px 12px',
      backgroundColor: '#fee2e2', // red-100
      color: '#b91c1c', // red-700
      border: 'none',
      borderRadius: '4px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonIcon: {
      marginRight: '4px',
      width: '16px',
      height: '16px',
    },
    badge: {
      backgroundColor: '#ef4444', // red-500
      color: 'white',
      fontSize: '12px',
      borderRadius: '9999px',
      padding: '2px 6px',
      marginLeft: '6px',
    },
  };

  return (
    <div style={menuStyles.container}>
      {/* Header */}
      <div style={menuStyles.header}>
        <h3 style={menuStyles.title}>{groupName}</h3>
        <p style={menuStyles.greeting}>Hello, {displayName}</p>
      </div>
      
      {/* Members Section */}
      <div style={menuStyles.section}>
        <div style={menuStyles.sectionHeader}>
          {/* User icon */}
          <svg 
            style={menuStyles.sectionIcon}
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <h4 style={menuStyles.sectionTitle}>Members</h4>
        </div>
        
        <ul style={menuStyles.memberList}>
          {approvedMembers && approvedMembers.length > 0 ? (
            approvedMembers.map((user) => (
              <li key={user.userId} style={menuStyles.memberItem}>
                <div style={menuStyles.avatar}>
                  {getInitials(user.displayName)}
                </div>
                <div>
                  <span style={menuStyles.memberName}>{user.displayName}</span>
                  <span style={menuStyles.memberUsername}>@{user.username}</span>
                </div>
              </li>
            ))
          ) : (
            <p style={menuStyles.noItemsText}>No members yet.</p>
          )}
        </ul>
      </div>
      
      {/* Pending Requests Section */}
      <div style={menuStyles.section}>
        <div style={menuStyles.sectionHeader}>
          {/* User plus icon */}
          <svg 
            style={menuStyles.sectionIcon}
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="8.5" cy="7" r="4"></circle>
            <line x1="20" y1="8" x2="20" y2="14"></line>
            <line x1="23" y1="11" x2="17" y2="11"></line>
          </svg>
          <h4 style={menuStyles.sectionTitle}>Pending Requests</h4>
          {pendingMembers && pendingMembers.length > 0 && (
            <span style={menuStyles.badge}>
              {pendingMembers.length}
            </span>
          )}
        </div>
        
        {pendingMembers && pendingMembers.length > 0 ? (
          <div>
            {pendingMembers.map((membership) => (
              <div key={membership.membershipId} style={menuStyles.pendingItem}>
                <div style={menuStyles.memberItem}>
                  <div style={menuStyles.pendingAvatar}>
                    {getInitials(membership.user.displayName)}
                  </div>
                  <div>
                    <div style={menuStyles.memberName}>{membership.user.displayName}</div>
                    <div style={menuStyles.memberUsername}>@{membership.user.username}</div>
                  </div>
                </div>
                <button 
                  onClick={() => onApprove(membership.membershipId)} 
                  style={menuStyles.approveButton}
                >
                  Approve Request
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p style={menuStyles.noItemsText}>No pending requests.</p>
        )}
      </div>
      
      {/* Actions */}
      <div style={menuStyles.actions}>
        <button onClick={onExitGroup} style={menuStyles.exitButton}>
          {/* Exit icon */}
          <svg
            style={menuStyles.buttonIcon}
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Exit Group
        </button>
        
        <button onClick={onLogout} style={menuStyles.logoutButton}>
          {/* Logout icon */}
          <svg
            style={menuStyles.buttonIcon}
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}

export default GroupMenu;