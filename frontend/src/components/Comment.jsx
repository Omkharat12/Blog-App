import moment from 'moment';
import { useEffect, useState } from "react";
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Comment = ({ comment, onLike, onEdit, onDelete }) => {
    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const { currentUser } = useSelector((state) => state.user);


    const handleSave = async () => {

        try {
            const res = await fetch(`/api/comment/editComment/${comment._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: editedContent,
                }),
            });
            if (res.ok) {
                setIsEditing(false);
                onEdit(comment, editedContent);
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    const handleEdit = () => {
        setIsEditing(true);
        setEditedContent(comment.content);
    }
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`)
                const data = await res.json()
                if (res.ok) {
                    setUser(data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getUser()
    }, [comment])
    // console.log(user);
    return (
        <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
            <div className='flex-shrink-0 mr-3'>
                <img
                    className='w-10 h-10 rounded-full bg-gray-200'
                    src={user?.profilePicture}
                    alt={user?.username}
                />
            </div>
            <div className='flex-1'>
                <div className='flex items-center mb-1'>
                    <span className='font-bold mr-1 text-xs truncate'>
                        {user ? `@${user.username}` : 'anonymous user'}
                    </span>
                    <span className='text-gray-500 text-xs'>
                        {moment(comment.createdAt).fromNow()}
                    </span>
                </div>

                {isEditing ? (
                    <>
                        <textarea
                            className='w-full p-2 border border-gray-300 rounded mb-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white text-sm'
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                        />
                        <div className='flex justify-end gap-2 text-xs'>
                            <button
                                type='button'
                                onClick={handleSave}
                                className='px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded text-xs hover:opacity-90'
                            >
                                Save
                            </button>
                            <button
                                type='button'
                                onClick={() => setIsEditing(false)}
                                className='px-3 py-1 border border-blue-500 text-blue-500 rounded text-xs hover:bg-blue-50 dark:hover:bg-gray-800'
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className='text-gray-500 pb-2'>{comment.content}</p>
                        <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
                            <button
                                type='button'
                                onClick={() => onLike(comment._id)}
                                className={`text-gray-400 hover:text-blue-500 ${currentUser &&
                                    comment.likes.includes(currentUser._id) &&
                                    '!text-blue-500'
                                    }`}
                            >
                                <FaThumbsUp className='text-sm' />
                            </button>
                            <p className='text-gray-400'>
                                {comment.numberOfLikes > 0 &&
                                    `${comment.numberOfLikes} ${comment.numberOfLikes === 1 ? 'like' : 'likes'
                                    }`}
                            </p>
                            {currentUser &&
                                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                                    <>
                                        <button
                                            type='button'
                                            onClick={handleEdit}
                                            className='text-gray-400 hover:text-blue-500'
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type='button'
                                            onClick={() => onDelete(comment._id)}
                                            className='text-gray-400 hover:text-red-500'
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Comment