
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InventorySection from './InventorySection';
import ShoppingListSection from './ShoppingListSection';
import GroupMenu from './GroupMenu';


function GroupDetailsPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState('');
  const [approvedMembers, setApprovedMembers] = useState([]);
  const [pendingMembers, setPendingMembers] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('inventory');
  const [inventoryItems, setInventoryItems] = useState([]);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const groupRes = await fetch(`http://localhost:8080/api/groups/id/${groupId}`);
        const groupData = await groupRes.json();
        setGroupName(groupData.groupName);

        const approvedRes = await fetch(`http://localhost:8080/api/groups/${groupId}/members`);
        const approvedData = await approvedRes.json();
        setApprovedMembers(approvedData);

        const pendingRes = await fetch(`http://localhost:8080/api/groups/${groupId}/pending-members`);
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
          const res = await fetch(`http://localhost:8080/api/inventory/${groupName}`);
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
      const res = await fetch(`http://localhost:8080/api/users/approve/${membershipId}`, {
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
      const res = await fetch(`http://localhost:8080/api/groups/${groupId}/exit?username=${username}`, {
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

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <div onClick={() => setMenuOpen(!menuOpen)} style={{ fontSize: '24px', cursor: 'pointer' }}>
          &#9776;
        </div>
      </div>

{menuOpen && (
  <GroupMenu
    groupName={groupName}
    displayName={displayName}
    approvedMembers={approvedMembers}
    pendingMembers={pendingMembers}
    onApprove={handleApprove}
    onLogout={handleLogout}
    onExitGroup={handleExitGroup}
  />
)}
      <div style={{ marginTop: '30px' }}>
        <button onClick={() => setSelectedTab('inventory')} style={{ marginRight: '10px' }}>
          Inventory
        </button>
        <button onClick={() => setSelectedTab('shopping')}>
          Shopping List
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        {selectedTab === 'inventory' && <InventorySection groupName={groupName} />}

        {selectedTab === 'shopping' && <ShoppingListSection groupName={groupName} />}
      </div>

      <button onClick={() => navigate('/dashboard')} style={{ marginTop: '40px' }}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default GroupDetailsPage;
