import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import TipTapEditor from '../components/TipTapEditor';
import { app } from '../firebase';

const UpdatePost = () => {

    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        content: '',
        image: '',
    });
    const [publishError, setPublishError] = useState(null);

    const navigate = useNavigate();
    const { postId } = useParams()
    const { currentUser } = useSelector((state) => state.user)
    const fetchPost = async () => {
        try {
            const res = await fetch(`/api/post/getposts?postId=${postId}`)
            const data = await res.json()

            if (!res.ok) {
                console.log(data.message);
                setPublishError(data.message);
                return;
            }
            if (res.ok) {
                setPublishError(null);
                setFormData(data.posts[0]);
            }

        } catch (error) {
            console.log(error.message);

        }
    }
    useEffect(() => {
        fetchPost()
    }, [postId])

    const handleUpdloadImage = async () => {
        try {
            if (!file) {
                setImageUploadError('Please select an image');
                return;
            }
            setImageUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setImageUploadError('Image upload failed');
                    setImageUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUploadProgress(null);
                        setImageUploadError(null);
                        setFormData({ ...formData, image: downloadURL });
                    });
                }
            );
        } catch (error) {
            setImageUploadError('Image upload failed');
            setImageUploadProgress(null);
            console.log(error);
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                setPublishError(data.message);
                return;
            }

            if (res.ok) {
                setPublishError(null);
                navigate(`/post/${data.slug}`);
            }
        } catch (error) {
            setPublishError('Something went wrong');
        }
    };
    console.log(formData);

    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
            <h1 className="text-center text-3xl my-7 font-semibold">Update post</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {/* Title and Category */}
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <input
                        type="text"
                        placeholder="Title"
                        required
                        id="title"
                        className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 "
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                        value={formData.title}
                    />
                    <select
                        className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 "
                        onChange={(e) =>
                            setFormData({ ...formData, category: e.target.value })
                        }
                        value={formData.category}
                    >
                        <option value="uncategorized">Select a category</option>
                        <option value="javascript">JavaScript</option>
                        <option value="reactjs">React.js</option>
                        <option value="nextjs">Next.js</option>
                    </select>
                </div>

                {/* File Upload */}
                <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="flex-1"
                    />
                    <button
                        type="button"
                        onClick={handleUpdloadImage}
                        disabled={imageUploadProgress}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-50"
                    >
                        {imageUploadProgress ? (
                            <div className="w-16 h-16">
                                <CircularProgressbar
                                    value={imageUploadProgress}
                                    text={`${imageUploadProgress || 0}%`}
                                />
                            </div>
                        ) : (
                            "Upload Image"
                        )}
                    </button>
                </div>

                {/* Error Alert */}
                {imageUploadError && (
                    <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
                        {imageUploadError}
                    </div>
                )}

                {/* Uploaded Image Preview */}
                {formData.image && (
                    <img
                        src={formData.image}
                        alt="upload"
                        className="w-full h-full object-cover"
                    />
                )}

                {/* Text Editor */}

                <TipTapEditor setFormData={setFormData} formData={formData} />

                {/* <div className="border rounded-md p-2 min-h-[18rem]">
          <EditorContent editor={editor}
            className="h-72 mb-12"
            onChange={(value) =>
              setFormData({ ...formData, content: value })
            }
          />
        </div> */}
                {/* Publish Button */}
                <button
                    type="submit"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded font-semibold hover:opacity-90"
                >
                    Update
                </button>

                {/* Publish Error Alert */}
                {publishError && (
                    <div className="mt-5 bg-red-100 text-red-700 px-4 py-2 rounded">
                        {publishError}
                    </div>
                )}
            </form>
        </div>


    )
}

export default UpdatePost
