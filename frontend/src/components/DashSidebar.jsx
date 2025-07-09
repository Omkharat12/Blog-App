import { useEffect, useState } from 'react';
import {
    HiArrowSmRight,
    HiDocumentText,
    HiOutlineUserGroup,
    HiUser
} from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';

const DashSidebar = () => {
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch()
    const location = useLocation()
    const [tab, setTab] = useState('')
    const role = currentUser?.role;


    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const tabFromUrl = urlParams.get('tab')
        if (tabFromUrl) {
            setTab(tabFromUrl)
        }

    }, [location.search])

    const handleSignout = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                dispatch(signoutSuccess());
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    // console.log(currentUser);

    return (
        <div className="w-full md:w-60 h-full bg-white dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700">
            <ul className="flex flex-col gap-1 ">

                <li className='w-full'>
                    {(role === 'admin') && (
                        <Link to='/dashboard?tab=dashboard' className='block w-full'>
                            <div
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${tab === 'dashboard'
                                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                                    : 'hover:bg-gray-700 text-gray-500'
                                    }`}
                            >
                                <HiOutlineUserGroup className="w-5 h-5" />
                                <span>Dashboard</span>
                            </div>
                        </Link>
                    )}
                </li>


                <li className='w-full'>
                    <Link
                        to="/dashboard?tab=profile"
                        className={`flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${tab === 'profile'
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                    >
                        <div className="flex items-center gap-1">
                            <HiUser className="text-lg" />
                            Profile
                        </div>
                        <span className="text-lg font-medium bg-gray-300 dark:bg-black text-gray-800 dark:text-white px-2 py-0.5 rounded-full">

                            {role === 'admin' ? 'Admin' : 'User'}
                        </span>
                    </Link>
                </li>
                <li>


                    {(role === 'admin' || role === 'user') && (
                        <Link to='/dashboard?tab=post'>
                            <div
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${tab === 'post'
                                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                                    : 'hover:bg-gray-700 text-gray-500'
                                    }`}
                            >
                                <HiDocumentText className="w-5 h-5" />
                                <span>Posts</span>
                            </div>
                        </Link>
                    )}

                </li>

                <li>
                    {(role === 'admin') && (
                        <Link to='/dashboard?tab=users'>
                            <div
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${tab === 'users'
                                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                                    : 'hover:bg-gray-700 text-gray-500'
                                    }`}
                            >
                                <HiOutlineUserGroup className="w-5 h-5" />
                                <span>User</span>
                            </div>
                        </Link>
                    )}
                </li>


                <li>
                    {(role === 'admin') && (
                        <Link to='/dashboard?tab=comment'>
                            <div
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${tab === 'comment'
                                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                                    : 'hover:bg-gray-700 text-gray-500'
                                    }`}
                            >
                                <HiOutlineUserGroup className="w-5 h-5" />
                                <span>Comment</span>
                            </div>
                        </Link>
                    )}
                </li>
                <li>
                    <button
                        onClick={handleSignout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                    >
                        <HiArrowSmRight className="text-lg" />
                        Sign Out
                    </button>
                </li>
            </ul>
        </div>

    )
}

export default DashSidebar

//     < div className = "w-full md:w-56 h-full bg-white dark:bg-gray-900 p-4 border-r border-gray-200 dark:border-gray-700" >
//         <ul className="flex flex-col gap-1">
//             {currentUser && currentUser.isAdmin && (
//                 <li>
//                     <Link
//                         to="/dashboard?tab=dash"
//                         className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${tab === 'dash' || !tab
//                                 ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
//                                 : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
//                             }`}
//                     >
//                         <HiChartPie className="text-lg" />
//                         Dashboard
//                     </Link>
//                 </li>
//             )}

//             <li>
//                 <Link
//                     to="/dashboard?tab=profile"
//                     className={`flex items-center justify-between p-2 rounded-lg transition-colors ${tab === 'profile'
//                             ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
//                             : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
//                         }`}
//                 >
//                     <div className="flex items-center gap-2">
//                         <HiUser className="text-lg" />
//                         Profile
//                     </div>
//                     <span className="text-xs font-medium bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white px-2 py-0.5 rounded-full">
//                         {currentUser.isAdmin ? 'Admin' : 'User'}
//                     </span>
//                 </Link>
//             </li>

//             {currentUser.isAdmin && (
//                 <>
//                     <li>
//                         <Link
//                             to="/dashboard?tab=posts"
//                             className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${tab === 'posts'
//                                     ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
//                                     : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
//                                 }`}
//                         >
//                             <HiDocumentText className="text-lg" />
//                             Posts
//                         </Link>
//                     </li>

//                     <li>
//                         <Link
//                             to="/dashboard?tab=users"
//                             className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${tab === 'users'
//                                     ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
//                                     : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
//                                 }`}
//                         >
//                             <HiOutlineUserGroup className="text-lg" />
//                             Users
//                         </Link>
//                     </li>

//                     <li>
//                         <Link
//                             to="/dashboard?tab=comments"
//                             className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${tab === 'comments'
//                                     ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
//                                     : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
//                                 }`}
//                         >
//                             <HiAnnotation className="text-lg" />
//                             Comments
//                         </Link>
//                     </li>
//                 </>
//             )}

//             <li>
//                 <button
//                     onClick={handleSignout}
//                     className="w-full text-left flex items-center gap-2 p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
//                 >
//                     <HiArrowSmRight className="text-lg" />
//                     Sign Out
//                 </button>
//             </li>
//         </ul>
// </div >
