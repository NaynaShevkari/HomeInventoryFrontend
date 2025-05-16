import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/api';

function DashboardPage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const username = localStorage.getItem('loggedInUsername');
  const displayName = localStorage.getItem('displayName');
  

  useEffect(() => {
    if (!username) {
      navigate('/');
      return;
    }

    const fetchGroups = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/users/groups/${username}`);
        if (response.ok) {
          const data = await response.json();
          setGroups(data);
        } else {
          console.error('Failed to fetch groups');
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [username, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUsername');
    localStorage.removeItem('displayName');
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header with greeting and logout */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        marginBottom: '25px'
      }}>
        <div>
          <h2 style={{ 
            margin: '0', 
            fontSize: '1.5rem', 
            fontWeight: 'bold',
            color: '#333'
          }}>
            Welcome, {displayName}! 👋
          </h2>
          <p style={{ margin: '5px 0 0', color: '#666', fontSize: '0.9rem' }}>
            Let's manage your home inventory
          </p>
        </div>
        <button 
          onClick={handleLogout}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #e74c3c',
            color: '#e74c3c',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#e74c3c';
            e.currentTarget.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#e74c3c';
          }}
        >
          Logout
        </button>
      </div>

      {/* Action buttons section */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '25px'
      }}>
        <button 
          onClick={() => navigate('/create-group')}
          style={{
            backgroundColor: '#4a6ee0',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            flex: '1',
            minWidth: '150px',
            maxWidth: '220px',
            boxShadow: '0 4px 12px rgba(74, 110, 224, 0.2)'
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>➕</span> Create Group
        </button>
        <button 
          onClick={() => navigate('/join-group')}
          style={{
            backgroundColor: '#12b76a',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            flex: '1',
            minWidth: '150px',
            maxWidth: '220px',
            boxShadow: '0 4px 12px rgba(18, 183, 106, 0.2)'
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>🔗</span> Join Group
        </button>
      </div>

      {/* Groups section */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ 
          margin: '0 0 15px', 
          fontSize: '1.2rem', 
          color: '#333',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '1.2rem' }}>👥</span> Your Groups
        </h3>
        
        {isLoading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '30px',
            color: '#666'
          }}>
            Loading your groups...
          </div>
        ) : groups.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '15px'
          }}>
            {groups.map((group) => (
              <div
                key={group.groupId}
                onClick={() => navigate(`/group/${group.groupId}`)}
                style={{
                  cursor: 'pointer',
                  padding: '20px',
                  borderRadius: '8px',
                  backgroundColor: '#f8faff',
                  border: '1px solid #eaeef9',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = '#4a6ee0';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#eaeef9';
                }}
              >
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '25px',
                  backgroundColor: '#e0e7ff',
                  color: '#4a6ee0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  marginBottom: '12px'
                }}>
                  {group.groupName.charAt(0).toUpperCase()}
                </div>
                <h4 style={{ 
                  margin: '0', 
                  fontSize: '1.1rem', 
                  fontWeight: 'bold',
                  color: '#333',
                  textAlign: 'center'
                }}>
                  {group.groupName}
                </h4>
                <p style={{
                  margin: '5px 0 0',
                  fontSize: '0.9rem',
                  color: '#666',
                  textAlign: 'center'
                }}>
                  Click to view details
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            backgroundColor: '#f8faff',
            borderRadius: '8px',
            color: '#666',
            border: '1px dashed #ccd5e0'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🏠</div>
            <p style={{ fontSize: '1.1rem', margin: '0 0 5px' }}>No groups yet</p>
            <p style={{ fontSize: '0.9rem', margin: '0' }}>Create or join a group to start managing your inventory</p>
          </div>
        )}
      </div>
      
      {/* Footer with version info */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '30px',
        fontSize: '0.8rem',
        color: '#999'
      }}>
        Home Inventory App • v1.0.0
      </div>
    </div>
  );
}

export default DashboardPage;