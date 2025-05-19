import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InventorySection from './InventorySection';
import ShoppingListSection from './ShoppingListSection';
import GroupMenu from './GroupMenu';
import { BASE_URL } from '../utils/api';

function GroupDetailsPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState('');
  const [approvedMembers, setApprovedMembers] = useState([]);
  const [pendingMembers, setPendingMembers] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('inventory');
  const [inventoryItems, setInventoryItems] = useState([]);

  const menuRef = useRef(null);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const groupRes = await fetch(`${BASE_URL}/api/groups/id/${groupId}`);
        const groupData = await groupRes.json();
        setGroupName(groupData.groupName);

        const approvedRes = await fetch(`${BASE_URL}/api/groups/${groupId}/members`);
        const approvedData = await approvedRes.json();
        setApprovedMembers(approvedData);

        const pendingRes = await fetch(`${BASE_URL}/api/groups/${groupId}/pending-members`);
        const pendingData = await pendingRes.json();
        setPendingMembers(pendingData);
      } catch (error) {
        console.error('Error loading group data:', error);
      }
    };
    fetchGroupDetails();
  }, [groupId]);

  useEffect(() => {
    const fetchInventory = async () => {
      if (groupName) {
        try {
          const res = await fetch(`${BASE_URL}/api/inventory/${groupName}`);
          const data = await res.json();
          setInventoryItems(data);
        } catch (error) {
          console.error('Error fetching inventory:', error);
        }
      }
    };
    fetchInventory();
  }, [groupName]);

  const handleApprove = async (membershipId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/users/approve/${membershipId}`, {
        method: 'POST'
      });
      if (res.ok) {
        alert('User approved!');
        window.location.reload();
      } else {
        alert('Error approving user.');
      }
    } catch (err) {
      console.error('Approval error:', err);
    }
  };

  const displayName = localStorage.getItem('displayName');

  const handleLogout = () => {
    localStorage.removeItem('loggedInUsername');
    localStorage.removeItem('displayName');
    navigate('/');
  };

  const handleExitGroup = async () => {
    const confirmExit = window.confirm("Are you sure you want to exit this group?");
    if (!confirmExit) return;

    const username = localStorage.getItem('loggedInUsername');
    try {
      const res = await fetch(`${BASE_URL}/api/groups/${groupId}/exit?username=${username}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert("You have exited the group.");
        navigate('/dashboard');
      } else {
        alert("Failed to exit group.");
      }
    } catch (err) {
      console.error("Exit group error:", err);
    }
  };

    useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f7fa',
      minHeight: '100vh',
      boxSizing: 'border-box'
    }}>
      {/* Top Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ fontSize: '1.2rem', color: '#333', margin: 0 }}>{groupName}</h2>
        <div
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            fontSize: '28px',
            cursor: 'pointer',
            backgroundColor: '#fff',
            borderRadius: '6px',
            padding: '6px 12px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}
        >
          ☰
        </div>
      </div>

      {/* Side Menu */}
      {menuOpen && (
        <div ref={menuRef}>
        <GroupMenu
          groupName={groupName}
          displayName={displayName}
          approvedMembers={approvedMembers}
          pendingMembers={pendingMembers}
          onApprove={handleApprove}
          onLogout={handleLogout}
          onExitGroup={handleExitGroup}
        />
        </div>
      )}

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginTop: '25px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setSelectedTab('inventory')}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            border: selectedTab === 'inventory' ? '2px solid #4a6ee0' : '1px solid #ccc',
            backgroundColor: selectedTab === 'inventory' ? '#e8edff' : '#fff',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          📦 Inventory
        </button>
        <button
          onClick={() => setSelectedTab('shopping')}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            border: selectedTab === 'shopping' ? '2px solid #12b76a' : '1px solid #ccc',
            backgroundColor: selectedTab === 'shopping' ? '#e6f9f0' : '#fff',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          🛒 Shopping List
        </button>
      </div>

      {/* Section View */}
      <div style={{ marginTop: '20px' }}>
        {selectedTab === 'inventory' && <InventorySection groupName={groupName} />}
        {selectedTab === 'shopping' && <ShoppingListSection groupName={groupName} />}
      </div>

      {/* Back Button */}
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #ccc',
            borderRadius: '6px',
            padding: '10px 16px',
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          ⬅ Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default GroupDetailsPage;

