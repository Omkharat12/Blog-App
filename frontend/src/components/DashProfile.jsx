import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { useEffect, useRef, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { app } from '../firebase';
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signoutSuccess, updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice';

const DashProfile = () => {
    const { currentUser, loading } = useSelector((state) => state.user)
    const [imageFile, setImageFile] = useState(null)
    const [imageFileUrl, setImageFileUrl] = useState(null)
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [formData, setFormData] = useState({});
    const [updateUserError, setUpdateUserError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [postCount, setPostCount] = useState(0);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [postLimitReached, setPostLimitReached] = useState(false);
    const role = currentUser?.role;


    // console.log(imageFileUploadProgress, imageFileUploadError);

    const filePickerRef = useRef()
    const dispatch = useDispatch()
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            setImageFileUrl(URL.createObjectURL(file))
        }
    }
    // console.log(imageFile, imageFileUrl);

    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile]);

    const uploadImage = () => {
        setImageFileUploading(true)
        setImageFileUploadError(null);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                setImageFileUploadProgress(progress.toFixed(0));
            },
            (error) => {
                setImageFileUploadError(
                    'Could not upload image (File must be less than 2MB)'
                );
                setImageFileUploadProgress(null);
                setImageFileUrl(null);
                setImageFile(null);
                setImageFileUploading(false)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                    setFormData({ ...formData, profilePicture: downloadURL })
                    setImageFileUploading(false)
                });
            }
        )
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setUpdateUserError(null);
        setUpdateUserSuccess(null);
        if (Object.keys(formData).length === 0) {
            setUpdateUserError('No changes made');
            return
        }

        if (imageFileUploading) {
            setUpdateUserError('Please wait for image to upload');
            return;
        }
        try {
            dispatch(updateStart())
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (!res.ok) {
                dispatch(updateFailure(data.message))
                setUpdateUserError(data.message);
            } else {
                dispatch(updateSuccess(data))
                setUpdateUserSuccess("User Profile updated successfully")
            }
        } catch (error) {
            dispatch(updateFailure(error.message))
            setUpdateUserError(error.message);
        }
    }

    const handleDeleteUser = async () => {
        setShowModal(false);
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (!res.ok) {
                dispatch(deleteUserFailure(data.message));
            } else {
                dispatch(deleteUserSuccess(data));
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    };

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

    useEffect(() => {
        const fetchLimits = async () => {
            try {
                const postRes = await fetch(`/api/subscribe/status/${currentUser._id}`);
                const data = await postRes.json();

                setPostCount(data.postCount);
                setIsSubscribed(data.isSubscribed);
                setPostLimitReached(data.limitReached);
            } catch (err) {
                console.error("Error fetching post/subscription status", err);
            }
        };

        if (currentUser?._id) {
            fetchLimits();
        }
    }, [currentUser]);

    return (
        <div className='max-w-lg mx-auto p-3 w-full'>

            <h1 className='my-7 text-center font-semibold '>Profile</h1>

            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

                <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />

                <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={() => filePickerRef.current.click()}>

                    {imageFileUploadProgress && (
                        <CircularProgressbar
                            value={imageFileUploadProgress || 0}
                            text={`${imageFileUploadProgress}%`}
                            strokeWidth={5}
                            styles={{
                                root: {
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                },
                                path: {
                                    stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100
                                        })`,
                                },
                            }}
                        />
                    )}
                    <img src={imageFileUrl || currentUser.profilePicture} alt="profilePicture"
                        className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadProgress &&
                            imageFileUploadProgress < 100 &&
                            'opacity-60'
                            }`}
                    />
                </div>
                {imageFileUploadError && (
                    <div className="w-full space-y-4 p-3 rounded-lg bg-red-100 text-red-800 border border-red-300 dark:bg-red-200 dark:text-red-900">
                        {imageFileUploadError}
                    </div>
                )}


                <div className="w-full max-w-md mx-auto space-y-4 p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
                    <input
                        type="text"
                        id="username"
                        placeholder="Username"
                        defaultValue={currentUser.username}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />

                    <input
                        type="email"
                        id="email"
                        placeholder="Email"
                        defaultValue={currentUser.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />

                    <input
                        type="password"
                        id="password"
                        placeholder="Password"
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />

                    <button type='submit' className='w-full px-4 py-2 font-semibold rounded-lg border border-purple-600 text-purple-600 
         hover:text-white hover:bg-gradient-to-r from-purple-500 to-blue-500 '
                        disabled={imageFileUploading || loading}
                    >
                        Update
                    </button>
                </div>
            </form>

            {postLimitReached === null ? (
                <div className="text-center text-gray-400">Checking post limit...</div>
            ) : role === 'admin' || !postLimitReached ? (
                <Link to="/create-post">
                    <button
                        type="button"
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:opacity-90 transition duration-300"
                    >
                        Create a post
                    </button>
                </Link>
            ) : (
                <p className="text-red-500 text-center mt-4">
                    You've hit your free 2-post limit.
                    <Link to="/subscribe" className="text-blue-500 underline" >
                        Upgrade to Pro
                    </Link>
                </p>
            )}



            <div className='text-red-500 flex justify-between mt-5 '>
                <span onClick={() => setShowModal(true)} className='cursor-pointer'>Delete</span>
                <span onClick={handleSignout} className='cursor-pointer'>Sign Out</span>
            </div>
            {updateUserSuccess && (
                <div className="mt-5 rounded-md bg-green-100 p-4 text-green-800 border border-green-300">
                    {updateUserSuccess}
                </div>
            )}
            {updateUserError && (
                <div className="mt-5 rounded-md bg-red-100 p-4 text-red-800 border border-red-300">
                    {updateUserError}
                </div>
            )}


            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
                        <div className="text-center">

                            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />

                            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                                Are you sure you want to delete your account?
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
    )
}

export default DashProfile