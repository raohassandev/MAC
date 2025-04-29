import '../Login.css'; // Reusing the login styles

import { AlertCircle, Loader } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

import { useAuth } from '../contexts/AuthContext';

const apiUrl = `${
  'http://localhost:3333'
}/api/auth/register`;


const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    if (!name.trim()) {
      setError('Name is required');
      return false;
    }

    if (!email.trim()) {
      setError('Email is required');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!password) {
      setError('Password is required');
      return false;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     try {
//       setIsSubmitting(true);
//       setError(null);

//       // Use the authentication service to register
//       await authService.register({
//         name,
//         email,
//         password,
//       });

//       // Redirect to dashboard after successful registration
//       navigate('/');
//     } catch (err: any) {
//       // Handle registration errors
//       setError(
//         err.response?.data?.message || err.message || 'Registration failed'
//       );
//       console.error('Registration error:', err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  try {
    setIsSubmitting(true);
    setError(null);

    console.log('Attempting to register with:', {
      name,
      email,
      password: '****',
    });

    // Use the direct API call with proper error handling
    const response = await fetch(
      apiUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    // Store user data and token
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));

    console.log('Registration successful:', data);

    // Redirect to dashboard after successful registration
    navigate('/');
  } catch (err: any) {
    // Handle registration errors
    setError(err.message || 'Registration failed. Please try again.');
    console.error('Registration error:', err);
  } finally {
    setIsSubmitting(false);
  }
};
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return (
    <div className='login-container'>
      <div className='login-card'>
        <div className='login-header'>
          <h1>MacSys</h1>
          <h2>Create your account</h2>
        </div>

        {error && (
          <div className='error-message'>
            <div className='flex items-center'>
              <AlertCircle size={18} className='mr-2' />
              <p>{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='name'>Full Name</label>
            <input
              type='text'
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
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
              disabled={isSubmitting}
              minLength={8}
            />
            <small className='text-gray-500'>
              Must be at least 8 characters long
            </small>
          </div>

          <div className='form-group'>
            <label htmlFor='confirmPassword'>Confirm Password</label>
            <input
              type='password'
              id='confirmPassword'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <button
            type='submit'
            className='login-button'
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader size={16} className='animate-spin mr-2' />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className='mt-4 text-center'>
          <p className='text-sm text-gray-600'>
            Already have an account?{' '}
            <Link to='/login' className='text-blue-500 hover:text-blue-700'>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
