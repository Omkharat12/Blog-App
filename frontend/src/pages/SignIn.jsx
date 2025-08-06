import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import OAuth from '../components/OAuth';
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errormessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields.");
      return dispatch(signInFailure("Please fill in all fields."));
    }
    try {
      dispatch(signInStart());
      const res = await fetch(`${import.meta.env.VITE_PUBLIC_API_URL}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);

      if (data.success === false || !res.ok) {
        toast.error(data.message || "Login failed");
        dispatch(signInFailure(data.message));
      }

      const fullUser = { ...data.user, token: data.access_token };
      if (res.ok) {
        dispatch(signInSuccess(fullUser));
        toast.success("Signed in successfully!");
        navigate('/');
      }


    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className='h-full bg-gradient-to-tr from-slate-900 via-gray-800 to-slate-900 flex items-center justify-center px-4 py-12'>
      <div className='w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 space-y-6'>
        <h1 className='text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500'>
          Sahand's Blog
        </h1>
        <p className='text-center text-gray-500 dark:text-gray-300 text-sm'>
          Welcome back! Sign in with your credentials.
        </p>

        <form className='space-y-4' onSubmit={handleSubmit}>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-200'>Email address</label>
            <input
              type='email'
              id='email'
              placeholder='you@example.com'
              onChange={handleChange}
              className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-200'>Password</label>
            <input
              type='password'
              id='password'
              placeholder='••••••••'
              onChange={handleChange}
              className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white'
            />
          </div>

          <button
            type='submit'
            className='w-full py-2 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:brightness-110 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition duration-300 ease-in-out disabled:opacity-50'
          // disabled={loading}
          >
            {loading ? 'loading...' : "Sign in"}
          </button>

          <OAuth />
        </form>

        <div className='flex justify-center items-center space-x-2 text-sm mt-4 text-gray-600 dark:text-gray-400'>
          <span>Don't have an account?</span>
          <Link to='/sign-up' className='text-purple-500 hover:underline'>Sign Up</Link>
        </div>


      </div>
    </div>

  );
}
