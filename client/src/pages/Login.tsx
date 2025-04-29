import '../Login.css';

import { Link, Navigate, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setError(null);
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      console.error('Login error:', err);
    }
  };

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  // return (
  //   <div className='login-container'>
  //     <div className='login-card'>
  //       <div className='login-header'>
  //         <h1>MacSys</h1>
  //         <h2>Login to your account</h2>
  //       </div>

  //       {error && (
  //         <div className='error-message'>
  //           <p>{error}</p>
  //         </div>
  //       )}

  //       <form onSubmit={handleSubmit}>
  //         <div className='form-group'>
  //           <label htmlFor='email'>Email</label>
  //           <input
  //             type='email'
  //             id='email'
  //             value={email}
  //             onChange={(e) => setEmail(e.target.value)}
  //             required
  //           />
  //         </div>

  //         <div className='form-group'>
  //           <label htmlFor='password'>Password</label>
  //           <input
  //             type='password'
  //             id='password'
  //             value={password}
  //             onChange={(e) => setPassword(e.target.value)}
  //             required
  //           />
  //         </div>

  //         <button type='submit' className='login-button' disabled={loading}>
  //           {loading ? 'Logging in...' : 'Login'}
  //         </button>
  //       </form>
  //     </div>
  //   </div>
  // );
  return (
    <div className='login-container'>
      <div className='login-card'>
        <div className='login-header'>
          <h1>MacSys</h1>
          <h2>Login to your account</h2>
        </div>

        {error && (
          <div className='error-message'>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type='submit' className='login-button' disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className='mt-4 text-center'>
          <p className='text-sm text-gray-600'>
            Don't have an account?{' '}
            <Link to='/register' className='text-blue-500 hover:text-blue-700'>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
