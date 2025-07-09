import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TipTapEditor from '../components/TipTapEditor';
import { app } from '../firebase';
const CreatePost = () => {

  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    image: '',
    visibility: 'public',
  });

  const [publishError, setPublishError] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false)
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

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

  const getPathFromUrl = (url) => {
    const baseUrl = "gs://estate-mern-8688d.appspot.com";
    const path = url.replace(baseUrl, "").split("?")[0];
    return decodeURIComponent(path); // decode %2F to /
  };

  const handleDeleteImage = async (imageUrl) => {
    try {
      const storage = getStorage();
      const path = getPathFromUrl(imageUrl); // 🔍 See helper below
      const imageRef = ref(storage, path);

      await deleteObject(imageRef);

      setFormData({ ...formData, image: '' }); // Clear image from formData
      setImageUploadError(null);
      console.log("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
  });



  // const token = currentUser?.token;
  // console.log('Token:', token);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_PUBLIC_API_URL}/api/post/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

        },
        credentials: 'include',
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
  // console.log(formData);

  useEffect(() => {
    const fetchLimits = async () => {
      try {
        const postRes = await fetch(`/api/subscribe/status/${currentUser._id}`);
        const data = await postRes.json();
        setIsSubscribed(data.isSubscribed);

      } catch (err) {
        console.error("Error fetching post/subscription status", err);
      }
    };

    if (currentUser?._id) {
      fetchLimits();
    }
  }, [currentUser])
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
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
          />
          <select
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 "
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </select>
        </div>

        {(isSubscribed || currentUser?.role === 'admin') &&
          <div className="flex items-center gap-4 p-3 border border-white  rounded-md dark:bg-gray-800">
            <span className="font-semibold text-gray-700 dark:text-gray-200">Post Visibility:</span>
            <div className="flex items-center">
              <span className={`mr-3 text-sm font-medium ${formData.visibility === 'public' ? 'text-sky-500' : 'text-gray-400 dark:text-gray-500'}`}>
                Public
              </span>
              <label htmlFor="visibility-toggle" className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="visibility-toggle"
                  className="sr-only peer"
                  checked={formData.visibility === 'private'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      visibility: e.target.checked ? 'private' : 'public',
                    })
                  }
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-sky-300 dark:peer-focus:ring-sky-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-sky-600"></div>
              </label>
              <span className={`ml-3 text-sm font-medium ${formData.visibility === 'private' ? 'text-sky-500' : 'text-gray-400 dark:text-gray-500'}`}>
                Private
              </span>
            </div>
          </div>
        }

        {/* File Upload */}
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted dark:bg-gray-800 p-3">
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
          Publish
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

export default CreatePost
