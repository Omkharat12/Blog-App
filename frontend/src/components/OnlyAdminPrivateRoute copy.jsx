import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const OnlyAdminPrivateRoute = () => {
    const { currentUser } = useSelector((state) => state.user);
    const role = currentUser?.role;

    if (!currentUser) return <Navigate to="/sign-in" />;

    // Allow both 'admin' and 'user' roles
    return (role === 'admin' || role === 'user') ? <Outlet /> : <Navigate to="/" />;
};

export default OnlyAdminPrivateRoute;
