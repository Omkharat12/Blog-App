import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute copy';
import PrivateRoute from './components/PrivateRoute';
import ScrollToTop from './components/ScrollToTop';
import About from './pages/About';
import CreatePost from './pages/CreatePost';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import PostPage from './pages/PostPage';
import Project from './pages/Project';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import SubscribePage from './pages/SubcribePage';
import UpdatePost from './pages/UpdatePost';

const App = () => {
  const location = useLocation();
  const hideHeaderRoutes = ['/subscribe'];

  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideHeader && <Header />}

      <ScrollToTop />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route element={<PrivateRoute />} >
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />} >
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/update-post/:postId' element={<UpdatePost />} />
        </Route>
        <Route path='/projects' element={<Project />} />
        <Route path='/post/:postSlug' element={<PostPage />} />
        <Route path="/subscribe" element={<SubscribePage />} />
      </Routes>
    </>
  );
};

export default App