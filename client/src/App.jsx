import './App.css'
import Login from './components/Login'
import { Register } from './components/Register'
import { Home } from './pages/home'
import AdminCategories from './pages/AdminCategories';
import TestComments from './pages/TestComments';
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import { useAuth } from "./context/AuthContext";


function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      // Public routes
      <Route element={<PublicRoute isAuthenticated={isAuthenticated} />}>
        <Route path="/" element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      //protected routes
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route path="home" element={<Home />} />
        <Route path="test/comments" element={<TestComments />} />
        <Route path="admin/categories" element={<AdminCategories />} />
      </Route>
    </Routes>
  )
}

export default App
