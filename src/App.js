import { Routes, Route, useNavigate } from 'react-router-dom';
import LoginSignupPage from './pages/LoginSignupPage';
import DashboardPage from './pages/DashboardPage'; 
import JoinGroupPage from './pages/JoinGroupPage';
import CreateGroupPage from './pages/CreateGroupPage';
import GroupDetailsPage from './pages/GroupDetailsPage';

function App() {
  const navigate = useNavigate();

  return (
    <div>
      {/* <h1>Home Inventory Management app</h1> */}
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

