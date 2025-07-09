import { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';

export default function DashComments() {
    const { currentUser } = useSelector((state) => state.user);
    const [comments, setComments] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState('');
    const role = currentUser?.role


    useEffect(() => {
        if (currentUser?.role === 'admin') {

            const fetchComments = async () => {
                try {
                    const res = await fetch(`/api/comment/getcomments`);
                    const data = await res.json();
                    if (res.ok) {
                        setComments(data.comments);
                        if (data.comments.length < 9) {
                            setShowMore(false);
                        }
                    }
                } catch (error) {
                    console.log(error.message);
                }
            };
            // if (role === 'admin') {
            //     fetchComments();
            // }
            fetchComments();
        }
    }, [currentUser]);

    const handleShowMore = async () => {
        const startIndex = comments.length;
        try {
            const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setComments((prev) => [...prev, ...data.comments]);
                if (data.comments.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDeleteComment = async () => {
        setShowModal(false);
        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_API_URL}/api/comment/deleteComment/${commentIdToDelete}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            }
            );
            const data = await res.json();
            if (res.ok) {
                setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete));
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className='overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {role === 'admin' && comments.length > 0 ? (
                <>
                    <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700 shadow-md'>
                        <thead className='bg-gray-50 dark:bg-gray-700'>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Date updated</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Comment content</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Number of likes</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>PostId</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>UserId</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Delete</th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700'>
                            {comments.map((comment) => (
                                <tr key={comment._id}>
                                    <td className='px-6 py-4 whitespace-nowrap'>{new Date(comment.updatedAt).toLocaleDateString()}</td>
                                    <td className='px-6 py-4 whitespace-nowrap'>{comment.content}</td>
                                    <td className='px-6 py-4 whitespace-nowrap'>{comment.numberOfLikes}</td>
                                    <td className='px-6 py-4 whitespace-nowrap'>{comment.postId}</td>
                                    <td className='px-6 py-4 whitespace-nowrap'>{comment.userId}</td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <span
                                            onClick={() => {
                                                setShowModal(true);
                                                setCommentIdToDelete(comment._id);
                                            }}
                                            className='text-red-500 hover:underline cursor-pointer'
                                        >
                                            Delete
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {showMore && (
                        <button
                            onClick={handleShowMore}
                            className='w-full text-teal-500 text-sm py-7 text-center'
                        >
                            Show more
                        </button>
                    )}
                </>
            ) : (
                <p>You have no comments yet!</p>
            )}

            {showModal && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md'>
                        <div className='text-center'>
                            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                                Are you sure you want to delete this comment?
                            </h3>
                            <div className='flex justify-center gap-4'>
                                <button
                                    onClick={handleDeleteComment}
                                    className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'
                                >
                                    Yes, I'm sure
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className='bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700'
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
}
