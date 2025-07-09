import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields.');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch(`${import.meta.env.VITE_PUBLIC_API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }

      setLoading(false);

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      if (res.ok) {
        navigate('/sign-in');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-tr from-slate-900 via-gray-800 to-slate-900 flex items-center justify-center px-4 py-12'>
      <div className='w-full max-w-md bg-white dark:bg-[#10172A] rounded-3xl shadow-xl p-8 space-y-6'>
        <h2 className='text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500'>
          Create Account
        </h2>
        <p className='text-center text-gray-500 dark:text-gray-300 text-sm'>
          Join the blog and start sharing your thoughts today.
        </p>

        <form className='flex flex-col space-y-4' onSubmit={handleSubmit}>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-200'>Username</label>
            <input
              type='text'
              id='username'
              placeholder='e.g. sahand_dev'
              className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white'
              onChange={handleChange}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-200'>Email</label>
            <input
              type='email'
              id='email'
              placeholder='name@company.com'
              className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white'
              onChange={handleChange}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-200'>Password</label>
            <input
              type='password'
              id='password'
              placeholder='••••••••'
              className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white'
              onChange={handleChange}
            />
          </div>

          <button
            type='submit'
            className='w-full py-2 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:brightness-110 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition duration-300 ease-in-out disabled:opacity-50'
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <OAuth />
        </form>

        <div className='text-center text-sm mt-4 text-gray-600 dark:text-gray-400'>
          <span>Already have an account?</span>{' '}
          <Link to='/sign-in' className='text-purple-500 hover:underline'>
            Sign In
          </Link>
        </div>

        {errorMessage && (
          <div className='text-center mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg'>
            {errorMessage}
          </div>
        )}
      </div>
    </div>

  );
}
