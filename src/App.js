// import { Routes, Route, useNavigate } from 'react-router-dom';
// import CreateGroup from './pages/CreateGroup';
// import JoinGroup from './pages/JoinGroup'; // NEW import
// import ApproveUsers from './pages/ApproveUsers'; // NEW import

// function App() {
//   const navigate = useNavigate();

//   return (
//     <div>
//       <h1>Home Inventory Management</h1>
//       <button onClick={() => navigate('/create-group')}>Create Group</button>
//       <button onClick={() => navigate('/join-group')}>Join Group</button>
//       <button onClick={() => navigate('/approve-users')}>Approve Users</button> {/* NEW button */}

//       <Routes>
//         <Route path="/create-group" element={<CreateGroup />} />
//         <Route path="/join-group" element={<JoinGroup />} />
//         <Route path="/approve-users" element={<ApproveUsers />} /> {/* NEW route */}
//       </Routes>
//     </div>
//   );
// }

// export default App;

import { Routes, Route, useNavigate } from 'react-router-dom';
import LoginSignupPage from './pages/LoginSignupPage';
import DashboardPage from './pages/DashboardPage'; // We'll create next
import CreateGroup from './pages/CreateGroup'; // Already exists
import JoinGroup from './pages/JoinGroup'; // Already exists
import JoinGroupPage from './pages/JoinGroupPage';
import CreateGroupPage from './pages/CreateGroupPage';
import GroupDetailsPage from './pages/GroupDetailsPage';

function App() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Home Inventory Management app</h1>
      <Routes>
        <Route path="/" element={<LoginSignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/create-group" element={<CreateGroupPage />} />
        <Route path="/join-group" element={<JoinGroupPage />} />
        <Route path="/group/:groupId" element={<GroupDetailsPage />} />
      </Routes>
    </div>
  );
}

export default App;

