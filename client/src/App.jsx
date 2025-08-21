import './App.css';
import Login from './components/Login';
import { Register } from './components/Register';
import { Home } from './pages/home';
import AdminCategories from './pages/AdminCategories';
import TestComments from './pages/TestComments';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import { useAuth } from "./context/AuthContext";
import Layout from './components/layout';
import { CreatePost } from "./pages/CreatePost";  



function App() {
  const { isAuthenticated } = useAuth();

    const fakeAuth = true;
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicRoute isAuthenticated={fakeAuth} />}>
        <Route path="/" element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute isAuthenticated={fakeAuth} />}>
        <Route element={<Layout />}>
          <Route path="home" element={<Home />} />
          <Route path="test/comments" element={<TestComments />} />
          <Route path="admin/categories" element={<AdminCategories />} />
          <Route path="create-post" element={<CreatePost />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
