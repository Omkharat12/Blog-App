import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { app } from '../firebase';
import { signInSuccess } from '../redux/user/userSlice';

const OAuth = () => {
    const auth = getAuth(app)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider)
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL,
                })
            })
            const data = await res.json()
            if (res.ok) {
                dispatch(signInSuccess(data))
                navigate('/')
            }

        } catch (error) {
            console.log('error occured in Oouth', error);

        }
    }
    return (
        <button
            type="button"
            onClick={handleGoogleClick}
            className="w-full flex items-center justify-center px-4 py-2 border-2 border-transparent rounded-xl text-white font-medium transition duration-300 ease-in-out bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 outline-none"
        >
            <AiFillGoogleCircle className="w-6 h-6 mr-2" />
            Continue with Google
        </button>

    )
}

export default OAuth