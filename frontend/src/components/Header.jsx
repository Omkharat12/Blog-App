import { useEffect, useRef, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { toggleTheme } from '../redux/theme/themeSlice';

export default function Header() {
    const { currentUser } = useSelector((state) => state.user);
    const { theme } = useSelector((state) => state.theme);
    const [searchTerm, setSearchTerm] = useState('')
    const dispatch = useDispatch()
    const dropdownRef = useRef();
    const location = useLocation()
    // 
    // console.log(currentUser.profilePicture);



    useEffect(() => { }, [location.search])


    return (
        <nav className='p-4 border-b bg-white dark:bg-gray-900 border-b-purple-600 to-pink-500'>
            <div className='flex items-center justify-between'>


                <Link to='/' className='text-xl font-bold text-gray-900 dark:text-white'>
                    <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg text-white'>
                        BlogNest
                    </span>{' '}

                </Link>



                <div className='relative w-64 hidden sm:block '>

                    <input
                        type='text'
                        placeholder='Search...'
                        className='w-full p-2 pl-8 text-gray-900  rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white'
                    />
                    <AiOutlineSearch className='absolute left-2 top-3 text-gray-500' />
                </div>

                <div className='flex gap-4'>
                    <Link to='/' className='text-gray-700 dark:text-white hover:text-indigo-500'>Home</Link>
                    <Link to='/about' className='text-gray-700 dark:text-white hover:text-indigo-500'>About</Link>
                    <Link to='/projects' className='text-gray-700 dark:text-white hover:text-indigo-500'>Projects</Link>
                </div>

                <div className='flex items-center gap-6'>
                    <button
                        className=" w-12 h-10   rounded-full flex items-center justify-center text-gray-700 dark:bg-gray-600 bg-gray-200 hover:bg-gray-300 "
                        onClick={() => dispatch(toggleTheme())}
                    >
                        {theme === 'light' ? <FaSun /> : <FaMoon />}
                    </button>
                    <div className='h-10 w-16'>

                        {currentUser ? (
                            <div className="relative  flex justify-center items-center text-left" >
                                <Link to='/dashboard?tab=profile'>
                                    <button
                                        className="focus:outline-none "
                                    >
                                        <img
                                            src={currentUser.profilePicture}
                                            alt="user"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <Link to="/sign-in">
                                <button className="px-4 py-2 rounded-lg border border-purple-500 text-purple-600 hover:bg-purple-50 transition font-medium">
                                    Sign In
                                </button>
                            </Link>
                        )}
                    </div>
                </div>

            </div>
        </nav>

    );
}
