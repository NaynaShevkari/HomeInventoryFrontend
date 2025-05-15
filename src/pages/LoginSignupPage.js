import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginSignupPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setUsername('');
    setPassword('');
    setDisplayName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
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
        
        navigate('/dashboard');
      } else {
        const errorData = await response.text();
        alert(`Error: ${errorData}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <div style={{textAlign: 'center', marginBottom: '2rem'}}>
          <h1 style={{fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p style={{color: '#666'}}>
            {isLogin ? 'Login to your account' : 'Sign up for a new account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{marginBottom: '1.5rem'}}>
          <div style={{position: 'relative', marginBottom: '1rem'}}>
            <div style={{position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)'}}>
              <span role="img" aria-label="user" style={{fontSize: '18px'}}>👤</span>
            </div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 10px 10px 35px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {!isLogin && (
            <div style={{position: 'relative', marginBottom: '1rem'}}>
              <div style={{position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)'}}>
                <span role="img" aria-label="id-card" style={{fontSize: '18px'}}>📇</span>
              </div>
              <input
                type="text"
                placeholder="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 10px 10px 35px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          <div style={{position: 'relative', marginBottom: '1rem'}}>
            <div style={{position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)'}}>
              <span role="img" aria-label="lock" style={{fontSize: '18px'}}>🔒</span>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 10px 10px 35px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0',
                fontSize: '18px'
              }}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          {isLogin && (
            <div style={{textAlign: 'right', marginBottom: '1rem'}}>
              <button
                type="button"
                onClick={() => alert("Password reset functionality")}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4a6ee0',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  padding: '0'
                }}
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: '#4a6ee0',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '12px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              marginTop: '1rem'
            }}
          >
            {isLoading ? (
              "Loading..."
            ) : (
              <>
                {isLogin ? "🔐 Login" : "✨ Sign Up"}
              </>
            )}
          </button>
        </form>

        <div style={{borderTop: '1px solid #eee', paddingTop: '1rem', textAlign: 'center'}}>
          <button
            onClick={toggleMode}
            style={{
              background: 'none',
              border: 'none',
              color: '#4a6ee0',
              cursor: 'pointer',
              padding: '8px',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginSignupPage;