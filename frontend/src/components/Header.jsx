import { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';

export default function Header() {
    const [open, setOpen] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    const { theme } = useSelector((state) => state.theme);
    const [searchTerm, setSearchTerm] = useState('')
    const dispatch = useDispatch()
    const location = useLocation()
    // 
    // console.log(currentUser.profilePicture);


    useEffect(() => { }, [location.search])
    const handleSignout = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_API_URL}/api/user/signout`, {
                method: "POST"
            })
            const data = await res.json()
            if (!res.ok) {
                console.log(data.message);

            } else {
                dispatch(signoutSuccess())
            }
        } catch (error) {
            console.log(error.message);

        }
    }

    return (
        <nav className='flex items-center justify-between p-4 border-b bg-white dark:bg-gray-900 border-b-purple-600 to-pink-500'>
            <Link to='/' className='text-xl font-bold text-gray-900 dark:text-white'>
                <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg text-white'>
                    Sahand's
                </span>{' '}
                Blog
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

            <div className='flex items-center gap-4'>
                <button
                    className=" w-12 h-10  sm:inline rounded-full flex items-center justify-center text-gray-700 dark:text-gray-100bg-gray-200 hover:bg-gray-300 "
                    onClick={() => dispatch(toggleTheme())}
                >
                    {theme === 'light' ? <FaSun /> : <FaMoon />}
                </button>

                {currentUser ? (
                    <div className="relative inline-block text-left">
                        <button
                            onClick={() => setOpen(!open)}
                            className="focus:outline-none"

                        >
                            <img
                                src={currentUser.profilePicture}
                                alt="user"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        </button>

                        {open && (
                            <div onBlur={() => setOpen(false)} className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                                <div className="px-4 py-3">
                                    <span className="block text-sm text-gray-700">@{currentUser.username}</span>
                                    <span className="block text-sm font-medium text-gray-900 truncate">
                                        {currentUser.email}
                                    </span>
                                </div>
                                <div className="border-t border-gray-100" />
                                <Link
                                    to="/dashboard?tab=profile"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Profile
                                </Link>
                                <div className="border-t border-gray-100" />
                                <button
                                    onClick={handleSignout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/sign-in">
                        <button className="px-4 py-2 rounded-lg border border-purple-500 text-purple-600 hover:bg-purple-50 transition font-medium">
                            Sign In
                        </button>
                    </Link>
                )}
            </div>
        </nav>

    );
}
