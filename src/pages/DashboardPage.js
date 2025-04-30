// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// function DashboardPage() {
//   const navigate = useNavigate();
//   const [groups, setGroups] = useState([]);
//   const username = localStorage.getItem('loggedInUsername');
//   const displayName = localStorage.getItem('displayName');

//   useEffect(() => {
//     if (!username) {
//       navigate('/');
//       return;
//     }

//     const fetchGroups = async () => {
//       try {
//         const response = await fetch(`http://localhost:8080/api/users/groups/${username}`);
//         if (response.ok) {
//           const data = await response.json();
//           setGroups(data);
//         } else {
//           console.error('Failed to fetch groups');
//         }
//       } catch (error) {
//         console.error('Error fetching groups:', error);
//       }
//     };

//     fetchGroups();
//   }, [username, navigate]);

//   return (
//     <div style={{ padding: '20px', textAlign: 'center' }}>
//       <h2>Welcome, {displayName}!</h2>

//       <div style={{ marginTop: '30px' }}>
//         <h3>Your Groups:</h3>
//         {groups.length > 0 ? (
//           groups.map((group) => (
//             <div key={group.groupId} style={{ margin: '10px', padding: '10px', border: '1px solid black' }}>
//               {group.groupName}
//             </div>
//           ))
//         ) : (
//           <p>No groups yet. Create or join one!</p>
//         )}
//       </div>

//       <div style={{ marginTop: '30px' }}>
//         <button onClick={() => navigate('/create-group')} style={{ margin: '10px', padding: '10px 20px' }}>
//           Create Group
//         </button>
//         <button onClick={() => navigate('/join-group')} style={{ margin: '10px', padding: '10px 20px' }}>
//           Join Group
//         </button>
//       </div>
//     </div>
//   );
// }

// export default DashboardPage;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const username = localStorage.getItem('loggedInUsername');
  const displayName = localStorage.getItem('displayName');

  useEffect(() => {
    if (!username) {
      navigate('/');
      return;
    }

    const fetchGroups = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/users/groups/${username}`);
        if (response.ok) {
          const data = await response.json();
          setGroups(data);
        } else {
          console.error('Failed to fetch groups');
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, [username, navigate]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Welcome, {displayName}!</h2>

      <div style={{ marginTop: '30px' }}>
        <h3>Your Groups:</h3>
        {groups.length > 0 ? (
          groups.map((group) => (
            <div
              key={group.groupId}
              onClick={() => navigate(`/group/${group.groupId}`)}
              style={{
                cursor: 'pointer',
                padding: '12px',
                margin: '10px auto',
                maxWidth: '400px',
                border: '1px solid black',
                borderRadius: '8px',
                fontWeight: 'bold'
              }}
            >
              {group.groupName}
            </div>
          ))
        ) : (
          <p>No groups yet. Create or join one!</p>
        )}
      </div>

      <div style={{ marginTop: '30px' }}>
        <button onClick={() => navigate('/create-group')} style={{ margin: '10px', padding: '10px 20px' }}>
          Create Group
        </button>
        <button onClick={() => navigate('/join-group')} style={{ margin: '10px', padding: '10px 20px' }}>
          Join Group
        </button>
      </div>
    </div>
  );
}

export default DashboardPage;

