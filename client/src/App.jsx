
import './App.css'
import Login from './components/Login'
import { Register } from './components/Register'
import { Home } from './pages/home'
import { Routes, Route} from 'react-router-dom'
import AdminCategories from './pages/AdminCategories';
import TestComments from './pages/TestComments';

function App() {
  return (
    
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="home" element={<Home />} />
      <Route path="test/comments" element={<TestComments />} />
      <Route path="admin/categories" element={<AdminCategories />} />
      

    </Routes>
  )

}

export default App
