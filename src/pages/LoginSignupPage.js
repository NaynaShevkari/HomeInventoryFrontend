import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginSignupPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setUsername('');
    setPassword('');
    setDisplayName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    if (!isLogin) {
      params.append('displayName', displayName);
    }
  
    try {
      const url = isLogin
        ? `http://localhost:8080/api/auth/login`
        : `http://localhost:8080/api/auth/signup`;
  
      const response = await fetch(`${url}?${params.toString()}`, {
        method: 'POST',
      });
  
      if (response.ok) {
        if (isLogin) {
          const data = await response.json(); // Login returns user object
          localStorage.setItem('loggedInUsername', data.username);
          localStorage.setItem('displayName', data.displayName);
        } else {
          const message = await response.text(); // Signup returns plain text
          console.log('Signup response:', message);
          localStorage.setItem('loggedInUsername', username);
          localStorage.setItem('displayName', displayName);
        }
  
        alert(isLogin ? 'Login successful!' : 'Signup successful!');
        navigate('/dashboard');
      } else {
        const errorData = await response.text();
        alert(`Error: ${errorData}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong.');
    }
  };
  

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>{isLogin ? 'Login' : 'Signup'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ margin: '10px', padding: '10px', width: '200px' }}
        />
        <br />
        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              style={{ margin: '10px', padding: '10px', width: '200px' }}
            />
            <br />
          </>
        )}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ margin: '10px', padding: '10px', width: '200px' }}
        />
        <br />
        <button type="submit" style={{ margin: '10px', padding: '10px 20px' }}>
          {isLogin ? 'Login' : 'Signup'}
        </button>
      </form>
      <div style={{ marginTop: '20px' }}>
        <button onClick={toggleMode} style={{ padding: '5px 10px' }}>
          {isLogin ? 'New user? Signup' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
}

export default LoginSignupPage;
