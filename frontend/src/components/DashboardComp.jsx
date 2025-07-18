import { useEffect, useState } from 'react';
import {
    HiAnnotation,
    HiArrowNarrowUp,
    HiDocumentText,
    HiOutlineUserGroup,
} from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function DashboardComp() {
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [lastMonthPosts, setLastMonthPosts] = useState(0);
    const [lastMonthComments, setLastMonthComments] = useState(0);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/user/getusers?limit=5');
                const data = await res.json();
                if (res.ok) {
                    setUsers(data.users);
                    setTotalUsers(data.totalUsers);
                    setLastMonthUsers(data.lastMonthUsers);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/post/getposts?limit=5');
                const data = await res.json();
                if (res.ok) {
                    setPosts(data.posts);
                    setTotalPosts(data.totalPosts);
                    setLastMonthPosts(data.lastMonthPosts);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        const fetchComments = async () => {
            try {
                const res = await fetch('/api/comment/getcomments?limit=5');
                const data = await res.json();
                if (res.ok) {
                    setComments(data.comments);
                    setTotalComments(data.totalComments);
                    setLastMonthComments(data.lastMonthComments);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if (currentUser?.role === 'admin') {
            fetchUsers();
            fetchPosts();
            fetchComments();
        }
    }, [currentUser]);

    return (
        <div className='p-3 md:mx-auto'>
            <div className='flex-wrap flex gap-4 justify-center'>
                {/* Total Users */}
                <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
                    <div className='flex justify-between'>
                        <div>
                            <h3 className='text-gray-500 text-md uppercase'>Total Users</h3>
                            <p className='text-2xl'>{totalUsers}</p>
                        </div>
                        <HiOutlineUserGroup className='bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg' />
                    </div>
                    <div className='flex gap-2 text-sm'>
                        <span className='text-green-500 flex items-center'>
                            <HiArrowNarrowUp />
                            {lastMonthUsers}
                        </span>
                        <div className='text-gray-500'>Last month</div>
                    </div>
                </div>

                {/* Total Comments */}
                <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
                    <div className='flex justify-between'>
                        <div>
                            <h3 className='text-gray-500 text-md uppercase'>Total Comments</h3>
                            <p className='text-2xl'>{totalComments}</p>
                        </div>
                        <HiAnnotation className='bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg' />
                    </div>
                    <div className='flex gap-2 text-sm'>
                        <span className='text-green-500 flex items-center'>
                            <HiArrowNarrowUp />
                            {lastMonthComments}
                        </span>
                        <div className='text-gray-500'>Last month</div>
                    </div>
                </div>

                {/* Total Posts */}
                <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
                    <div className='flex justify-between'>
                        <div>
                            <h3 className='text-gray-500 text-md uppercase'>Total Posts</h3>
                            <p className='text-2xl'>{totalPosts}</p>
                        </div>
                        <HiDocumentText className='bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg' />
                    </div>
                    <div className='flex gap-2 text-sm'>
                        <span className='text-green-500 flex items-center'>
                            <HiArrowNarrowUp />
                            {lastMonthPosts}
                        </span>
                        <div className='text-gray-500'>Last month</div>
                    </div>
                </div>
            </div>

            {/* Recent Tables */}
            <div className='flex flex-wrap gap-4 py-3 mx-auto justify-center'>

                {/* Recent Users */}
                <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
                    <div className='flex justify-between p-3 text-sm font-semibold'>
                        <h1 className='text-center p-2'>Recent users</h1>
                        <Link
                            to={'/dashboard?tab=users'}
                            className='border border-purple-500 text-purple-500 hover:bg-purple-50 px-3 py-1 rounded-md transition'
                        >
                            See all
                        </Link>
                    </div>
                    <div className='overflow-x-auto'>
                        <table className='min-w-full text-sm text-left'>
                            <thead className='text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300'>
                                <tr>
                                    <th className='px-4 py-2'>User image</th>
                                    <th className='px-4 py-2'>Username</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users &&
                                    users.map((user) => (
                                        <tr key={user._id} className='bg-white dark:bg-gray-800 border-b dark:border-gray-700'>
                                            <td className='px-4 py-2'>
                                                <img
                                                    src={user.profilePicture || 'image not found'}
                                                    alt='user'
                                                    className='w-10 h-10 rounded-full bg-gray-500'
                                                />
                                            </td>
                                            <td className='px-4 py-2'>{user.username}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Comments */}
                <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
                    <div className='flex justify-between p-3 text-sm font-semibold'>
                        <h1 className='text-center p-2'>Recent comments</h1>
                        <Link
                            to={'/dashboard?tab=comments'}
                            className='border border-purple-500 text-purple-500 hover:bg-purple-50 px-3 py-1 rounded-md transition'
                        >
                            See all
                        </Link>
                    </div>
                    <div className='overflow-x-auto'>
                        <table className='min-w-full text-sm text-left'>
                            <thead className='text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300'>
                                <tr>
                                    <th className='px-4 py-2'>Comment content</th>
                                    <th className='px-4 py-2'>Likes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comments &&
                                    comments.map((comment) => (
                                        <tr key={comment._id} className='bg-white dark:bg-gray-800 border-b dark:border-gray-700'>
                                            <td className='px-4 py-2 w-96'>
                                                <p className='line-clamp-2'>{comment.content}</p>
                                            </td>
                                            <td className='px-4 py-2'>{comment.numberOfLikes}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Posts */}
                <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
                    <div className='flex justify-between p-3 text-sm font-semibold'>
                        <h1 className='text-center p-2'>Recent posts</h1>
                        <Link
                            to='/dashboard?tab=post'
                            className='border border-purple-500 text-purple-500 hover:bg-purple-50 px-3 py-1 rounded-md transition'
                        >
                            See all
                        </Link>
                    </div>
                    <div className='overflow-x-auto'>
                        <table className='min-w-full text-sm text-left'>
                            <thead className='text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300'>
                                <tr>
                                    <th className='px-4 py-2'>Post image</th>
                                    <th className='px-4 py-2'>Post Title</th>
                                    <th className='px-4 py-2'>Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts &&
                                    posts.map((post) => (
                                        <tr key={post._id} className='bg-white dark:bg-gray-800 border-b dark:border-gray-700'>
                                            <td className='px-4 py-2'>
                                                <img
                                                    src={post.image || 'image not found'}
                                                    alt='post'
                                                    className='w-14 h-10 rounded-md bg-gray-500'
                                                />
                                            </td>
                                            <td className='px-4 py-2 w-96'>{post.title}</td>
                                            <td className='px-4 py-2 w-5'>{post.category}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
