import { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const DashPosts = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [userPosts, setUserPosts] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState('');

    const isAdmin = currentUser?.role === 'admin';
    const role = currentUser?.role;
    const fetchPosts = async (startIndex = 0) => {
        try {
            let url = `/api/post/getposts?startIndex=${startIndex}`;
            if (role === 'user') {
                url += `&userId=${currentUser._id}`;
            }

            const res = await fetch(url);
            const data = await res.json();

            if (res.ok) {
                if (startIndex === 0) {
                    setUserPosts(data.posts);
                } else {
                    setUserPosts((prev) => [...prev, ...data.posts]);
                }

                if (data.posts.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log('Failed to fetch posts:', error);
        }
    };

    useEffect(() => {
        if (currentUser?._id) {
            fetchPosts();
        }
    }, [currentUser]);

    const handleShowMore = () => {
        fetchPosts(userPosts.length);
    };

    const handleDeletePost = async () => {
        setShowModal(false);
        try {
            const res = await fetch(
                `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
                {
                    method: 'DELETE',
                }
            );
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setUserPosts((prev) =>
                    prev.filter((post) => post._id !== postIdToDelete)
                );
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {userPosts.length > 0 ? (
                <>
                    <table className='table-auto w-full text-left text-sm text-gray-500 dark:text-gray-400 shadow-md'>
                        <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                            <tr>
                                <th className='px-6 py-3'>Date updated</th>
                                <th className='px-6 py-3'>Post image</th>
                                <th className='px-6 py-3'>Post title</th>
                                <th className='px-6 py-3'>Category</th>
                                <th className='px-6 py-3'>Delete</th>
                                <th className='px-6 py-3'>Edit</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y'>
                            {userPosts.map((post) => (
                                <tr key={post._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <td className='px-6 py-4'>
                                        {new Date(post.updatedAt).toLocaleDateString()}
                                    </td>
                                    <td className='px-6 py-4'>
                                        <Link to={`/post/${post.slug}`}>
                                            <img
                                                src={post.image || 'image not found'}
                                                alt={post.title}
                                                className='w-20 h-10 object-cover bg-gray-500'
                                            />
                                        </Link>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <Link className='font-medium text-gray-900 dark:text-white' to={`/post/${post.slug}`}>
                                            {post.title}
                                        </Link>
                                    </td>
                                    <td className='px-6 py-4'>{post.category}</td>
                                    <td className='px-6 py-4'>
                                        <span
                                            onClick={() => {
                                                setShowModal(true);
                                                setPostIdToDelete(post._id);
                                            }}
                                            className='font-medium text-red-500 hover:underline cursor-pointer'
                                        >
                                            Delete
                                        </span>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <Link className='text-teal-500 hover:underline' to={`/update-post/${post._id}`}>
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {showMore && (
                        <button
                            onClick={handleShowMore}
                            className='w-full text-teal-500 self-center text-sm py-7'
                        >
                            Show more
                        </button>
                    )}
                </>
            ) : (
                <p>No posts available.</p>
            )}

            {showModal && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6'>
                        <div className='text-center'>
                            <HiOutlineExclamationCircle className='mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200' />
                            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                                Are you sure you want to delete this post?
                            </h3>
                            <div className='flex justify-center gap-4'>
                                <button
                                    onClick={handleDeletePost}
                                    className='px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md'
                                >
                                    Yes, I'm sure
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className='px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md'
                                >
                                    No, cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashPosts;
