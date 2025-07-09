import { useEffect, useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';

const DashUsers = () => {

    const { currentUser } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState('');

    const role = currentUser?.role;
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`/api/user/getusers`);
                const data = await res.json();
                if (res.ok) {
                    setUsers(data.users);
                    if (data.users.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if (role === 'admin') {
            fetchUsers();
        }
    }, [currentUser._id]);

    const handleShowMore = async () => {
        const startIndex = users.length;
        try {
            const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setUsers((prev) => [...prev, ...data.users]);
                if (data.users.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDeleteUser = async () => {
        try {
            const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (res.ok) {
                setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
                setShowModal(false);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    };
    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {(role === 'admin') && users.length > 0 ? (
                <>
                    <table className="table-auto w-full text-left text-sm text-gray-500 dark:text-gray-400 shadow-md">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Date created</th>
                                <th scope="col" className="px-6 py-3">User Image</th>
                                <th scope="col" className="px-6 py-3">Username</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Admin</th>
                                <th scope="col" className="px-6 py-3">Delete</th>
                            </tr>
                        </thead>


                        <tbody className="divide-y">
                            {
                                users.map((user) => (
                                    <tr
                                        key={user._id}
                                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        <td className="px-6 py-4">
                                            {new Date(user.updatedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">

                                            <img
                                                src={user.profilePicture}
                                                alt={user.username}
                                                className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                                            />

                                        </td>

                                        <td className="px-6 py-4">
                                            {user.username}
                                        </td>

                                        <td className="px-6 py-4">
                                            {user.email}
                                        </td>

                                        <td className="px-6 py-4">
                                            {user.role === 'admin' ? (
                                                <FaCheck className='text-green-500' />
                                            ) : (
                                                <FaTimes className='text-red-500' />
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                onClick={() => {
                                                    setShowModal(true);
                                                    setUserIdToDelete(user._id);
                                                }}
                                                className="font-medium text-red-500 hover:underline cursor-pointer"
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
                            className='w-full text-teal-500 self-center text-sm py-7'
                        >
                            Show more
                        </button>
                    )}
                </>
            ) : (
                <p>You have no posts yet!</p>
            )}


            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
                        <div className="text-center">

                            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />

                            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                                Are you sure you want to delete your post?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={handleDeleteUser}
                                    className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md"
                                >
                                    Yes, I'm sure
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
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
export default DashUsers